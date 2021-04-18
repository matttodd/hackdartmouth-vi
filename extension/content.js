var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

console.log("content loaded");
// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  console.log("message recieved");
  if (msg == "getDOM") {
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    console.log("callback hit");
    doStuffWithDom(document.body.innerHTML, location.href);
    // sendResponse(document.body.innerHTML);
  }
});

function doStuffWithDom(domContent, url) {
  console.log(url);
  console.log("I received the following DOM content:\n" + domContent);
  if (url.includes("linkedin.com")) {
    // Fill out this way
    // Company
    let companyName = $(".jobs-details-top-card__company-url").text().trim();
    // Title
    let title = $(".jobs-details-top-card__job-title").text().trim();
    // Location
    companyInfo = $(".jobs-details-top-card__company-info")[0].childNodes;
    var spans = [];
    companyInfo.forEach((element) => {
      if (element.tagName == "SPAN") {
        spans.push(element);
      }
    });
    // console.log(spans);
    let location = spans[2].textContent.trim();

    // alert(`applying to company with ${companyName}, ${title}, ${location}, at ${url}`);
    chrome.runtime.sendMessage({
      msg: "updatePopup",
      company: companyName,
      title: title,
      location: location,
      url: url,
    });
  } else {
    // Dunno how to do it make it blank
    alert("uh oh");
  }
}
