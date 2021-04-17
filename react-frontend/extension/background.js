function startApplication(pageDOM) {
  console.log(pageDOM);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.msg == "trackApplication") {
    chrome.tabs.getSelected(null, function (tab) {
      // Now inject a script onto the page
      chrome.tabs.executeScript(
        tab.id,
        {
          code:
            "chrome.extension.sendRequest({content: document.body.innerHTML}, function(response) { console.log('success'); });",
        },
        function (pageDOM) {
          startApplication(pageDOM);
        }
      );
    });
  }
});
