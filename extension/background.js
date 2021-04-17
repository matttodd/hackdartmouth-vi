chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    console.log("posting")
    if (msg.msg == 'sendPosting') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        console.log("request sent")
        var xhttp = new XMLHttpRequest();
        // xhttp.onreadystatechange = function() {
        //      if (this.readyState == 4 && this.status == 200) {
        //          alert(this.responseText);
        //      }
        // };
        console.log(msg.body)
        xhttp.open("POST", "https://todo-tq6kugb4ia-uc.a.run.app/applications/XYrpS0dU2ATb44u15KWy9qNfP9q1", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(msg.body));
        // sendResponse(document.body.innerHTML);
    }
  });