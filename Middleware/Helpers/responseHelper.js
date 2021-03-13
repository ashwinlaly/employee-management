require("dotenv").config()
const { isEmpty } = require("lodash");
const _ = require("lodash");
const Mongoose = require("mongoose");
const User = require("../../Model/User");
const Project = require("../../Model/Project");
const Department = require("../../Model/Department");

const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
    return { msg, param }
}

const checkValidMongoID = (value, type) => {
    const isValid = Mongoose.Types.ObjectId.isValid(value)
    if(isValid) {
        if(type.path === "department_id") {
            return Department.findById(value).then(data => {
                if(_.isEmpty(data)){
                    return Promise.reject("Department ID is invalid")
                }
            })
        } else if(type.path === "project") {
            return Project.findById(value).then(data => {
                if(_.isEmpty(data)){
                    return Promise.reject("Project ID is invalid")
                }
            })
        } else { }
    } else {
        return Promise.reject("Invalid ID passed")    
    }
}

const checkUserEmailRegistered = (email, serverObject) => {
    if(serverObject.req.method == "POST") {
        return User.findOne({email}).then(data => {
            if(!_.isEmpty(data)){
                return Promise.reject("Email already taken")
            }
        })
    } else if (serverObject.req.method == "PATCH") {
        return User.findOne({email}).then(data => {
            if(!_.isEmpty(data)){
                if(data._id != serverObject.req.params.id) {
                    return Promise.reject("Email already taken")
                }
            }
        })
    }
}

const sendResponse = async (response, resultant, success_message = '', error_message = '') => {
    if(!_.isEmpty(resultant) || resultant >= 1) {
        return await response.status(200).json({message: success_message, code : 200, data: resultant})
    } else {
        return await response.status(202).json({message: error_message, code : 202})
    }
}

module.exports = {
    sendResponse,
    errorFormatter,
    checkValidMongoID,
    checkUserEmailRegistered
}