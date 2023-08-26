// main
window.onbeforeunload = function() {
  return "Would you really like to close your browser?";
};

// others
window.onpageshow = function() {
  document.getElementById("changable").style = "display: inline-block";
};

window.onclick = function() {
  document.getElementById("changable").style = 'display: none';
};