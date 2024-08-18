var timer = null;
var PressTime = -15;
var mouseX;
var mouseY;
var start_pt = null;
var closest_pt = null;
var closest_dis = Infinity;
var connected = false;
var line_to_remove = null;
var key = 0;

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
  if (connected || (d > Math.sqrt((mouseX - x1) ** 2 + (mouseY - y1) ** 2))) {
    newX = mouseX;
    newY = mouseY;
    connected = true;
    approaching.style.display = "none";
    line1.classList.add("connected");
    line2.classList.add("connected");
    if (line_to_remove) {
      line1.classList.add("remove");
      line_to_remove.classList.add("beRemoved");
    }
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
  if (!connected) {
    approaching.setAttribute("cx", newX);
    approaching.setAttribute("cy", newY);
    approaching.style.display = "block";
  }
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
  if (!temp_closest_pt) {
    line2.style.display = "none";
    return;
  }

  // if closest point updated
  if (temp_closest_pt !== closest_pt) {
    if (closest_pt) {
      closest_pt.classList.remove("closest");
    }
    closest_pt = temp_closest_pt;
    closest_pt.classList.add("closest");
    closest_dis = temp_closest_dis;
    PressTime = 0;
    connected = false;
    if (line_to_remove) {
      line_to_remove.classList.remove("beRemoved");
      line_to_remove = null;
      line1.classList.remove("remove");
      line2.classList.remove("remove");
    }
    line1.classList.remove("connected");
    line2.classList.remove("connected");

    // check if the line exists
    var lines = svg.querySelectorAll("line");
    var pt1 = start_pt.getAttribute("key");
    var pt2 = closest_pt.getAttribute("key");
    lines.forEach((line) => {
      if ((line === line1) || (line === line2)) return;
      var ptr1 = line.getAttribute("pt1");
      var ptr2 = line.getAttribute("pt2");
      if ((ptr1 === pt1 && ptr2 === pt2) ||
        (ptr1 === pt2 && ptr2 === pt1)) {
        line2.classList.add("remove");
        line_to_remove = line;
      }
    });
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
  if (connected) {
    if (line_to_remove) {
      svg.removeChild(line_to_remove);
      line1.classList.remove("remove");
      line2.classList.remove("remove");
      line_to_remove = null;
    }
    else {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", start_pt.getAttribute("cx"));
      line.setAttribute("y1", start_pt.getAttribute("cy"));
      line.setAttribute("x2", closest_pt.getAttribute("cx"));
      line.setAttribute("y2", closest_pt.getAttribute("cy"));
      line.setAttribute("pt1", start_pt.getAttribute("key"));
      line.setAttribute("pt2", closest_pt.getAttribute("key"));
      svg.appendChild(line);
    }
    connected = false;
    line1.classList.remove("connected");
    line2.classList.remove("connected");
  }
  clearInterval(timer);
  timer = null;
  PressTime = -15;
  line1.style.display = "none";
  line2.style.display = "none";
  approaching.style.display = "none";
  start_pt = null;
  if (closest_pt) {
    closest_pt.classList.remove("closest");
    closest_pt = null;
  }
  if (line_to_remove) {
    line_to_remove.classList.remove("beRemoved");
    line_to_remove = null;
  }
});

svg.addEventListener('mousemove', (e) => {
  updateXY(e);
  if (timer) {
    updateSvg();
  }
});

/* --- add/remove node --- */

function addNode(e) {
  e.preventDefault();
  var pts = svg.querySelectorAll("circle");
  var bool = false;
  pts.forEach((pt) => {
    var x2 = pt.getAttribute("cx");
    var y2 = pt.getAttribute("cy");
    var distance = Math.sqrt((mouseX - x2) ** 2 + (mouseY - y2) ** 2);
    if (distance < 30) {
      svg.removeChild(pt);
      var lines = svg.querySelectorAll("line");
      lines.forEach((line) => {
        if (line.getAttribute("pt1") === pt.getAttribute("key") ||
          line.getAttribute("pt2") === pt.getAttribute("key")) {
          svg.removeChild(line);
        }
      });
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
  circle.setAttribute("key", key);
  key++;
  svg.appendChild(circle);
}

svg.addEventListener('dblclick', addNode);

svg.addEventListener('auxclick', addNode);

svg.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});