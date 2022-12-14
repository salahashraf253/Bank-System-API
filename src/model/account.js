const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const model=mongoose.model;

const creditSchema=require("./creditCard.js").creditSchema;
const transactionSchema=require("./transaction.js").transactionSchema;


const accountSchema=new Schema({
    Type:{
        type:String,
        required:true,
        // unique:true
    },
    Balance:{
        type:Number,
        required:true
    },
    Currency:{
        type:String,
        required:true
    },
    Rate:{
        type:Number,
    },
    Status:{  
        type:String,
        required:true
    },
    DateOfCreation:{    
        type:Date,
        required:true
    },
    CreditCard:{
        type:creditSchema,
        required:false
    },
    Transactions:{
        type:[transactionSchema],
        required:false
    },
});
module.exports={accountSchema};