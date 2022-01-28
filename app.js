const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./config/config.js');

// main options 
const mainMenuOptions = [
    'View all departments', 'View all roles', 'View all employees', 
    'Add a department', 'Add a role', 'Add an employee', 'Update an employee'
]

// main menu function to prompt user for next app action
const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Welcome to the Employee Tracker! What would you like to do?',
            choices: mainMenuOptions
        }
    ])
    .then(answer => {
        viewEmployees();
    })
    .then(answer => {
        mainMenu();
    })
}

// view all departments functionality 
const viewDepartments = () => {
    const sql = 'SELECT * FROM department';

    // query database
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return
        }
        // show response as table
        console.table(rows)
    })   
}

// view all roles functionality
const viewRoles = () => {
    const sql = 'SELECT * FROM role'

    // query database
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return
        }
        // show response as table
        console.table(rows);
    })
}

// view all employees
const viewEmployees = () => {
    const sql = `
    SELECT
        employee.id, 
        employee.first_name, 
        employee.last_name,
        role.title,
        department.name,
        role.salary,
        employee.manager_id
    FROM employee
    LEFT JOIN 
        role
        ON employee.role_id = role.id
    LEFT JOIN
        department
        ON role.department_id = department.id
    `
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    })
}



// call the main menu function
mainMenu();