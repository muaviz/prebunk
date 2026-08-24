let currentAbortController = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "prebunk-analyze",
      title: "Prebunk this text",
      contexts: ["selection"]
    });
  });

  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "prebunk-analyze" && info.selectionText) {
    const selectedText = info.selectionText;
    
    if (tab && tab.windowId) {
      try {
        await chrome.sidePanel.open({ windowId: tab.windowId });
      } catch (e) {
        console.error("Failed to open side panel", e);
      }
    }
    
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();
    const requestId = Date.now();

    await chrome.storage.local.set({
      selectedText,
      analysisResult: null,
      status: "loading",
      errorMessage: null,
      requestId
    });
    
    const result = await chrome.storage.sync.get(["apiUrl"]);
    const rawApiUrl = result.apiUrl || "https://prebunk-api-nctr.onrender.com";
    const cleanApiUrl = rawApiUrl.trim().replace(/\/+$/, "");
    
    try {
      const timeoutId = setTimeout(() => currentAbortController.abort(), 45000);
      const response = await fetch(`${cleanApiUrl}/extension/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: selectedText
        }),
        signal: currentAbortController.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let detail = `Server returned ${response.status}`;
        try {
          const errData = await response.json();
          detail = errData.detail || errData.error || detail;
        } catch {}
        throw new Error(detail);
      }
      
      const data = await response.json();
      
      const currentStorage = await chrome.storage.local.get(["requestId"]);
      if (currentStorage.requestId === requestId) {
        await chrome.storage.local.set({
          analysisResult: data,
          status: "done",
          errorMessage: null
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') return;

      const currentStorage = await chrome.storage.local.get(["requestId"]);
      if (currentStorage.requestId === requestId) {
        let message = error.message || "Failed to connect to the Prebunk API.";
        if (message === "Failed to fetch") {
          message = "Cannot reach Prebunk API. Check your connection or API URL in Settings.";
        }
        await chrome.storage.local.set({
          analysisResult: null,
          status: "error",
          errorMessage: message
        });
      }
    }
  }
});
