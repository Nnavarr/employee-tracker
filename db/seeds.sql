INSERT INTO department (name)
VALUES 
    ('Finance'),
    ('Software Development'),
    ('HR'),
    ('Supply Chain');

INSERT INTO `role` (title, salary, department_id)
VALUES
    ('Financial Analyst', 70000, 1),
    ('Software Developer', 100000, 2),
    ('HR Analyst', 70000, 3),
    ('Director SD', 170000, 2),
    ('Chief Financial Officer', 170000, 2);

INSERT INTO employee 
(first_name, last_name, role_id, manager_id)
VALUES 
    ('Eren', 'Jager', 2, 2),
    ('Erwin', 'Smith', 4, NULL),
    ('Levi', 'Ackerman', 1, 4),
    ('Kenny', 'Ackerman', 5, NULL);
