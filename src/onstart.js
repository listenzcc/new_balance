// File: onstart.js
// Aim: Javascript runs onstart of the index.html

// Welcome message
console.log("Welcome to the balance sheet.");

// Fill #contents div
d3.json("latest.json").then(function (data) {
  console.log(data);
  d3.select("#contents")
    .selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text(function (d) {
      console.log(d);
      return d;
    });
});
