chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'CHECK_ACTIVE_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && sender.tab && activeTab.id === sender.tab.id) {
        sendResponse({ isActive: true });
      } else {
        sendResponse({ isActive: false });
      }
    });
    return true; // Keep the message channel open for sendResponse
  }

  if (message.type === 'PAGE_DATA') {
    console.table(message);
    const pageData = message.data;

    fetch('http://novus.local:3000/api/v1/analyze-content', {
      method: 'post',
      body: JSON.stringify({ pageData }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(analysis => {
        // Store the analysis in chrome.storage
        chrome.storage.local.set({ analysis }, () => {
          console.log('Analysis stored in chrome.storage', analysis);

          // Check if there's an issue in the analysis
          if (analysis.issueDetected) {
            // Open the extension's popup window
            chrome.action.openPopup();
          }

          sendResponse({ analysis });
        });
      })
      .catch(error => console.error('something went wrong', error));

    return true; // Keep the message channel open for sendResponse
  }
});
