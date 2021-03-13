const constant = require("../constant"),
      _ = require("lodash"),
      User = require("../Model/User"),
      Project = require("../Model/Project"),
      Department = require("../Model/Department"),
      {mailer} = require("../Middleware/Helpers/mailHelper");

const {forgotPassword} = require("../Template/emailTemplate");
const {hashPassword, comparePassword, accessToken, generatePassword} = require("../Middleware/Helpers/authHelper");

const Signin = async (req, res) => {
    let {email, password} = req.body
    userData = await User.findOne({email}).exec()
    if(!_.isEmpty(userData)) {
        isValid = await comparePassword(password, userData.password)
        if (isValid) {
            data = await accessToken({id: userData._id, email})
            User.findById(userData._id, '_id name email isAdmin department_id').populate('department_id', '_id name original_name').then(async response => {

                let userActive = await User.find({status: true}).count().exec()
                let userInActive = await User.find({status: false}).count().exec()
                let projectActive = await Project.find({status: true}).count().exec()
                let projectInActive = await Project.find({status: false}).count().exec()
                let departmentActive = await Department.find({status: true}).count().exec()
                let departmentInActive = await Department.find({status: false}).count().exec()
                
                let user = {active: userActive, inactive: userInActive}
                let project = {active: projectActive, inactive: projectInActive}
                let department = {active: departmentActive, inactive: departmentInActive}
            
                let counts = {user, project, department}
                data = {...data, isAdmin: response.isAdmin, counts}
                return res.status(200).json({message : constant.USER_LOGIN_SUCCESS, code : 200, data})
            })
            // await User.findOneAndUpdate({email, password: userData.password}, data, {upsert : true})
        } else {
            return res.status(206).json({message : constant.USER_LOGIN_ERROR, code : 206})
        }
    } else {
        return res.status(206).json({message : constant.USER_LOGIN_ERROR, code : 206})
    }
}

const SignUp = async (req, res) => {
    let user = new User;
    let {name, email, password} = req.body
    user.password = await hashPassword(password)
    user.name = name
    user.email = email
    await user.save(err => {
        if(err){
            return res.status(206).json({message : constant.USER_SIGNUP_ERROR, code : 206, error : err.errors})
        } else {
            return res.status(200).json({message : constant.USER_SIGNUP_SUCCESS, code : 200})
        }
    })
}

const ForgotPassword = async (req, res) => {
    let {email} = req.body
    original_password = generatePassword()
    password = await hashPassword(original_password)
    await User.findOneAndUpdate({email},{password}).then(async (data) => {
        const template = forgotPassword(data.name, original_password)
        await mailer(email, constant.USER_FORGOT_PASSWORD_RESET, template).catch(err => console.log(err))
        if(!_.isEmpty(data)){
            return res.status(200).json({message: constant.USER_FORGOT_PASSWORD_RESET, code: 200})
        }
        return res.status(206).json({message: constant.USER_FORGOT_PASSWORD_RESET_ERROR, code: 206})
    })
}

const ResetPassword = async (req, res) => {
    let {password, new_password} = req.body
    userData = await User.findById(req.user_id).exec()
    isValid = await comparePassword(password, userData.password)
    if (isValid) {
        newPassword = await hashPassword(new_password)
        await User.findByIdAndUpdate(req.user_id, {password: newPassword}).then(async (data) => {
            const template = forgotPassword(data.name, new_password)
            await mailer(data.email, constant.UPDATE_EMPLOYEE_PASSWORD, template).catch(err => console.log(err))
            if(!_.isEmpty(data)){
                return res.status(200).json({message: constant.USER_FORGOT_PASSWORD_RESET, code: 200})
            }
        })
    } else {
        return res.status(206).json({message : constant.INVALID_PASSWORD_PROVIDED, code : 206})
    }
}

const Logout = async (req, res) => {
    // await User.findOneAndUpdate({email, password: userData.password}, data, {upsert : true})
    return res.status(200).json({message : constant.USER_LOGOUT, code : 200})
}

const TestMethod = async (req, res) => {
    return res.status(200).json({code : 200})
}

module.exports = {
    Signin,
    SignUp,
    Logout,
    TestMethod,
    ResetPassword,
    ForgotPassword
}