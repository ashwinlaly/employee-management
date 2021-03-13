const Mongoose = require("mongoose");

const userSchema = new Mongoose.Schema({
    name : {
        type : String,
        lowercase : true,
        trim : true,
        minLength : 4,
        maxLength : 30
    },
    email : {
        type : String,
        unique : [true, "user already registered"],
        lowercase : true,
        trim : true,
        minLength : 6,
        maxLength : 30
    },
    password : {
        type : String,
        trim : true,
        minLength : 8,
        maxLength : 400
    },
    department_id : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'departments'
    },
    project : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'projects'
    },
    // projects : [{
    //     type: Mongoose.Schema.Types.ObjectId,
    //     ref: 'projects'
    // }],
    created_at: { type: Date, default: Date.now },
    status : {
        type : Boolean,
        default : true
    },
    access_token : {
        type : String,
        trim : true
    },
    refresh_token : {
        type : String,
        trim : true
    }
}, { toJSON: { virtuals: true },  id: false  })

userSchema.virtual('isAdmin').get(function() {
    return this.department_id.name === "Administrator" ? true : false;
});
const User = Mongoose.model("users", userSchema);

module.exports = User