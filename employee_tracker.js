var mysql = require("mysql");
var cTable = require("console.table")
var inquirer = require("inquirer");
const Choices = require("inquirer/lib/objects/choices");
const {
  number
} = require("easy-table");
const { exit } = require("process");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employee_trackerdb"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});


function addEmp() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    var listOfRoles = res.map(role => {
      return {
        value: role.id,
        name: role.title
      }
    })

    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;

      var listOfEmployees = res.map(role => {
        return {
          value: role.id,
          name: `${role.first_name} ${role.last_name}`
        }
      })

      inquirer.prompt([{
            type: "input",
            name: "first_name",
            message: "what is employees first name"
          },
          {
            type: "input",
            name: "last_name",
            message: "what is employees last name"
          },
          {
            type: "list",
            name: "role_id",
            message: "what is employees role?",
            choices: listOfRoles
          },
          {
            type: "list",
            name: "manager_id",
            message: "who is the employees manager?",
            choices: listOfEmployees
          },
        ])
        .then(function (answers) {

          connection.query("Insert INTO employee SET ?", answers, (err, results) => {
            if (err) throw err

            afterConnection()
          })

        })



    });



  });
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    var listOfDepartments = res.map(role => {
      return {
        value: role.id,
        name: role.name
      }
    })
    inquirer.prompt([{
          type: "number",
          name: "salary",
          message: "What is the role salary?",
        }, {
          type: "input",
          name: "title",
          message: "What is the role title?"
        },
        {
          type: "list",
          name: "department_id",
          message: "What department is the role in?",
          choices: listOfDepartments
        }

      ])
      .then(function (answers) {
        connection.query("Insert INTO role SET ?", answers, (err, results) => {
          if (err) throw err

          afterConnection()
        })
      })
  })
}

function changeRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    var listOfRoles = res.map(role => {
      return {
        value: role.id,
        name: role.title
      }
    })

    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;

      var listOfEmployees = res.map(role => {
        return {
          value: role.id,
          name: `${role.first_name} ${role.last_name}`
        }
      })
      inquirer.prompt([{
            type: "list",
            name: "employee_id",
            message: "Which employee would you like to update?",
            choices: listOfEmployees
          },
          {
            type: "list",
            name: "newrole",
            message: "What is their new role?",
            choices: listOfRoles
          }
        ])
        .then(function (answers) {
          console.log(answers.employee_id, answers.newrole)
          connection.query("UPDATE employee SET role_id =? WHERE id = ?;", [answers.newrole, answers.employee_id], function (err, res) {
            if (err) throw err
            console.log("successfully updated")
            afterConnection()
          })
        })
    })
  })
}

function viewDept() {
  connection.query("SELECT * from department", (err, results) => {
    if (err) throw err

    console.table(results)
    afterConnection()
  })
}

function viewRole() {
  connection.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;", (err, results) => {
    if (err) throw err

    console.table(results)
    afterConnection()
  })
}

function addDepartment() {
  inquirer.prompt([{
      type: "input",
      name: "name",
      message: "What is the department name?"
    }])
    .then(function (answers) {
      connection.query("Insert INTO department SET ?", answers, (err, results) => {
        if (err) throw err

        afterConnection()
      })


    })
}

function viewEmp() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, results) => {
    if (err) throw err

    console.table(results)
    afterConnection()
  })

}

function afterConnection() {

  inquirer.prompt([{
        type: 'list',
        name: "choices",
        message: "What would you like to do?",
        choices: [{
            name: "Add Employee",
            value: "addEmp"
          },
          {
            name: "Add Role",
            value: "addRole"
          },
          {
            value: "addDepartment",
            name: "Add Department"
          },
          {
            name: "View Employee",
            value: "viewEmp"
          },
          {
            name: "View roles",
            value: "viewRoles"
          },
          {
            name: "View department",
            value: "viewDept"
          },
          {
            name: "Change employee role",
            value: "changeRole"
          },
          {
            name: "Exit Application",
            value: "exit"
          },

        ]
      }]

    )
    .then(function (response) {
      console.log(response.choices)
      switch (response.choices) {
        case "addEmp":
          addEmp()
          break;
        case "addRole":
          addRole()
          break;
        case "addDepartment":
          addDepartment()
          break;
        case "viewEmp":
          viewEmp()
          break;
        case "viewRoles":
          viewRole()
          break;
        case "viewDept":
          viewDept()
          break;
        case "changeRole":
          changeRole()
          break;
          case "exit":
            exit()
        default:
          break;
      }
    })
}