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
