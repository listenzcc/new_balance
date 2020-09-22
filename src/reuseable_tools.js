// File: reuseable_tools.js
// Aim: Provide re-use-able javascript tools

console.log("Re-use-able tools is loading.");

// Toggle the visibility of the dom
function toggle_visibility(dom) {
  if (dom.style.display != "none") {
    // Dom is not hidden,
    // hide it
    dom.default_display = dom.style.display;
    dom.style.display = "none";
    return 0;
  } else {
    // Dom is hidden,
    // show it
    dom.style.display = dom.default_display;
    return 1;
  }
}

// Calculate random position in range,
// range: [width, height]
function random_position(xmin, xmax, ymin, ymax, edge) {
  xmin += edge;
  xmax -= edge;
  ymin += edge;
  ymax -= edge;
  var x = (xmax - xmin) * Math.random() + xmin;
  var y = (ymax - ymin) * Math.random() + ymin;
  return [x + edge, y + edge];
}

// Formulate random color in range of [vmin, vmax]
// vmin is not larger than vmax
// vmin > 0 and vmax < 16
// The less of vmax - vmin, the smaller range of colors,
// The less of vmax, the darker of the color
function random_color(vmin, vmax) {
  var string = "#";
  for (var i = 0; i < 6; i++) {
    c = parseInt(Math.random() * (vmax - vmin) + vmin);
    string += c.toString(16);
  }
  return string;
}
