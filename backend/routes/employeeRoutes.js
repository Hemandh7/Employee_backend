const express = require('express');

const router = express.Router();

const Employee = require('../models/employee');
const { verifyToken } = require('../middleware/auth');


router.post('/', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email, department, salary } = req.body;

    
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      department,
      salary,
    });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 5, department, sortBy, search } = req.query;
    const query = {};

    if (department) {
      query.department = department;
    }
    if (search) {
      query.firstName = { $regex: search, $options: 'i' };
    }

    const totalEmployees = await Employee.countDocuments(query);
    const totalPages = Math.ceil(totalEmployees / limit);
    const sortOptions = sortBy === 'asc' ? { salary: 1 } : { salary: -1 };

    const employees = await Employee.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({ employees, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.department = department;
    employee.salary = salary;
    await employee.save();

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.findByIdAndDelete(id);

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
