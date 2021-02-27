const {check, validationResult} = require("express-validator")
const {errorFormatter} = require("../Helpers/responseHelper")
const constant = require("../../constant");

module.exports = [
    check("name")
        .trim()
        .notEmpty()
        .withMessage("Project Name is Empty")
        .bail()
        .isLength({min: 4, max: 30})
        .withMessage("Enter a valid Name")
        .bail(),
    check("lead")
        .trim()
        .notEmpty()
        .withMessage("Please select a Lead")
        .bail(),
    check("closes_at")
        .trim()
        .notEmpty()
        .withMessage("Please select closing date")
        .bail()
        .isDate({format: 'YYYY/MM/DD'})
        .withMessage("Please select valid closing date")
        .bail(),
    (req, res, next) => {
        let errors = validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
            return res.status(200).json({message: constant.CREATE_PROJECT_ERROR,code : 422, error: errors.array()})
        }
        next()
    }
]