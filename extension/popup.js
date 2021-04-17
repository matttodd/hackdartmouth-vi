window.onload = function () {
  getDOM();
  document.getElementById("submit").addEventListener("click", sendJobToDatabase);
};

// function doStuffWithDom(domContent, url) {
//   console.log(url)
//   console.log('I received the following DOM content:\n' + domContent);
//   if (url.includes("linkedin.com")) {
//     // Fill out this way
//     // Company
//     let companyName = $(".jobs-details-top-card__job-title").text
//     // Title
//     let title = $(".jobs-details-top-card__company-url").text
//     // Location
//     let location = $(".jobs-details-top-card__company-info")[2].text
//     // url
//     alert(`applying to company with ${companyName}, ${title}, ${location}, at ${url}`)
//   } else {
//     // Dunno how to do it make it blank
//     alert("uh oh")
//   }
// }

function getDOM() {
  console.log("asking for DOM");
  var query = { active: true, currentWindow: true };
  chrome.tabs.query(query, function (tab) {
    console.log(tab);
    chrome.tabs.sendMessage(tab[0].id, "getDOM");
  });
}

// var linkedInRegex = /^https?:\/\/(?:[^./?#]+\.)?linkedin\.com[]/;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  console.log("updating");
  if (msg.msg == "updatePopup") {
    $("#company-name").val(msg.company);
    $("#job-role").val(msg.title);
    $("#location").val(msg.location);
    $("#job-link").val(msg.url);
  }
});

function sendJobToDatabase() {
  let body = {
    application_link: $("#job-link").val(),
    application_status: "applied",
    company_name: $("#company-name").val(),
    // "date_applied": "Fri, 16 Apr 2021 04:00:00 GMT",
    events: [],
    job_role: $("#job-role").val(),
    notes: "",
    office_address: $("#location").val(),
  };
  console.log(body);
  chrome.runtime.sendMessage({
    msg: "sendPosting",
    body: body,
  });
  window.close()
}
