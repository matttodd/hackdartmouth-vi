window.onload = function () {
  // console.log(startTimer)
  document.getElementById("submit").onclick = sendStart;
};

//   chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse){
//       console.log(request)
//       if(request.msg == "send_timer") {
//       }
//     }
//   );

function sendStart() {
  chrome.runtime.sendMessage({
    msg: "trackApplication",
  });
}
