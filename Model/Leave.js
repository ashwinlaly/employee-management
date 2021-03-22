const Mongoose = require("mongoose")

const leaveSchema = new Mongoose.Schema({
    from_date: { type: Date },
    to_date: { type: Date },
    reason : {
        type : String,
        trim : true,
        minLength : 10,
        maxLength : 30
    },
    user : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    approval_by :{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    leave_type : {
        type : Number,
        default : 0
    },
    status : {
        type : Number,
        default : 0
    },
    created_at: { type: Date, default: Date.now }
})

const Leave = Mongoose.model('leaves', leaveSchema);

module.exports = Leave;