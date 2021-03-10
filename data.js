const fs = require("fs");
const util = require("util");

// set or get a key from the data file
// using sync because fs is actually garbage
module.exports = function(key, value) {
  // create the file if it doesn't exist yet
  if(!fs.existsSync(".data")) fs.writeFileSync(".data", "{}", "utf8");
  const data = JSON.parse(fs.readFileSync(".data", "utf8"));

  // return or edit corresponding value
  if(value === undefined) {
    return data[key];
  } else {
    data[key] = value;
    fs.writeFileSync(".data", JSON.stringify(data), "utf8");
  }
};
