const Mongoose = require("mongoose")

const projectSchema = new Mongoose.Schema({
    name : {
        type : String,
        trim : true,
        minLength : 2,
        maxLength : 30
    },
    lead : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    closes_at: { type: Date },
    status : {
        type : Boolean,
        default : true
    },
    created_at: { type: Date, default: Date.now }
})

const Project = Mongoose.model('projects', projectSchema);

module.exports = Project;