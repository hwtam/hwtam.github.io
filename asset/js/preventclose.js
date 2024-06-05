// main
// window.onbeforeunload = function() {
//   return "Would you really like to close your browser?";
// };

window.addEventListener("beforeunload", function(e) {
  e.preventDefault();
});

// others
window.onpageshow = function() {
  document.getElementById("changable").style = "display: inline-block";
  changeFavicon("/asset/img/warning.ico");
};

window.onclick = function() {
  document.getElementById("changable").style = 'display: none';
  changeFavicon("/asset/img/brain.ico");
};

// https://poe.com/s/loMCUJOXr7QJvDFmKarp
function changeFavicon(newFaviconUrl) {
  const head = document.head;
  const existingFavicon = document.querySelector('link[rel="icon"]');

  // Create a new link element for the favicon
  const newFavicon = document.createElement('link');
  newFavicon.rel = 'icon';
  newFavicon.href = newFaviconUrl;

  // Replace the existing favicon if it exists
  if (existingFavicon) {
    head.removeChild(existingFavicon);
  }

  // Append the new favicon to the head
  head.appendChild(newFavicon);
}