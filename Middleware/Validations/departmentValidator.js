const {check, validationResult} = require("express-validator")
const {errorFormatter} = require("../Helpers/responseHelper")

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
            return res.status(422).json({message: errors.array(),code : 422})
        }
        next()
    }
]