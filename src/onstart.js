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

// Parse data into D3 useable structure
function parse_data(data) {
  // Parse data into D3 useable list
  // Load data
  var _subject = data.科目;
  var _name = data.名称;
  var _price = data.总价;

  // Init subject_list, object_list
  var subject_idx = [];
  var subject_list = [];
  var object_list = [];
  for (var key in _subject) {
    // Load subject, name and price,
    // pair name and price into object
    sub = _subject[key];
    nam = _name[key];
    pri = _price[key];
    object = { name: nam, price: pri };

    // If subject is not in subject_idx,
    // 1. push it into subject_idx
    // 2. push subject into subject_list synchronous
    // 3. prepare empty list in object_list at the same idx
    if (subject_idx.indexOf(sub) == -1) {
      subject_idx.push(sub);
      subject_list.push({ subject: sub, price: 0 });
      object_list.push([]);
    }

    // Push the object
    // Update the price
    idx = subject_idx.indexOf(sub);
    object_list[idx].push(object);
    subject_list[idx].price += object.price;
  }

  return [subject_idx, subject_list, object_list];
}

// Create SVG
function create_svg(subject_idx, subject_list, object_list) {
  // Creat svg and put subjects and objects on it,
  // in two columns:
  //  Column 1: Subjects
  //  Column 2: Objects in each subject
  var scale = 1.0;
  var height = 500;
  var width = 500;
  var background_color = "beige";

  // Add svg and set its style
  let svg = d3.select("#svg_container").append("svg");

  var subject_offset_x = 100;
  var object_offset_x = 300;
  var object_y = 20;
  var object_dy = 20;

  // Place texts
  for (var idx in subject_idx) {
    var color = random_color(1, 10);

    var y0 = object_y;
    for (var i = 0; i < object_list[idx].length; i++) {
      object_y += object_dy;
      object_list[idx][i].dom = svg
        .append("text")
        .text(object_list[idx][i].name)
        .attr("x", object_offset_x)
        .attr("y", object_y)
        .attr("fill", color)
        .style("text-anchor", "middle");
    }

    object_y += object_dy;

    subject_list[idx].color = color;
    subject_list[idx].dom = svg
      .append("text")
      .text(subject_list[idx].subject)
      .attr("x", subject_offset_x)
      .attr("y", (y0 + object_y) / 2)
      .attr("fill", color)
      .style("text-anchor", "middle");
  }

  // Draw connections
  for (var j in subject_idx) {
    for (var k in object_list[j]) {
      x0 = subject_list[j].dom._groups[0][0].x.baseVal[0].value;
      y0 = subject_list[j].dom._groups[0][0].y.baseVal[0].value;
      color = subject_list[j].color;
      x1 = object_list[j][k].dom._groups[0][0].x.baseVal[0].value;
      y1 = object_list[j][k].dom._groups[0][0].y.baseVal[0].value;
      svg
        .append("path")
        .attr(
          "d",
          "M " +
            x0 +
            " " +
            y0 +
            " C" +
            200 +
            " " +
            y0 +
            " " +
            200 +
            " " +
            y1 +
            " " +
            x1 +
            " " +
            y1
        )
        .attr("stroke", color)
        .attr("fill", "transparent");
    }
  }

  svg.attr(
    "style",
    "width: " +
      width +
      "px;" +
      "height: " +
      object_y +
      "px;" +
      "background-color: " +
      background_color
  );

  console.log("subject_list", subject_list);

  // svg
  //   .append("circle")
  //   .attr("cx", "10")
  //   .attr("cy", "20")
  //   .attr("r", "40")
  //   .attr("stroke", "black")
  //   .attr("stroke-width", "2")
  //   .attr("fill", "none");
}

// Fill #contents div
d3.json("latest.json").then(function (data) {
  console.log("data", data);
  // Parse data
  //  subject 1
  //    |-- object 1
  //    |-- object 2
  //    `-- ...
  //  subject 2
  //    |-- object 1
  //    `-- object 2
  //  ...
  var parsed = parse_data(data);
  var subject_idx = parsed[0];
  var subject_list = parsed[1];
  var object_list = parsed[2];
  console.log("subject_idx", subject_idx);
  console.log("subject_list", subject_list);
  console.log("object_list", object_list);

  // Create a table for each subject
  // in #contents div
  let tables = d3
    .select("#contents_container")
    .selectAll("table")
    .data(subject_idx)
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
      return ["(-)" + d.subject, d.price];
    })
    .enter()
    .append("th")
    .text((d) => d);

  // Add tbody for each table
  // object_list is used
  tables
    .data(object_list)
    .append("tbody")
    .selectAll("tr")
    .data((d) => d)
    .enter()
    .append("tr")
    // Add two columns
    .selectAll("td")
    .data((d) => {
      return [d.name, d.price];
    })
    .enter()
    .append("td")
    .text((d) => d);

  create_svg(subject_idx, subject_list, object_list);
});
