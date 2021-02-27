const {check, validationResult} = require("express-validator")
const {errorFormatter} = require("../Helpers/responseHelper")
const constant = require("../../constant");

module.exports = [
    check('email')
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password Cannot be Empty")
        .bail()
        .isEmail()
        .withMessage("Email Format is Invalid")
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
        let errors = validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
            return res.status(200).json({message: constant.USER_LOGIN_ERROR,code : 422, error: errors.array()})
        }
        next()
    }
]