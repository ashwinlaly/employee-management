const Mongoose = require("mongoose")

const departmentSchema = new Mongoose.Schema({
    name : {
        type : String,
        trim : true,
        minLength : 2,
        maxLength : 30
    },
    original_name : {
        type : String,
        trim : true,
        minLength : 4,
        maxLength : 30
    },
    total_leave : {
        type: Number, default: 14
    },
    created_at: { type: Date, default: Date.now },
    status : {
        type : Boolean,
        default : true
    }
})

const Department = Mongoose.model("departments", departmentSchema);

module.exports = Department