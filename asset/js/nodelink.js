var timer;
var PressTime;

const svg = document.querySelector("svg");

function updateSvg(e) {
  var x1 = e.pageX;
  var y1 = e.pageY;
  var points = svg.querySelectorAll("circle");
}

// svg.addEventListener('mousedown', (e) => {
//   if (!timer) {
//     timer = setInterval((e) => {
//       PressTime++;
//       updateSvg(e);
//     }, 10);
//   }
// });

// svg.addEventListener('mouseup', () => {
//   clearInterval(timer);
//   timer = null;
//   PressTime = 0
// });

svg.addEventListener('dblclick', (e) => {
  e.preventDefault();
  var x = e.pageX;
  var y = e.pageY;
  var pts = svg.querySelectorAll("circle");
  var bool = false;
  pts.forEach((pt) => {
    var x2 = pt.getAttribute("cx");
    var y2 = pt.getAttribute("cy");
    var distance = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
    if (distance < 30) {
      svg.removeChild(pt);
      bool = true;
    }
  });
  if (bool) return;
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 5);
  circle.setAttribute("fill", "white");
  svg.appendChild(circle);
});