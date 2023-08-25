// main
window.onbeforeunload = function() {
  return "Would you really like to close your browser?";
};

// testing
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    document.getElementById("bool").innerHTML = "may work";
  } else {
    document.getElementById("bool").innerHTML = "may not work";
  }
});

// To Do
// for example : if you try to duplicate the tab, it won't work well. Other event handler works well(focus).