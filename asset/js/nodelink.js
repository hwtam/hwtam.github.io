var timer = null;
var PressTime = -15;
var mouseX;
var mouseY;
var start_pt = null;
var closest_pt = null;
var closest_dis = Infinity;
var connected = false;

const svg = document.querySelector("svg");
const line1 = svg.querySelector("#line1");
const line2 = svg.querySelector("#line2");
const approaching = svg.querySelector("#approaching");

function updateApproaching() {
  var x1 = parseInt(closest_pt.getAttribute("cx"));
  var y1 = parseInt(closest_pt.getAttribute("cy"));
  var d = (PressTime * 0.8) ** 1.4;
  var newX;
  var newY;
  if (d > Math.sqrt((mouseX - x1) ** 2 + (mouseY - y1) ** 2)) {
    newX = mouseX;
    newY = mouseY;
  }
  else {
    if (mouseX == x1) {
      newX = x1;
      newY = mouseY > y1 ? y1 + d : y1 - d;
    }
    else {
      var m = (mouseY - y1) / (mouseX - x1);
      var dx = Math.sqrt(d ** 2 / (1 + m ** 2));
      newX = mouseX > x1 ? x1 + dx : x1 - dx;
      newY = m * (newX - x1) + y1;
    }
  }
  approaching.setAttribute("cx", newX);
  approaching.setAttribute("cy", newY);
  approaching.style.display = "block";
  line2.setAttribute("x1", x1);
  line2.setAttribute("y1", y1);
  line2.setAttribute("x2", newX);
  line2.setAttribute("y2", newY);
  line2.style.display = "block";
}

function updateStartPoint() {
  var points = svg.querySelectorAll("circle");
  // update line of start point to cursor
  points.forEach((pt) => {
    var x2 = pt.getAttribute("cx");
    var y2 = pt.getAttribute("cy");
    var distance = Math.sqrt((mouseX - x2) ** 2 + (mouseY - y2) ** 2);
    if (distance < 30) {
      start_pt = pt;
      line1.setAttribute("x1", x2);
      line1.setAttribute("y1", y2);
      line1.setAttribute("x2", mouseX);
      line1.setAttribute("y2", mouseY);
      line1.style.display = "block";
      return;
    }
  });
}

function updateSvg() {
  if (!start_pt) {
    return;
  }
  line1.setAttribute("x2", mouseX);
  line1.setAttribute("y2", mouseY);
  // update line of the closest point approaching to cursor
  if (PressTime < 0) {
    line2.style.display = "none";
    return;
  }
  var points = svg.querySelectorAll("circle");
  var temp_closest_pt = null;
  var temp_closest_dis = Infinity;
  points.forEach((pt) => {
    if ((pt === start_pt) || (pt === approaching)) return;
    var x2 = parseInt(pt.getAttribute("cx"));
    var y2 = parseInt(pt.getAttribute("cy"));
    var distance = Math.sqrt((mouseX - x2) ** 2 + (mouseY - y2) ** 2);
    if (distance < temp_closest_dis) {
      temp_closest_dis = distance;
      temp_closest_pt = pt;
    }
  });
  if (temp_closest_pt !== closest_pt) {
    closest_pt = temp_closest_pt;
    closest_dis = temp_closest_dis;
    PressTime = 0;
  }
  if (!closest_pt) {
    line2.style.display = "none";
    return;
  }
  updateApproaching();
}

function updateXY(e) {
  mouseX = parseInt(e.pageX);
  mouseY = parseInt(e.pageY);
}

svg.addEventListener('mousedown', (e) => {
  updateXY(e);
  updateStartPoint();
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
  PressTime = -15;
  line1.style.display = "none";
  line2.style.display = "none";
  approaching.style.display = "none";
  start_pt = null;
  closest_pt = null;
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
  svg.appendChild(circle);
});