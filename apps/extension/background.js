chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "prebunk-analyze",
    title: "Prebunk this text",
    contexts: ["selection"]
  });
});

// Open side panel when the extension icon in the toolbar is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "prebunk-analyze" && info.selectionText) {
    const selectedText = info.selectionText;
    
    // Automatically open the side panel on the current window
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (e) {
      console.error("Failed to open side panel", e);
    }
    
    // Store loading state
    await chrome.storage.local.set({
      selectedText,
      analysisResult: null,
      status: "loading",
      errorMessage: null
    });
    
    // Fetch API URL from sync storage or use default
    const result = await chrome.storage.sync.get(["apiUrl"]);
    const API_BASE_URL = result.apiUrl || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${API_BASE_URL}/extension/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: selectedText,
          threshold: 0.55 
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      await chrome.storage.local.set({
        analysisResult: data,
        status: "done",
        errorMessage: null
      });
    } catch (error) {
      await chrome.storage.local.set({
        analysisResult: null,
        status: "error",
        errorMessage: error.message || "Failed to connect to the Prebunk API."
      });
    }
  }
});
