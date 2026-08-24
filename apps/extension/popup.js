document.addEventListener('DOMContentLoaded', async () => {
  const views = {
    idle: document.getElementById('state-idle'),
    loading: document.getElementById('state-loading'),
    error: document.getElementById('state-error'),
    nomatch: document.getElementById('state-nomatch'),
    match: document.getElementById('state-match'),
    settings: document.getElementById('settings-view'),
    main: document.getElementById('main-view')
  };

  const showView = (viewName) => {
    Object.values(views).forEach(v => {
      if (v) v.classList.add('hidden');
    });
    views.main.classList.remove('hidden');
    views[viewName].classList.remove('hidden');
  };

  const updateUI = (state) => {
    if (!state.status || state.status === 'idle') {
      showView('idle');
    } else if (state.status === 'loading') {
      showView('loading');
    } else if (state.status === 'error') {
      document.getElementById('error-message').textContent = state.errorMessage;
      showView('error');
    } else if (state.status === 'done') {
      const result = state.analysisResult;
      if (!result || !result.matched || !result.claim) {
        showView('nomatch');
      } else {
        // Populate match data
        document.getElementById('match-name').textContent = result.claim.title;
        
        // Handle UI difference for LLM generated content vs DB match
        const matchScoreEl = document.getElementById('match-score');
        const explanationContainer = document.getElementById('explanation-container');
        const explanationText = document.getElementById('match-explanation');

        if (result.is_llm_generated) {
           matchScoreEl.textContent = 'AI Detected';
           matchScoreEl.style.backgroundColor = 'var(--primary-color)'; 
           matchScoreEl.style.color = '#ffffff'; 
           
           // Show the explanation for dog whistles/slurs
           explanationText.textContent = result.claim.description;
           explanationContainer.classList.remove('hidden');
        } else {
           matchScoreEl.textContent = Math.round(result.claim.similarity_score * 100) + '% Match';
           matchScoreEl.style.backgroundColor = ''; 
           matchScoreEl.style.color = ''; 
           
           // Hide the explanation box for standard database claims (keeps UI cleaner)
           explanationContainer.classList.add('hidden');
        }
        
        const scriptElement = document.getElementById('match-script');
        const scriptContainer = document.getElementById('personal-script-container');
        if (result.prebunk && result.prebunk.personal_script) {
          scriptElement.textContent = `"${result.prebunk.personal_script}"`;
          scriptContainer.classList.remove('hidden');
        } else {
          scriptContainer.classList.add('hidden');
        }
        
        const pointsList = document.getElementById('match-points');
        pointsList.innerHTML = '';
        if (result.prebunk && result.prebunk.talking_points && result.prebunk.talking_points.length > 0) {
          result.prebunk.talking_points.forEach(tp => {
            const li = document.createElement('li');
            li.textContent = tp;
            pointsList.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = "No specific talking points available.";
          pointsList.appendChild(li);
        }

        const sourcesList = document.getElementById('match-sources');
        const sourcesContainer = document.getElementById('sources-container');
        sourcesList.innerHTML = '';
        
        // Hide sources completely for LLM generated results since we don't have exact URLs
        if (result.is_llm_generated) {
            sourcesContainer.classList.add('hidden');
        } else if (result.prebunk && result.prebunk.refutations && result.prebunk.refutations.length > 0) {
          // Show top 2 refutation sources
          result.prebunk.refutations.slice(0, 2).forEach(ref => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = ref.source_url;
            a.target = "_blank";
            a.textContent = ref.source_name;
            a.style.color = "var(--primary-color)"; 
            a.style.textDecoration = "none";
            
            li.appendChild(a);
            sourcesList.appendChild(li);
          });
          sourcesContainer.classList.remove('hidden');
        } else {
          sourcesContainer.classList.add('hidden');
        }

        // Base URL from settings for links
        chrome.storage.sync.get(["webUrl"], (res) => {
          const webUrl = res.webUrl || "http://localhost:3000";
          const learnMoreLink = document.getElementById('learn-more-link');
          
          if (result.is_llm_generated) {
             learnMoreLink.textContent = "Browse all known claims \u2192";
             learnMoreLink.href = `${webUrl}/claims`;
          } else {
             learnMoreLink.textContent = "See full refutation \u2192";
             learnMoreLink.href = `${webUrl}/claims/${result.claim.id}`;
          }
        });
        
        showView('match');
      }
    }
  };

  // Initial load
  chrome.storage.local.get(["status", "analysisResult", "errorMessage"], (result) => {
    updateUI(result);
  });

  // Listen for storage changes (when background script updates result)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && (changes.status || changes.analysisResult)) {
      chrome.storage.local.get(["status", "analysisResult", "errorMessage"], (result) => {
        updateUI(result);
      });
    }
  });

  // Copy button
  document.getElementById('copy-btn')?.addEventListener('click', () => {
    const scriptText = document.getElementById('match-script').textContent.replace(/^"|"$/g, '');
    navigator.clipboard.writeText(scriptText).then(() => {
      const btn = document.getElementById('copy-btn');
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = "Copy Response";
      }, 2000);
    });
  });

  // Settings
  document.getElementById('settings-link').addEventListener('click', (e) => {
    e.preventDefault();
    views.main.classList.add('hidden');
    views.settings.classList.remove('hidden');
    
    chrome.storage.sync.get(["apiUrl"], (result) => {
      document.getElementById('api-url').value = result.apiUrl || "http://127.0.0.1:8000";
    });
  });

  document.getElementById('close-settings').addEventListener('click', () => {
    views.settings.classList.add('hidden');
    views.main.classList.remove('hidden');
  });

  document.getElementById('save-settings').addEventListener('click', () => {
    const apiUrl = document.getElementById('api-url').value;
    chrome.storage.sync.set({ apiUrl }, () => {
      const btn = document.getElementById('save-settings');
      const originalText = btn.textContent;
      btn.textContent = "Saved!";
      setTimeout(() => {
        btn.textContent = originalText;
        views.settings.classList.add('hidden');
        views.main.classList.remove('hidden');
      }, 1000);
    });
  });
});
