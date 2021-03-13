const {check, validationResult} = require("express-validator")
const {errorFormatter, checkValidMongoID, checkUserEmailRegistered} = require("../Helpers/responseHelper")
const constant = require("../../constant");

module.exports = [
    check("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isLength({min:4, max:50})
        .withMessage("Enter valid Name")
        .bail(),
    check("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Email is required")
        .bail()
        .isLength({min:6, max:50})
        .withMessage("Enter valid Email")
        .bail()
        .custom(checkUserEmailRegistered)
        .bail(),
    // check("password")
    //     .trim()
    //     .escape()
    //     .notEmpty()
    //     .withMessage("Password Cannot be Empty")
    //     .bail()
    //     .isLength({min:8, max:15})
    //     .withMessage("Enter valid Password")
    //     .bail(),
    check("department_id")
        .trim()
        .notEmpty()
        .withMessage("Please select Department")
        .bail()
        .custom(checkValidMongoID)
        .bail(),
    check("project")
        .trim()
        .notEmpty()
        .withMessage("Please select Project")
        .bail()
        .custom(checkValidMongoID)
        .bail(),
    (req, res, next) => {        
        const errors = validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
            if(req.method === "PATCH") {
                return res.status(200).json({message: constant.UPDATE_EMPLOYEE_ERROR, code : 422, error: errors.array()})
            } else {
                return res.status(200).json({message: constant.CREATE_EMPLOYEE_ERROR, code : 422, error: errors.array()})
            }
        }
        next()
    }
]