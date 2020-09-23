// File: onstart.js
// Aim: Javascript runs onstart of the index.html

// Welcome message
console.log("Welcome to the balance sheet.");

// The onclick method for thead,
// used for toggle its tbody.
function thead_onclick(thead) {
  // Get parent table dom
  let table = thead.parentElement;

  // Get the first th dom
  let th = thead.getElementsByTagName("th")[0];

  // Perform toggling if it is toggle-able
  if (th.innerText[0] == "(" && th.innerText[2] == ")") {
    // Get tbody, toggle it and switch the note
    let tbody = table.getElementsByTagName("tbody")[0];
    if (toggle_visibility(tbody) == 1) {
      // tbody is visible
      th.innerText = th.innerText.replace("(+)", "(-)");
    } else {
      // tbody is hidden
      th.innerText = th.innerText.replace("(-)", "(+)");
    }
  }
}

// Parse data into D3 useable structure,
// and expose them
function expose_parsed_data(data) {
  // Parse data into D3 useable list
  // Load data
  var _subject = data.科目;
  var _name = data.名称;
  var _price = data.总价;

  // Assume [subject_index], [subject_list] and [object_list] exist
  // Init them as empty list
  // Index table of subjects
  subject_index = [];
  // List of subjects
  subject_list = [];
  // List of objects
  object_list = [];

  // Fill the lists
  for (var key in _subject) {
    // Load subject, name and price,
    // pair name and price into object
    sub = _subject[key];
    nam = _name[key];
    pri = _price[key];

    // Checkout idx of the subject
    idx = subject_index.indexOf(sub);
    if (idx == -1) {
      // If subject is not found,
      // create new entry in subject_index,
      // update subject_list synchronously
      subject_index.push(sub);
      subject_list.push({
        name: sub,
        price: 0,
        color: random_color(1, 10),
        object_idxs: [],
      });
      idx = subject_index.indexOf(sub);
    }

    // Add new object
    object_list.push({ name: nam, price: pri, subject_idx: idx });

    // Update the subject
    subject_list[idx].price += pri;
    subject_list[idx].object_idxs.push(object_list.length - 1);
  }

  console.log("Initialized lists: ");
  console.log("subject_index", subject_index);
  console.log("subject_list", subject_list);
  console.log("object_list", object_list);
}

// Create SVG
function create_svg() {
  // Creat svg and put subjects and objects on it,
  // in two columns:
  //  Column 1: Subjects
  //  Column 2: Objects in each subject
  // The height of the svg is data-driven.

  // Settings
  // !!! These part can be moved into *args of the function
  var width = 500;
  var x_subject = 100;
  var x_object = 300;
  var background_color = "beige";

  // Add new svg in #svg_container
  let svg = d3
    .select("#svg_container")
    .append("svg")
    .attr("width", width + "px");

  // Add #svg_g1 in svg,
  // it contains subjects
  var y = 50;
  var dy = 50;
  svg
    .append("g")
    .attr("id", "svg_g1")
    .selectAll("text")
    .data(subject_list)
    .enter()
    .append("text")
    .text((d) => d.name)
    .attr("fill", (d) => d.color)
    .attr("x", x_subject + "px")
    .attr("y", () => {
      y_str = y + "px";
      y += dy;
      return y_str;
    });

  // Add #svg_g2 in svg,
  // it contains objects
  y = 20;
  dy = 30;
  svg
    .append("g")
    .attr("id", "svg_g2")
    .selectAll("text")
    .data(object_list)
    .enter()
    .append("text")
    .text((d) => {
      console.log(d);
      return d.name;
    })
    .attr("fill", (d) => subject_list[d.subject_idx].color)
    .attr("x", x_object + "px")
    .attr("y", () => {
      y_str = y + "px";
      y += dy;
      return y_str;
    });

  // Set height of the svg
  svg.attr("height", y + "px");
}
// var subject_offset_x = 100;
// var object_offset_x = 300;
// var object_y = 20;
// var object_dy = 20;

// Place texts
// for (var idx in subject_index) {
//   var color = random_color(1, 10);

//   var y0 = object_y;
//   for (var i = 0; i < object_list[idx].length; i++) {
//     object_y += object_dy;
//     object_list[idx][i].dom = svg
//       .append("text")
//       .text(object_list[idx][i].name)
//       .attr("x", object_offset_x)
//       .attr("y", object_y)
//       .attr("fill", color)
//       .style("text-anchor", "middle");
//   }

//   object_y += object_dy;

//   subject_list[idx].color = color;
//   subject_list[idx].dom = svg
//     .append("text")
//     .text(subject_list[idx].subject)
//     .attr("x", subject_offset_x)
//     .attr("y", (y0 + object_y) / 2)
//     .attr("fill", color)
//     .style("text-anchor", "middle");
// }

// // Draw connections
// for (var j in subject_index) {
//   for (var k in object_list[j]) {
//     x0 = subject_list[j].dom._groups[0][0].x.baseVal[0].value;
//     y0 = subject_list[j].dom._groups[0][0].y.baseVal[0].value;
//     color = subject_list[j].color;
//     x1 = object_list[j][k].dom._groups[0][0].x.baseVal[0].value;
//     y1 = object_list[j][k].dom._groups[0][0].y.baseVal[0].value;
//     svg
//       .append("path")
//       .attr(
//         "d",
//         "M " +
//           x0 +
//           " " +
//           y0 +
//           " C" +
//           200 +
//           " " +
//           y0 +
//           " " +
//           200 +
//           " " +
//           y1 +
//           " " +
//           x1 +
//           " " +
//           y1
//       )
//       .attr("stroke", color)
//       .attr("fill", "transparent");
//   }
// }

// svg.attr(
//   "style",
//   "width: " +
//     width +
//     "px;" +
//     "height: " +
//     object_y +
//     "px;" +
//     "background-color: " +
//     background_color
// );

// console.log("subject_list", subject_list);

// svg
//   .append("circle")
//   .attr("cx", "10")
//   .attr("cy", "20")
//   .attr("r", "40")
//   .attr("stroke", "black")
//   .attr("stroke-width", "2")
//   .attr("fill", "none");

function create_tables() {
  // Create a table for each subject
  // in #contents div
  let tables = d3
    .select("#tables_container")
    .selectAll("table")
    .data(subject_index)
    .enter()
    .append("table");

  // Add thead for each table
  // subject_list is used
  tables
    .data(subject_list)
    .append("thead")
    // Attach onclick method
    .attr("onclick", "thead_onclick(this)")
    .append("tr")
    // Add two columns
    .selectAll("th")
    .data((d) => {
      return ["(-)" + d.name, d.price.toFixed(2)];
    })
    .enter()
    .append("th")
    .text((d) => d);

  // Add tbody for each table
  // object_list is used
  tables
    .data(subject_list)
    .append("tbody")
    .selectAll("tr")
    // [d] is subject object
    // use .data to bound its object_idxs
    .data((d) => d.object_idxs)
    .enter()
    .append("tr")
    // Add two columns
    .selectAll("td")
    // [d] is idx of an object
    .data((d) => {
      x = object_list[d];
      return [x.name, x.price];
    })
    .enter()
    .append("td")
    .text((d) => d);
}

var subject_index = [];
var subject_list = [];
var object_list = [];

// Fill #contents div
d3.json("latest.json").then(function (data) {
  console.log("data", data);
  expose_parsed_data(data);

  create_tables();
  create_svg();
});
