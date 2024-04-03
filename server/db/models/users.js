const mongoose = require('mongoose');

const users = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        unique : true,
        required : true
    },
    user_type : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_types"
    },
    password_token: "string"
});

module.exports = mongoose.model("users",users);