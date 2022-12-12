const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountSchema=require('./account.js').accountSchema;
const model=mongoose.model;

const userSchema=new Schema({
    SSN:{
        type:Number,
        required:true,
        unique:true
    },
    FullName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    Accounts:{
        type:[accountSchema],
        required:false
    },
    Gender:String,
    DateOfBirth:{
        type:Date,
        required:false
    },
    PhoneNumber:{
        type:String,
        required:false
    }

});
const User=model("User",userSchema);
module.exports={User};