// Request active tab status
chrome.runtime.sendMessage({ type: 'CHECK_ACTIVE_TAB' }, (response) => {
  console.log('CHECK_ACTIVE_TAB response:', response);
  if (response && response.isActive) {
    const pageData = getPageContentAndMetadata();
    chrome.runtime.sendMessage({ type: 'PAGE_DATA', data: pageData });
  } else {
    console.error('Active tab check failed or response is undefined');
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
    // Forward the analysis data to the React app
    window.postMessage({ type: 'ANALYSIS_COMPLETE', data: message.data }, '*');
  }
});
