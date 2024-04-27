chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    }, () => {
      const detailUrl = encodeURIComponent(tab.url);
      const detailTitle = encodeURIComponent(tab.title);
      chrome.windows.create({
        url: `window.html?url=${detailUrl}&title=${detailTitle}&tabId=${tab.id}`,
        type: 'popup',
        width: 800,
        height: 600
      });
    });
  });
  