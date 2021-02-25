const express = require("express"),
      router = express.Router()

// VALIDATOR
const signinValidator = require("../Middleware/Validations/signinValidator");
const signupValidator = require("../Middleware/Validations/signupValidator");
const projectValidator = require("../Middleware/Validations/projectValidator");
const employeeValidator = require("../Middleware/Validations/employeeValidator");
const departmentValidator = require("../Middleware/Validations/departmentValidator");

// HELPER
const {verifyToken} = require("../Middleware/Helpers/authHelper");

// CONTROLLER
const authController = require("../Controller/authController")
const projectController = require("../Controller/projectController")
const employeeController = require("../Controller/employeeController")
const departmentController = require("../Controller/departmentController")


module.exports = (function() {
    router.post("/signin", [signinValidator], authController.Signin)
    router.post("/signup", [signupValidator], authController.SignUp)
    router.post("/logout", authController.Logout)

    router.use("*", verifyToken)
    router.get("/employee", employeeController.getAllEmployee)
    router.get("/employee/:id", employeeController.getOneEmployee)
    router.delete("/employee/:id", employeeController.deleteEmployee)
    router.post("/employee", [employeeValidator], employeeController.createEmployee)
    router.patch("/employee/:id", [employeeValidator], employeeController.updateEmployee)

    router.get("/project", projectController.getAllProject)
    router.get("/project/:id", projectController.getOneProject)
    router.delete("/project/:id", projectController.deleteProject)
    router.post("/project", [projectValidator], projectController.createProject)
    router.patch("/project/:id", [projectValidator], projectController.updateProject)

    router.get("/department", departmentController.getDepartmentList)
    router.get("/department/:id", departmentController.getDepartmentById)
    router.delete("/department/:id", departmentController.deleteDepartment)
    router.post("/department", [departmentValidator], departmentController.createDepartment)
    router.patch("/department/:id", [departmentValidator], departmentController.updateDepartment)

    router.post("/leave/request", employeeController.applyLeave)
    router.post("/leave/approve", employeeController.approveLeave)
    router.get("/leave/history", employeeController.getLeaveHistory)
    router.get("/leave/history/all", employeeController.getAllLeaveHistory)

    return router
})