// content.js
// chrome.runtime.sendMessage({ action: 'getWebpageContent', content: document.body.outerHTML });

import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();
let previousContent = getViewportContent();

// Send initial content to background script
chrome.runtime.sendMessage({ type: 'INITIAL_CONTENT', data: previousContent });

window.addEventListener('scroll', () => {
  const currentContent = getViewportContent();
  if (currentContent !== previousContent) {
    const diffs = dmp.diff_main(previousContent, currentContent);
    dmp.diff_cleanupSemantic(diffs);

    // Send diffs to background script
    chrome.runtime.sendMessage({ type: 'CONTENT_DIFF', data: diffs });

    previousContent = currentContent;
  }
});

function getViewportContent() {
  const viewportHeight = window.innerHeight;
  const elements = document.elementsFromPoint(viewportHeight / 2, viewportHeight / 2);

  let textContent = '';
  elements.forEach((element) => {
    if (element instanceof HTMLElement && element.offsetParent !== null) {
      textContent += element.innerText;
    }
  });

  return textContent;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'BRAND_NAME_FOUND') {
    // Change the extension icon to alert the user
    alertUser();
    // Optionally, open the popup
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
  }
});

function alertUser() {
  // For example, you could display an alert or highlight the content
  console.log('Brand Name found on this page!');
}
