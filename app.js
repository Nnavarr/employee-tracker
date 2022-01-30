const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./config/config.js');
const figlet = require('figlet')

// view all departments functionality 
const viewDepartments = async () => {
    console.clear()
    const sql = 'SELECT * FROM department';

    // query database
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return
        }
        // show response as table
        console.log(`
        
        `)
        console.table(rows)
    })   
}

// view all roles functionality
const viewRoles = () => {
    console.clear()
    const sql = 'SELECT * FROM role'

    // query database
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return
        }
        // show response as table
        console.log(`
        
        `)
        console.table(rows);
    })
}

// view all employees
const viewEmployees = () => {
    console.clear()
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
        console.log(`
        
        `)
        console.table(rows);
    })
}

// add department
const addDepartment = () => {
    console.clear()
    const sql = `
    INSERT INTO department (name)
    VALUES (?)
    `
    inquirer.prompt([
        {
            type: 'input', 
            name:'department',
            message: 'What is the departments name?'
        }
    ])
    .then(answer => {
        let department = [answer.department]

        db.query(sql, department, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`
        
            `)
            console.log(`The ${answer.department} has been added to the department table`)
        } )
    })
}

// add new role
const addNewRole = () => {
    console.clear()
    const sql = `
    INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)
    `

    const sql_id = `
    SELECT id
    FROM 
        department
    WHERE
        LOWER(name) = ?
    `
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the role name?'
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is this role's salary?"
        },
        {
            type: 'input',
            name: 'department',
            message: "What is the depratment's name?"
        }
    ])
    .then(answer => {
        // separate response values
        let role = [answer.role];
        let salary = parseFloat([answer.salary]);
        let department = [answer.department][0].toLowerCase();
        
        // query deparment table for department id
        let department_id = db.query(sql_id, department, (err, row) => {
            if (err) {
                console.log(err);
                return;
            }
            // replace department id variable with query results
            department_id = row[0].id;

            // insert new role
            db.query(sql, [role, salary, department_id], (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(`
        
                `)
                console.log(`The ${role} has been added to the database!`);
            })
        })
    })
}

// add new employee
const addNewEmployee =  () => {
    console.clear();
    const sql = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)
    `

    const sql_manager = `
    SELECT 
        role.id as 'role_id',
        employee.id as 'manager_id'
    FROM 
        employee
    LEFT JOIN 
        role
        ON employee.role_id = role.id
    WHERE 
        LOWER(employee.first_name) = ?
        AND LOWER(employee.last_name) = ?
    `

    inquirer.prompt([
        {
            type: 'input',
            name:'firstName',
            message: 'What is their first name?'
        },
        {
            type: 'input',
            name: 'lastName', 
            message: 'What is their last name?'
        },
        {
            type: 'input',
            name: 'role',
            message: 'What is their role?'
        },
        {
            type: 'input',
            name: 'managerFirst',
            message: "What is their manager's first name?"
        },
        {
            type: 'input',
            name: 'managerLast',
            message: "What is their manager's last name?"
        }
    ])
    .then(answer => {
        let firstName = [answer.firstName][0];
        let lastName = [answer.lastName][0]
        let managerFirst = [answer.managerFirst][0].toLowerCase();
        let managerLast = [answer.managerLast][0].toLowerCase();

        // query for role and manager
        db.query(sql_manager, [managerFirst, managerLast], (err, row) => {
            if (err) {
                console.log(err);
                return;
            }
            roleId = row[0].role_id;
            managerId = row[0].manager_id;

        // insert new employee
        db.query(sql, [firstName, lastName, roleId, managerId], (err, row) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`
        
            `)
            console.log(`The new employee ${firstName} ${lastName} has been added!`)
        })
        })        
    })
}

// update employee value
const updateEmployee = () => {
    console.clear()
    const sql = `
    UPDATE employee
    SET role_id = ?
    WHERE
        CONCAT(LOWER(first_name), LOWER(last_name)) = ?
    `

    // employee container 
    let employeeContainer = []

    db.query("SELECT CONCAT(first_name, ' ', last_name) as 'employee' FROM employee", (err, row) => {
        if (err) {
            console.log(err);
            return;
        }
        // append each employee to the list to be passe d into inquirer
        row.forEach(item => employeeContainer.push(item.employee))

        // prompt user input for employee
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Please select the employee to update',
                choices: employeeContainer
            },
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the new role id?'
            }
        ])
        .then(answer => {
            let employeeName = answer.employee.split(' ').join('').toLowerCase();
            let newRole = answer.newRole[0];
            
            // run update query 
            db.query(sql, [newRole, employeeName], (err, row) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(`
        
                `)
                console.log(`The role has been updated!`)
            })
        })
    })
}

// main options 
const mainMenuOptions = [
    'View all departments', 'View all roles', 'View all employees', 
    'Add a department', 'Add a role', 'Add an employee', 'Update an employee'
]

// option to function object
const optionFunctions = {
    'View all departments': viewDepartments,
    'View all roles': viewRoles,
    'View all employees': viewEmployees,
    'Add a department': addDepartment,
    'Add a role': addNewRole,
    'Add an employee': addNewEmployee,
    'Update an employee': updateEmployee
}

async function questions() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'sequence', 
            message: 'What would you like to do?',
            choices: mainMenuOptions
        }
    ])
    .then(async (answer) => {
        // match the response to the function 
        let response = answer.sequence;
        await optionFunctions[response]()

        if (answer.sequence.includes('Add') || answer.sequence.includes('Update')) {
            setTimeout(questions, 20000);
        } else {
            console.clear();
            questions();
        }
    })
}

// create command line banner
figlet('Employee Tracker', function(err, data) {
    if (err) {
        console.log('The banner did not generate correctly');
        return;
    }
    console.log(data)
    questions();
})
