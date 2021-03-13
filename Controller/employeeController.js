const constant = require("../constant"),
      _ = require("lodash"),
      moment = require("moment"),
      {mailer} = require("../Middleware/Helpers/mailHelper"),
      {createAccount, applyForLeave, approvedLeave} = require("../Template/emailTemplate"),
      {generatePassword, hashPassword} = require("../Middleware/Helpers/authHelper"),
      Leave = require("../Model/Leave"),
      User = require("../Model/User");


const createEmployee = async (req, res) => {
    let {name, email, department_id, project, status} = req.body
    original_password = generatePassword()
    password = await hashPassword(original_password)
    let user = new User;
    user.name = name;
    user.email = email;
    user.password = password;
    user.department_id = department_id;
    user.project = project;
    user.status = status;
    user.save(async (error) => {
        if(_.isEmpty(error)){
            const template = createAccount(email, original_password)
            await mailer(email, constant.USER_SIGNUP_SUCCESS, template).catch(err => console.log(err))
            return res.status(200).json({message: constant.CREATE_EMPLOYEE_SUCCESS, code: 200})
        } else {
            return res.status(206).json({message: constant.CREATE_EMPLOYEE_ERROR, code: 206, error})
        }
    })
}

const updateEmployee = async (req, res) => {
    _id = req.params.id
    if(!_.isEmpty(req.body.password)){
        password = await hashPassword(req.body.password)
        var userData = {
            name: req.body.name,
            email: req.body.email,
            department_id: req.body.department_id,
            project : req.body.project,
            status : req.body.status,
            password
        }
    } else {
        var userData = {
            name: req.body.name,
            email: req.body.email,
            department_id: req.body.department_id,
            project : req.body.project,
            status : req.body.status,
        }
    }
    User.findByIdAndUpdate(_id, userData, (error, data) => {
        if(_.isEmpty(error)) {
            return res.status(200).json({message: constant.UPDATE_EMPLOYEE_SUCCESS, code: 200})
        } else {
            return res.status(206).json({message: constant.UPDATE_EMPLOYEE_ERROR, code: 206, error})
        }
    })
}

const deleteEmployee = async (req, res) => {
    _id = req.params.id
    await User.findByIdAndDelete(_id, (error, data) => {
        if(!_.isEmpty(data)) {
            User.find({}, '_id name').then(data => {
                return res.status(200).json({message: constant.DELETE_EMPLOYEE_SUCCESS, code: 200, data})
            })
        } else {
            return res.status(206).json({message: constant.EMPLOYEE_REMOVED_ALREADY, code: 206, error})
        }
    })
}

const getAllEmployee = async (req, res) => {
    await User.find({"_id": {$ne: req.user_id}}, '_id name email isAdmin department_id project status')
            .populate('department_id', '_id name original_name')
            .populate('project', 'name')
        .then(data => {
            if(!_.isEmpty(data)){
                return res.status(200).json({message: constant.LISTING_EMPLOYEE_SUCCESS, code: 200, data})
            }
            return res.status(206).json({message: constant.LISTING_EMPLOYEE_ERROR, code: 206, data: []})
    })
}

const getOneEmployee = async (req, res) => {
    user_id = req.params.id
    await User.findById(user_id, '_id name email isAdmin department_id project status').populate('department_id', '_id name original_name').then(data => {
        data.department_id = data.department_id._id
        if(data.project) {
            data.project = data.project._id
        }
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.GET_EMPLOYEE_SUCCESS, code: 200, data})
        }
        return res.status(206).json({message: constant.GET_EMPLOYEE_ERROR, code: 206})
    })
}

const applyLeave = async (req, res) => {
    let {from_date, to_date, reason} = req.body
    let leave = new Leave
    leave.from_date = from_date
    leave.to_date = to_date
    leave.reason = reason
    leave.user = req.user_id
    leave.save(async (error) => {
        if(_.isEmpty(error)){
            const user = await User.findById(req.user_id)
            let leaveData = {
                from_date : moment(leave.from_date).format("YYYY-MM-DD"),
                to_date : moment(leave.to_date).format("YYYY-MM-DD"),
                reason : leave.reason
            }
            const template = applyForLeave(leaveData)
            await mailer(user.email, constant.APPLY_FOR_LEAVE, template).catch(err => console.log(err))
            return res.status(200).json({message: constant.APPLY_FOR_LEAVE, code: 200})
        } else {
            return res.status(206).json({message: constant.APPLY_FOR_LEAVE_ERROR, code: 206, error})
        }
    })
}

const getLeaveHistory = async (req, res) => {
    user_id = req.user_id
    userInfo = await User.findById(user_id, '_id name email isAdmin department_id status').populate('department_id', '_id name original_name').exec()
    if(userInfo.department_id._id == "604123ee0805d53a640c4fa9") {
        where = {}
        if(!_.isEmpty(req.body.where)){
            where = req.body.where
        }
        await Leave.find(where, '_id reason status from_date to_date').populate({
                path:"user", 
                select:"_id name email",
                populate:{
                    path:"department_id", 
                    select:"_id original_name"
                }
            }).then(data => {
                if(!_.isEmpty(data)){
                    return res.status(200).json({message: constant.GET_USER_LEAVE_SUCCESS, code: 200, data})
                }
            return res.status(206).json({message: constant.GET_USER_LEAVE_ERROR, code: 206})
        })
    } else {
        await Leave.find({user: user_id}).populate("user").then(data => {
            if(!_.isEmpty(data)){
                return res.status(200).json({message: constant.GET_USER_LEAVE_SUCCESS, code: 200, data})
            }
            return res.status(206).json({message: constant.GET_USER_LEAVE_ERROR, code: 206})
        })
    }
}

const approveLeave = async (req, res) => {
    let _id = req.body.leave_id
    let status = req.body.status
    // Leave.deleteMany({"reason": {$ne: ""}}, (e) => console.log(e));
    Leave.findByIdAndUpdate(_id, {status}, async (error, data) => {
        const user = await User.findById(data.user).exec()
        let leaveData = {
            from_date : moment(data.from_date).format("MM-DD-YYYY"),
            to_date : moment(data.to_date).format("MM-DD-YYYY"),
            reason : data.reason,
            status: (status == "1") ? "Approved" : "Un Approved"
        }
        const template = approvedLeave(leaveData)
        if(status == 1) {
            await mailer(user.email, constant.APPROVE_LEAVE_SUCCESS, template).catch(err => console.log(err))
        } else {
            await mailer(user.email, constant.UNAPPROVE_LEAVE_SUCCESS, template).catch(err => console.log(err))
        }

        user_id = req.user_id
        userInfo = await User.findById(user_id, '_id name email isAdmin department_id').populate('department_id', '_id name original_name').exec()
        if(userInfo.department_id._id == "604123ee0805d53a640c4fa9") {
            where = {}
            if(!_.isEmpty(req.body.where)){
                where = req.body.where
            }
            await Leave.find(where, '_id reason status  from_date to_date').populate({
                    path:"user", 
                    select:"_id name email",
                    populate:{
                        path:"department_id", 
                        select:"_id original_name"
                    }
                }).then(data => {
                    if(!_.isEmpty(data)){
                        if(status == 1) {
                            return res.status(200).json({message: constant.APPROVE_LEAVE_SUCCESS, code: 200, data})
                        } else {
                            return res.status(200).json({message: constant.UNAPPROVE_LEAVE_SUCCESS, code: 200, data})
                        }
                    }
                return res.status(206).json({message: constant.APPROVE_LEAVE_ERROR, code: 206, error})
            })
        } else {
            await Leave.find({_id: user_id}, '_id reason status  from_date to_date').then(data => {
                if(!_.isEmpty(data)){
                    if(status == 1) {
                        return res.status(200).json({message: constant.APPROVE_LEAVE_SUCCESS, code: 200, data})
                    } else {
                        return res.status(200).json({message: constant.UNAPPROVE_LEAVE_SUCCESS, code: 200, data})
                    }
                }
                return res.status(206).json({message: constant.APPROVE_LEAVE_ERROR, code: 206, error})
            })
        }

    })
}


module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployee,
    getOneEmployee,
    applyLeave,
    approveLeave,
    getLeaveHistory
}