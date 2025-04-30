self.onmessage = function (event) {
  const { action, data } = event.data;

  switch (action) {
    case 'SCRAPE_CONTENT':
      const scrapedData = scrapeContent(data);
      self.postMessage({ action: 'SCRAPED_CONTENT', data: scrapedData });
      break;
    // Add other cases as needed for different actions
  }
};

function scrapeContent(content) {
  // Perform the scraping or processing here
  // For example, extracting links and their text
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const links = Array.from(doc.querySelectorAll('a')).map(link => ({
    text: link.innerText,
    href: link.href
  }));
  return links;
}

// Function to extract all webpage content and metadata
function getPageContentAndMetadata(doc) {
  const content = doc.body.innerText;
  const links = Array.from(doc.querySelectorAll('a')).map(link => ({
    text: link.innerText,
    href: link.href
  }));
  const metadata = Array.from(doc.querySelectorAll('meta')).map(meta => ({
    name: meta.name,
    content: meta.content
  }));
  const scripts = Array.from(doc.querySelectorAll('script')).map(script => ({
    src: script.src,
    innerHTML: script.innerHTML
  }));

  return { content, links, metadata, scripts };
}
