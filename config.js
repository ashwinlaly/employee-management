require("dotenv").config()

const {DB_PASSWORD, MAIL_USER, MAIL_PASSWORD} = process.env

module.exports = {
    "development" : {
        database : {
            db_url : `mongodb+srv://user:${DB_PASSWORD}@cluster0.nsge4.mongodb.net/employee_management?retryWrites=true&w=majority`
        },
        email: {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        }
    }, 
    "production" : {
        database : {
            db_url : `mongodb+srv://user:${DB_PASSWORD}@cluster0.nsge4.mongodb.net/employee_management?retryWrites=true&w=majority`
        },
        email: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        }
    }
}