let recording = false;

// Listen for messages from the popup or parent frame
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleRecording") {
    toggleRecording(request.status);
    // Propagate the recording status to all child iframes
    propagateToIframes(request);
    sendResponse({status: "Recording toggled to " + request.status});
  } else if (request.action === "clearXPaths") {
    // Clear logic if necessary
  }
});

// Propagate messages to child iframes
function propagateToIframes(request) {
  Array.from(document.querySelectorAll('iframe')).forEach(iframe => {
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(request, '*');
      }
    } catch (error) {
      console.error("Error posting message to iframe:", error);
    }
  });
}

// Toggle recording status and add or remove event listeners
function toggleRecording(status) {
  recording = status;
  if (recording) {
    document.addEventListener('click', handleDocumentClick, true);
  } else {
    document.removeEventListener('click', handleDocumentClick, true);
  }
}


function handleDocumentClick(event) {
    try {
        if (!recording || !document.documentElement.contains(event.target)) return;
        event.preventDefault();
        event.stopPropagation();
        const xpath = getElementXPath(event.target);
        chrome.runtime.sendMessage({action: "recordXPath", xpath: xpath});
        localStorage.setItem('xpaths', JSON.stringify([...JSON.parse(localStorage.getItem('xpaths') || '[]'), xpath]));
        event.target.style.border = "2px solid red";
    } catch (error) {
        console.error("Error handling click:", error);
    }
}


// Function to compute XPath remains the same as previously provided
function getElementXPath(element) {
  if (element.id !== '') {
    return 'id("' + element.id + '")';
  }
  var path = [];
  while (element.nodeType === Node.ELEMENT_NODE) {
    var index = 0;
    var sibling = element.previousSibling;
    while (sibling) {
      if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
        sibling = sibling.previousSibling;
        continue;
      }
      if (sibling.nodeName === element.nodeName) {
        index++;
      }
      sibling = sibling.previousSibling;
    }
    var tagName = element.nodeName.toLowerCase();
    var pathIndex = (index ? "[" + (index+1) + "]" : "");
    path.unshift(tagName + pathIndex);
    element = element.parentNode;
  }
  return path.length ? "/" + path.join("/") : null;
}

console.log("Content script loaded and ready, including iframes.");
