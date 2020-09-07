var mysql = require("mysql");
var cTable = require("console.table")
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

inquirer.prompt (["what?"], function( ){

})