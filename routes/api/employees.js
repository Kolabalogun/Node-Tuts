const express = require("express");

const router = express.Router();

const employeesController = require("../../controllers/employeesController");

const ROLES_LIST = require("../../config/rolelist");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")

  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

// .get((req, res) => {
//   res.json(data.employees);
// })

//   .post((req, res) => {
//     res.json({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//     });
//   })

//   .put((req, res) => {
//     res.json({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//     });
//   })

//   .delete((req, res) => {
//     res.json({
//       id: req.body.id,
//     });
//   });

// router.route("/:id").get((req, res) => {
//   res.json({
//     id: req.params.id,
//   });
// });

module.exports = router;
