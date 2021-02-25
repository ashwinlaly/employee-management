require("dotenv").config()
const config = require("../../config"),
      nodemailer = require("nodemailer");

const {VERSION} = process.env
const mailer = async (to, subject, html) => {
    let transporter = nodemailer.createTransport(config[VERSION].email)
    let info = await transporter.sendMail({
        to, subject, html
    })
    console.log(info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
    mailer
}