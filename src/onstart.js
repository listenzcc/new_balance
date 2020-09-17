// File: onstart.js
// Aim: Javascript runs onstart of the index.html

// Welcome message
console.log("Welcome to the balance sheet.");

// Parse data into D3 useable structure
function parse_data(data) {
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

// Fill #contents div
d3.json("latest.json").then(function (data) {
  console.log(data);
  var parsed = parse_data(data);
  var subject_idx = parsed[0];
  var subject_list = parsed[1];
  var object_list = parsed[2];
  console.log(subject_idx);
  console.log(subject_list);
  console.log(object_list);

  let table = d3
    .select("#contents")
    .selectAll("table")
    .data(subject_idx)
    .enter()
    .append("table");

  table
    .data(subject_list)
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data((d) => {
      return [d.subject, d.price];
    })
    .enter()
    .append("th")
    .text((d) => d);

  table
    .data(object_list)
    .append("tbody")
    .selectAll("tr")
    .data((d) => d)
    .enter()
    .append("tr")
    .selectAll("td")
    .data((d) => {
      return [d.name, d.price];
    })
    .enter()
    .append("td")
    .text((d) => d);
  // .selectAll("tr")
  // .data((d) => d)
  // .enter()
  // .append("tr")
  // .append("th")
  // .text((d) => d);

  //   let div = d3
  //     .select("#contents")
  //     .selectAll("div")
  //     .data(subject_list)
  //     .enter()
  //     .append("div");

  //   div
  //     .data(subject_list)
  //     .append("h3")
  //     .text((d) => d);

  //   div
  //     .data(object_list)
  //     .selectAll("p")
  //     .data((d) => d)
  //     .enter()
  //     .append("p")
  //     .text((d) => {
  //       return d.name;
  //     });
});
