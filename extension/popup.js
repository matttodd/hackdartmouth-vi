window.onload = function () {
  document.getElementById("submit").onclick = getDOM;
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
  console.log("asking for DOM")
  var query = { active: true, currentWindow: true }
  chrome.tabs.query(query, function(tab) {
    console.log(tab)
    chrome.tabs.sendMessage(tab[0].id, 'getDOM');
  });
};

// var linkedInRegex = /^https?:\/\/(?:[^./?#]+\.)?linkedin\.com[]/;
