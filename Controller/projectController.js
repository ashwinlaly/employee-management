const constant = require("../constant"),      
             _ = require("lodash"),
        moment = require("moment");
const Project = require("../Model/Project");


const getAllProject = (req, res) => {
    Project.find({}, '_id name').then(data => {
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.LISTING_PROJECT_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.LISTING_PROJECT_ERROR, code: 206, data: []})
    })
}

const getOneProject = (req, res) => {
    project_id = req.params.id
    Project.findById(project_id, '_id name status lead closes_at').then(data => {
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.GET_PROJECT_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.GET_PROJECT_ERROR, code: 206})
    })
}

const deleteProject = (req, res) => {
    _id = req.params.id
    Project.findByIdAndDelete(_id, (error, data) => {
        if(!_.isEmpty(data)) {
            Project.find({}, '_id name').then(data => {
                return res.status(200).json({message: constant.DELETE_PROJECT_SUCCESS, code: 200, data})
            })
        } else {
            return res.status(206).json({message: constant.PROJECT_REMOVED_ALREADY, code: 206, error})
        }
    })
}

const createProject = (req, res) => {
    const {name, lead, status, closes_at} = req.body
    Project.findOne({name}).then(data => {
        if(_.isEmpty(data)) {
            let project = new Project;
            project.name = name
            project.lead = lead
            project.closes_at = moment(closes_at).format("YYYY-MM-DD")
            project.save(err => {
                if(!err) {
                    return res.status(200).json({message: constant.CREATE_PROJECT_SUCCESS, code: 200})
                } else {
                    return res.status(206).json({message: constant.CREATE_PROJECT_ERROR, code: 206, err})
                }
            });
        } else {
            return res.status(206).json({message: constant.CREATE_PROJECT_ERROR, code: 206})
        }
    })
}

const updateProject = (req, res) => {
    _id = req.params.id
    const {name, lead, status, closes_at} = req.body
    Project.findByIdAndUpdate(_id, {name, lead, status, closes_at}, (error, data) => {
        if(_.isEmpty(error)) {
            return res.status(200).json({message: constant.UPDATE_PROJECT_SUCCESS, code: 200})
        } else {
            return res.status(206).json({message: constant.UPDATE_PROJECT_ERROR, code: 206, error})
        }
    })   
}

module.exports = {
    getAllProject,
    getOneProject,
    deleteProject,
    createProject,
    updateProject
}