document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  document.getElementById('tabUrl').textContent = decodeURIComponent(params.get('url') || 'No URL available');
  document.getElementById('tabTitle').textContent = decodeURIComponent(params.get('title') || 'No Title available');

  const tabId = parseInt(params.get('tabId'), 10);
  const recordButton = document.getElementById('recordButton');
  const clearButton = document.getElementById('clearList');
  const xpathList = document.getElementById('xpathList');
  let recording = false;

  recordButton.addEventListener('click', function() {
    recording = !recording;
    recordButton.textContent = recording ? 'Stop Recording' : 'Start Recording';
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {action: "toggleRecording", status: recording}, function(response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message: ", chrome.runtime.lastError.message);
        }
      });
    } else {
      console.error("Invalid tab ID");
    }
  });

  clearButton.addEventListener('click', function() {
    xpathList.innerHTML = '';
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {action: "clearXPaths"});
    }
  });

  chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'recordXPath') {
      const li = document.createElement('li');
      li.textContent = message.xpath;
      xpathList.appendChild(li);
    }
  });
});
