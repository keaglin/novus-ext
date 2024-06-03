// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'getWebpageContent') {
//     // Save the text content to a file
//     chrome.downloads.download({
//       filename: `${Date.now()}.txt`,
//       conflictAction: 'uniquify',
//       saveAs: true,
//       url: `data:text/plain;charset=utf-8,${encodeURIComponent(request.content)}`
//     });
//   }
// });

// background.js

chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
  console.table(message)
  if (message.type === 'INITIAL_CONTENT' || message.type === 'CONTENT_DIFF') {
    const content = message.data;

    // Process the content to find mentions of "Brand Name"
    const brandNameFound = content.some(diff => {
      console.log('diff', diff)
      return diff[1].toLowerCase().includes('google')
    });

    if (brandNameFound) {
      // Send a message back to the content script
      chrome.tabs.sendMessage(sender.tab?.id, { type: 'BRAND_NAME_FOUND' });

      // Change the extension icon to alert the user
      // chrome.action.setIcon({ path: 'assets/icon-alert.png', tabId: sender.tab?.id });
      chrome.action.setBadgeText({ text: '!', tabId: sender.tab?.id });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: sender.tab?.id });
    }
  }

  // Listen for a message to open the popup
  if (message.type === 'OPEN_POPUP') {
    chrome.action.openPopup();
  }
});
