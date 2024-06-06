// background.js
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



chrome.runtime.onMessage.addListener(async (message, sender, _sendResponse) => {
  console.table(message)
  let content
  if (message.type === 'INITIAL_CONTENT') {
    content = message.data
    console.log('content', content)
  }

  if (message.type === 'CONTENT_DIFF') {
    const diffs = message.data;
    content = getAddedContent(diffs);
    console.log('Added content:', content);
  }

  // call server endpoint to get openai completion - debounce this?
  try {
    const res = await fetch('https://parakeet-integral-cheaply.ngrok-free.app/api/v1/analyze-content', {
      method: 'post',
      body: JSON.stringify({
        content
      })
    })
    console.log('res', res)
  } catch (error) {
    console.error('something went wrong', error)
  }




  // Process the content to find mentions of "Brand Name"
  const brandNameFound = content.some((diff: string) => {
    console.log('diff', diff)
    return diff.toLowerCase().includes('google')
  });

  if (brandNameFound) {
    // Send a message back to the content script
    chrome.tabs.sendMessage(sender.tab?.id, { type: 'BRAND_NAME_FOUND' });

    // Change the extension icon to alert the user
    // chrome.action.setIcon({ path: 'assets/icon-alert.png', tabId: sender.tab?.id });
    chrome.action.setBadgeText({ text: '!', tabId: sender.tab?.id });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: sender.tab?.id });
  }

  // Show a notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Scam Alert',
    message: 'Potential scam detected. Click to learn more.',
    buttons: [{ title: 'Learn More' }],
    priority: 0
  });

  // Handle notification click
  chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
  });
}


  // // Listen for a message to open the popup
  // if (message.type === 'OPEN_POPUP') {
  //   chrome.action.openPopup();
  // }
);

function getAddedContent(diffs: [number, string][]): string[] {
  return diffs
    .filter(diff => diff[0] === 1) // Filter to get only the tuples with a 1
    .map(diff => diff[1]);         // Extract the content from these tuples
}
