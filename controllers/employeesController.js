const Employee = require("../model/employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  if (!employees)
    return res.sendStatus(204).json({ message: "Employees not found" });

  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const newEmpoloyee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newEmpoloyee.firstName || !newEmpoloyee.lastName) {
    return res.status(400).json({ message: "Invalid first name or last name" });
  }

  // create and store new employee

  try {
    const result = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    console.log(result);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateEmployee = async (req, res) => {
  console.log(req);

  if (!req?.body?.id)
    return res.sendStatus(400).json({ message: "ID is required" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `No Employee matches ID ${req.body.id}` });
  }

  if (req.body.firstName) {
    employee.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    employee.lastName = req.body.lastName;
  }

  try {
    const result = await employee.save();

    console.log(result);

    res.sendStatus(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.sendStatus(400).json({ message: "ID is required" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `No Employee matches ID ${req.body.id}` });
  }

  try {
    const result = await employee.deleteOne({ _id: req.body.id });

    console.log(employee);

    resjson(result);
  } catch (error) {
    console.log(error);
  }
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID is required" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `No Employee matches ID ${req.params.id}` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};

// const data = {
//   employees: require("../model/employees.json"),
//   setEmployees: function (data) {
//     this.employees = data;
//   },
// };

// const getAllEmployees = (req, res) => {
//   res.json(data.employees);
// };

// const createNewEmployee = (req, res) => {
//   const newEmpoloyee = {
//     id: data.employees[data.employees.length - 1].id + 1 || 1,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//   };

//   if (!newEmpoloyee.firstName || !newEmpoloyee.lastName) {
//     return res.status(400).json({ message: "Invalid first name or last name" });
//   }

//   data.setEmployees([...data.employees, newEmpoloyee]);
//   res.json(data.employees);
// };

// const updateEmployee = (req, res) => {
//   const employee = data.employees.find(
//     (employee) => employee.id === req.body.id
//   );

//   if (!employee) {
//     return res.status(400).json({ message: "Employee not found" });
//   }

//   if (req.body.firstName) {
//     employee.firstName = req.body.firstName;
//   }
//   if (req.body.lastName) {
//     employee.lastName = req.body.lastName;
//   }

//   const filteredArray = data.employees.filter(
//     (employee) => employee.id !== parseInt(req.body.id)
//   );

//   const unsortedArray = [...filteredArray, employee];

//   data.setEmployees(
//     unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
//   );

//   res.json(data.employees);
// };

// const deleteEmployee = (req, res) => {
//   const employee = data.employees.find(
//     (employee) => employee.id === req.body.id
//   );

//   if (!employee) return res.status(400).json({ message: "Employee not found" });

//   const filteredArray = data.employees.filter(
//     (employee) => employee.id !== parseInt(req.body.id)
//   );

//   data.employees = [...filteredArray];
//   res.json(data.employees);
// };

// const getEmployee = (req, res) => {
//   const employee = data.employees.find(
//     (employee) => employee.id === parseInt(req.body.id)
//   );

//   if (!employee) return res.status(400).json({ message: "Employee not found" });

//   res.json(employee);
// };

// module.exports = {
//   getAllEmployees,
//   createNewEmployee,
//   updateEmployee,
//   deleteEmployee,
//   getEmployee,
// };
