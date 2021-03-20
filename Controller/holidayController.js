const constant = require("../constant"),      
             _ = require("lodash"),
        moment = require("moment");
const Holiday = require("../Model/Holiday");


const getAllHoliday = (req, res) => {
    Holiday.find({}, '_id name status').then(data => {
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.LISTING_HOLIDAY_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.LISTING_HOLIDAY_ERROR, code: 206, data: []})
    })
}

const getOneHoliday = (req, res) => {
    holiday_id = req.params.id
    Holiday.findById(holiday_id, '_id name date status').then(data => {
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.GET_HOLIDAY_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.GET_HOLIDAY_ERROR, code: 206})
    })
}

const deleteHoliday = (req, res) => {
    _id = req.params.id
    Holiday.findByIdAndDelete(_id, (error, data) => {
        if(!_.isEmpty(data)) {
            Holiday.find({}, '_id name').then(data => {
                return res.status(200).json({message: constant.DELETE_HOLIDAY_SUCCESS, code: 200, data})
            })
        } else {
            return res.status(206).json({message: constant.HOLIDAY_REMOVED_ALREADY, code: 206, error})
        }
    })
}

const createHoliday = (req, res) => {
    const {name, status, date} = req.body
    Holiday.findOne({name}).then(data => {
        if(_.isEmpty(data)) {
            let holiday = new Holiday;
            holiday.name = name
            holiday.date = moment(date).format("YYYY-MM-DD")
            holiday.status = status
            holiday.save(err => {
                if(!err) {
                    return res.status(200).json({message: constant.CREATE_HOLIDAY_SUCCESS, code: 200})
                } else {
                    return res.status(206).json({message: constant.CREATE_HOLIDAY_ERROR, code: 206, err})
                }
            });
        } else {
            return res.status(206).json({message: constant.CREATE_HOLIDAY_ERROR, code: 206})
        }
    })
}

const updateHoliday = (req, res) => {
    _id = req.params.id
    const {name, status, date} = req.body
    Holiday.findByIdAndUpdate(_id, {name, status, date}, (error, data) => {
        if(_.isEmpty(error)) {
            return res.status(200).json({message: constant.UPDATE_HOLIDAY_SUCCESS, code: 200})
        } else {
            return res.status(206).json({message: constant.UPDATE_HOLIDAY_ERROR, code: 206, error})
        }
    })   
}

module.exports = {
    getAllHoliday,
    getOneHoliday,
    deleteHoliday,
    createHoliday,
    updateHoliday
}