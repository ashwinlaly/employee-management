const {check, validationResult} = require("express-validator")
const {errorFormatter} = require("../Helpers/responseHelper")
const constant = require("../../constant");

module.exports = [
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
        .bail(),
    check("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password Cannot be Empty")
        .bail()
        .isLength({min:8, max:15})
        .withMessage("Enter valid Password")
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
            return res.status(200).json({message: constant.USER_SIGNUP_ERROR, code : 422, error: errors.array()})
        }
        next()
    }
]