var timer = null;
var PressTime = 0;
var mouseX;
var mouseY;
var start_pt = null;

const svg = document.querySelector("svg");
const line1 = svg.querySelector("#line1");

function updateSvg() {
  var points = svg.querySelectorAll("circle");
  // update line of start point to cursor
  if (!start_pt) {
    points.forEach((pt) => {
      var x2 = pt.getAttribute("cx");
      var y2 = pt.getAttribute("cy");
      var distance = Math.sqrt((mouseX - x2) ** 2 + (mouseY - y2) ** 2);
      if (distance < 30) {
        start_pt = pt;
        line1.style.display = "block";
        line1.setAttribute("x1", x2);
        line1.setAttribute("y1", y2);
        return;
      }
    });
  }
  line1.setAttribute("x2", mouseX);
  line1.setAttribute("y2", mouseY);
}

function updateXY(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

svg.addEventListener('mousedown', (e) => {
  updateXY(e);
  if (!timer) {
    timer = setInterval((e) => {
      PressTime++;
      updateSvg();
    }, 10);
  }
});

svg.addEventListener('mouseup', () => {
  clearInterval(timer);
  timer = null;
  PressTime = 0;
  line1.style.display = "none";
  start_pt = null;
});

svg.addEventListener('mousemove', (e) => {
  updateXY(e);
  if (timer) {
    updateSvg();
  }
});

svg.addEventListener('dblclick', (e) => {
  e.preventDefault();
  var pts = svg.querySelectorAll("circle");
  var bool = false;
  pts.forEach((pt) => {
    var x2 = pt.getAttribute("cx");
    var y2 = pt.getAttribute("cy");
    var distance = Math.sqrt((mouseX - x2) ** 2 + (mouseY - y2) ** 2);
    if (distance < 30) {
      svg.removeChild(pt);
      bool = true;
      return;
    }
    if (distance < 60) {
      bool = true;
    }
  });
  if (bool) return;
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", mouseX);
  circle.setAttribute("cy", mouseY);
  circle.setAttribute("r", 5);
  circle.setAttribute("fill", "white");
  svg.appendChild(circle);
});