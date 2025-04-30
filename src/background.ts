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
        // Extract and parse the content key
        const parsedContent = JSON.parse(analysis.content);

        // Store the parsed content in chrome.storage
        chrome.storage.local.set({ analysis: parsedContent }, () => {
          console.log('Analysis stored in chrome.storage', parsedContent);

          // Check if there's an issue in the analysis
          if (parsedContent.analysis.sentimentAnalysis.sentimentScore > 0.7) {
            // Open the extension's popup window
            chrome.action.openPopup();
          }

          sendResponse({ analysis: parsedContent });
        });
      })
      .catch(error => console.error('something went wrong', error));

    return true; // Keep the message channel open for sendResponse
  }
});
