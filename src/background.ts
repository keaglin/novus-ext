

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
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
    const content = message.data;

    // call server endpoint to get openai completion - debounce this?
    try {
      const analysis = await fetch('http://novus.local:3000/api/v1/analyze-content', {
        method: 'post',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
      console.log('res', analysis);

    } catch (error) {
      console.error('something went wrong', error);
    }

    // Process the content to find mentions of "Brand Name"
    const brandNameFound = content.some((diff: string) => {
      console.log('diff', diff);
      return diff.toLowerCase().includes('google');
    });

    if (brandNameFound) {
      // Send a message back to the content script
      chrome.tabs.sendMessage(sender.tab?.id, { type: 'BRAND_NAME_FOUND' });

      // Change the extension icon to alert the user
      chrome.action.setBadgeText({ text: '!', tabId: sender.tab?.id });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: sender.tab?.id });
    }
  }
});


