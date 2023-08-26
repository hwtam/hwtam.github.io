// main
window.onbeforeunload = function() {
  return "Would you really like to close your browser?";
};

// testing
window.onpageshow = function() {
  document.getElementById("changable").innerHTML = "Please <strong>click</strong> anywhere to activate the script.";
};

window.onclick = function() {
  document.getElementById("changable").innerHTML = '';
};
// To Do
// for example : if you try to duplicate the tab, it won't work well. Other event handler works well(focus).