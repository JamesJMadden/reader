import { Readability, isProbablyReaderable } from '@mozilla/readability';

console.log('content script loaded');

console.log('%c TEST: index.ContentScript', 'background-color:black;color:deeppink;padding:8px', {
  document,
  tabs: chrome.tabs,
  runtime: chrome.runtime,
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('%c TEST: ContentScript.index ', 'background-color:black;color:deeppink;padding:8px', {
    request,
    sender,
    sendResponse,
  });

  switch (request.action) {
    case 'check-page-for-readability': {
      sendResponse(isProbablyReaderable(document));
      break;
    }

    case 'read-article': {
      const documentClone = document.cloneNode(true) as Document;
      const article = new Readability(documentClone).parse();

      sendResponse(article);
      break;
    }
  }
});
