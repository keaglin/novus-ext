// Request active tab status
chrome.runtime.sendMessage({ type: 'CHECK_ACTIVE_TAB' }, (response) => {
  if (response.isActive) {

    const pageData = getPageContentAndMetadata();
    chrome.runtime.sendMessage({ type: 'PAGE_DATA', data: pageData });
  }
});

// Get the full page content and metadata
function getPageContentAndMetadata() {
  const pageUrl = window.location.href;
  const content = document.body.innerText;
  const links = Array.from(document.querySelectorAll('a')).map(link => ({
    text: link.innerText,
    href: link.href
  }));
  const metadata = Array.from(document.querySelectorAll('meta')).map(meta => ({
    name: meta.name,
    property: meta.getAttribute('property'),
    content: meta.content
  }));
  const scripts = Array.from(document.querySelectorAll('script')).map(script => ({
    src: script.src,
    innerHTML: script.innerHTML
  }));

  return { content, links, metadata, pageUrl, scripts };
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'ANALYSIS_COMPLETE') {
    // Change the extension icon to alert the user
    alertUser();
    // Optionally, open the popup
    // chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
  }
});

function alertUser() {
  // For example, you could display an alert or highlight the content
  console.log('Brand Name found on this page!');
}
