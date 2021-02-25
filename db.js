require("dotenv").config()
const Mongoose = require("mongoose"),
      config = require("./config"),
      constant = require("./constant");

let _db;

const {VERSION} = process.env
let mongoose_config = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify : false
}

module.exports = {
    connect : callback => {
        Mongoose.connect(config[VERSION].database.db_url, mongoose_config, (err, conn) => {
            if(err) {
                console.log("Database Error...", err)
                callback(constant.CONNETION_ERROR);
            } else {
                _db = conn
                console.log("Database Connected...")
            }
            callback(constant.CONNETION_SUCCESS);
        })
    },
    close : () => {
        
    }
}