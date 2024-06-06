// content.js
// chrome.runtime.sendMessage({ action: 'getWebpageContent', content: document.body.outerHTML });

import { diff_match_patch } from 'diff-match-patch';


const dmp = new diff_match_patch();
let previousContent = getViewportContent();

// Send initial content to background script
chrome.runtime.sendMessage({ type: 'INITIAL_CONTENT', data: previousContent });

// explore this when you notice performance issues
const debouncedScrollHandler = debounce(() => scrollHandler, 300); // Adjust the debounce delay as needed

function scrollHandler() {
  const currentContent = getViewportContent();
  if (currentContent !== previousContent) {
    const diffs = dmp.diff_main(previousContent, currentContent);
    dmp.diff_cleanupSemantic(diffs);

    // Send diffs to background script
    chrome.runtime.sendMessage({ type: 'CONTENT_DIFF', data: diffs });

    previousContent = currentContent;
  }
}

window.addEventListener('scroll', scrollHandler);

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

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    // @ts-expect-error: need to fix types
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
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

// Function to extract all webpage content and metadata
// function getPageContentAndMetadata() {
//   const content = document.body.innerText;
//   const links = Array.from(document.querySelectorAll('a')).map(link => ({
//     text: link.innerText,
//     href: link.href
//   }));
//   const metadata = Array.from(document.querySelectorAll('meta')).map(meta => ({
//     name: meta.name,
//     content: meta.content
//   }));
//   const scripts = Array.from(document.querySelectorAll('script')).map(script => ({
//     src: script.src,
//     innerHTML: script.innerHTML
//   }));

//   return { content, links, metadata, scripts };
// }



// Initialize the web worker
// const worker = new Worker(chrome.runtime.getURL('worker.js'));

// worker.onmessage = function (event) {
//   const { linkComparisons, sentiment, maliciousScripts } = event.data;
//   // Handle the processed content (e.g., send it to the background script)
//   chrome.runtime.sendMessage({
//     type: 'PROCESSED_CONTENT',
//     data: { linkComparisons, sentiment, maliciousScripts }
//   });
// };



