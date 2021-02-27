const {check, validationResult} = require("express-validator")
const {errorFormatter, checkValidMongoID, checkUserEmailRegistered} = require("../Helpers/responseHelper")

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
    (req, res, next) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
            return res.status(200).json({message: errors.array(), code : 422})
        }
        next()
    }
]