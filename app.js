const fs=require("fs/promises");
const express=require("express");
const cors=require("cors");
const _=require("lodash");
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const morgan=require("morgan");
// const { accountSchema } = require("./model/account.js");
const User=require("./model/user.js").User;
const Account=require("./model/account.js").accountSchema;
require('dotenv').config();

const dbURI="mongodb+srv://" + process.env.dbUserame + ":" + process.env.dbPassword + "@users.jeljdqg.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => { console.log("connected to db"); })
    .catch((err) => { console.log(err); });   

const app=express();
app.listen(3000,()=>{console.log("server started")});
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });

app.get("/",(req,res)=>{
    res.send("Hello World");
});

//add user to db
app.post('/add-user',(req,res)=>{
    // const user=new User({
    //     SSN:2,
    //     FullName:"Yasser",
    //     Email:"Yasser@gmail.com",
    //     Password:"123456",
    //     // Accounts:[account]
    // });
   let user=new User(req.body);
   console.log("user" , user);
    // const user=User();
    user.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log("Error: "+err);
        });
});
//get all users
app.get("/all-users",(req,res)=>{
    User.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log("Error: "+err);
        });
});
//get user by ssn
app.post("/user",(req,res)=>{
    User.find({SSN:req.body.SSN})
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log("Error: "+err);
        });
});
//get user by ssn
app.post("/add-account",(req,res)=>{
    account=req.body;

});
//not found page
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});