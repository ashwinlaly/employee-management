const constant = require("../constant"),
      _ = require("lodash")
      User = require("../Model/User");

const {hashPassword, comparePassword, accessToken} = require("../Middleware/Helpers/authHelper");

const Signin = async (req, res) => {
    let {email, password} = req.body
    userData = await User.findOne({email}).exec()
    if(!_.isEmpty(userData)) {
        isValid = await comparePassword(password, userData.password)
        if (isValid) {
            data = await accessToken({id: userData._id, email})
            await User.findOneAndUpdate({email, password: userData.password}, data, {upsert : true})
            return res.status(200).json({message : constant.USER_LOGIN_SUCCESS, code : 200, data})
        }
    }
    return res.status(206).json({message : constant.USER_LOGIN_ERROR, code : 206})
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

const Logout = async (req, res) => {
    // await User.findOneAndUpdate({email, password: userData.password}, data, {upsert : true})
    return res.status(200).json({message : constant.USER_LOGOUT, code : 200})
}

module.exports = {
    Signin,
    SignUp,
    Logout
}