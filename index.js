const fs=require("fs/promises");
const express=require("express");
const cors=require("cors");
const _=require("lodash");
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose");
const morgan=require("morgan");
const { accountSchema } = require("./model/account.js");
const User=require("./model/user.js").User;
const Account=require("./model/account.js").accountSchema;
// import User from "userExport.js";

const dbURI = "mongodb+srv://salah:AsuBank123@users.jeljdqg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => { console.log("connected to db"); })
    .catch((err) => { console.log(err); });   

const app=express();
app.listen(3000,()=>{console.log("server started")});


//db
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


app.post('/add-user',(req,res)=>{
    // const account=new Account({
    //     Type:"Checking",
    //     Balance:1000,
    //     Currency:"EGP",
    //     Rate:1,
    //     Status:"Active",
    //     DateOfCreation:new Date(),
    // });
    const user=new User({
        SSN:2,
        FullName:"Salma",
        Email:"Salma.Magdy@gmail.com",
        Password:"123456",
        // Accounts:[account]
    });
    // const user=User();
    // user.
    user.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log("Error: "+err);
        });
});