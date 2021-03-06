const {check, validationResult} = require("express-validator")
const {errorFormatter} = require("../Helpers/responseHelper")
const constant = require("../../constant");

module.exports = [
    check("name")
        .trim()
        .notEmpty()
        .withMessage("Department Name is Empty")
        .bail()
        .isLength({min: 4, max: 30})
        .withMessage("Enter a valid Name")
        .bail(),
    check("original_name")
        .trim()
        .notEmpty()
        .withMessage("Department Abbrevation Name is Empty")
        .bail()
        .isLength({min: 4, max: 30})
        .withMessage("Enter a valid Abbrevation")
        .bail(),
    (req, res, next) => {
        let errors = validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
            return res.status(200).json({message: constant.CREATE_DEPARTMENT_ERROR,code : 422, error: errors.array()})
        }
        next()
    }
]