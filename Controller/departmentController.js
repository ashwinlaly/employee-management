const { response } = require("express");
const constant = require("../constant"),      
             _ = require("lodash");
const Department = require("../Model/Department");

const getDepartmentList = (req, res) => {
    Department.find({}, '_id name original_name status').then(data => {
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.LISTING_DEPARTMENT_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.LISTING_DEPARTMENT_ERROR, code: 206, data: []})
    })
}

const getDepartmentById = (req, res) => {
    department_id = req.params.id
    Department.findById(department_id, '_id name original_name status').then(data => {
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.GET_DEPARTMENT_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.GET_DEPARTMENT_ERROR, code: 206})
    })
}

const createDepartment = async (req, res) => {
    const {name, original_name} = req.body
    Department.findOne({name}).then(data => {
        if(_.isEmpty(data)) {
            let department = new Department;
            department.name = name
            department.status = status
            department.original_name = original_name
            department.save(err => {
                if(!err) {
                    return res.status(200).json({message: constant.CREATE_DEPARTMENT_SUCCESS, code: 200})
                }
            });
        } else {
            return res.status(206).json({message: constant.CREATE_DUPLICATE_DEPARTMENT_ERROR, code: 206})
        }
    })
}

const updateDepartment = (req, res) => {
    _id = req.params.id
    const {name, original_name, status} = req.body
    Department.findByIdAndUpdate(_id, {name, original_name, status}, (error, data) => {
        if(_.isEmpty(error)) {
            return res.status(200).json({message: constant.UPDATE_DEPARTMENT_SUCCESS, code: 200})
        } else {
            return res.status(206).json({message: constant.UPDATE_DEPARTMENT_ERROR, code: 206, error})
        }
    })
}

const deleteDepartment = (req, res) => {
    _id = req.params.id
    Department.findByIdAndDelete(_id, (error, result) => {
        if(!_.isEmpty(result)) {
            Department.find({}, '_id name original_name status').then(data => {
                return res.status(200).json({message: constant.DELETE_DEPARTMENT_SUCCESS, code: 200, data})
            })
        } else {
            return res.status(206).json({message: constant.DEPARTMENT_REMOVED_ALREADY, code: 206})
        }
    })
}

module.exports = {
    getDepartmentList,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment   
}