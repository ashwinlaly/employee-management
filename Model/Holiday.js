const Mongoose = require("mongoose")

const holidaySchema = new Mongoose.Schema({
    name : {
        type : String,
        trim : true,
        minLength : 2,
        maxLength : 30
    },
    date: { type: String, default: Date },
    status : {
        type : Boolean,
        default : true
    },
    created_at: { type: Date, default: Date.now }
})

const Holiday = Mongoose.model('holidays', holidaySchema);

module.exports = Holiday;