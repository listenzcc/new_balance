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
  var height_unit = 50;

  // Add new svg in #svg_container
  let svg = d3
    .select("#svg_container")
    .append("svg")
    .attr("width", width + "px");

  // Add #svg_g1 in svg,
  // it contains subjects
  var y = 50;
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
      y += height_unit;
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
      y += height_unit;
      return y_str;
    });

  // Set height of the svg
  svg.attr("height", y + "px");
}

// Create tables for each subject
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

// The scripts starts here
// Expose global variables
var subject_index = [];
var subject_list = [];
var object_list = [];

// Load json data
d3.json("latest.json").then(function (data) {
  console.log("data", data);
  // Fill the data into global lists
  // subject_index, subject_list and object_list will be filled
  expose_parsed_data(data);

  // Create tables based on data
  create_tables();

  // Create svg based on data
  create_svg();
});
