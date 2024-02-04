var form = document.querySelector('#form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  var str = document.querySelector("#str").value;
  var result = document.querySelector("#result");
  var err = document.querySelector("#err");
  var url = `https://ww2.mathworks.cn/help/matlab/ref/${str}.html`;
  
  // Check if the URL exists
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // URL exists, display it in the iframe
        result.src = url;
        result.style.display = 'block';
        err.textContent = '';
      } else {
        // URL does not exist, hide the iframe and show error message
        result.style.display = 'none';
        err.textContent = `${str} not found.`;
      }
    }
  };
  xhr.send();
});