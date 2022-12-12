const Schema=require("mongoose").Schema;

const transactionSchema=new Schema({
    Id:{
        type:Number,
        required:true,
        autoGenerated:true
    },
    Type:{
        type:String,
        required:true
    },
    Amount:{
        type:Number,
        required:true
    },
    Date:{
        type:Date,
    },
    description:{
        type:String,
        required:false
    }
});

module.exports={transactionSchema};