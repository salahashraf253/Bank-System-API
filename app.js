const fs=require("fs/promises");
const express=require("express");
const cors=require("cors");
const _=require("lodash");
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose");
const model=mongoose.model;
const bodyParser=require("body-parser");
const morgan=require("morgan");
const JSON=require("JSON");
// const { accountSchema } = require("./model/account.js");
const User=require("./model/user.js").User;
const Account=require("./model/account.js").accountSchema;
require('dotenv').config();

const dbURI="mongodb+srv://" + process.env.dbUserame + ":" + process.env.dbPassword + "@users.jeljdqg.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => { console.log("connected to db"); })
    .catch((err) => { console.log(err); });   

const app=express();
const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{console.log("server started at port number "+PORT)});
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });

app.get("/",(req,res)=>{
    res.send("Hello world")
});

//add user to db
app.post('/add-user',(req,res)=>{
   let user=new User(req.body);
//    console.log("user" , user);
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
app.post("/all-users",(req,res)=>{
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
})

//get account for user 
app.post("/add-account",(req,res)=>{
    User.findOne({SSN:req.body.SSN})
    .then((result)=>{
        let userAccounts=result.Accounts;
        const updateDocument={
            SSN:req.body.SSN,
            Accounts:[...userAccounts,req.body.Accounts]
        }    
        User.update({SSN:req.body.SSN},{$set: updateDocument}).then((result)=>{
            res.send(result);
            // console.log(result);
        }).catch((err)=>{
            console.log(err);
        });
    })
    .catch((err)=>{
        console.log("Error: "+err);
    });

});

app.post('/login',(req,res)=>{
    const email=req.body.Email;
    const password=req.body.Password;
    try {
        User.findOne({ Email: email ,Password:password})
        .then((result)=>{
           if(result) {
            res.status(200).json({User: result });
           }
           else {
            res.status(401).send("User not found");
           }
        })
    } 
    catch (err) {
        console.log(err);
    }

});

app.delete("/delete-account",(req,res)=>{
    const ssn=req.body.SSN;
    //Todo delete account from user

});
//not found page
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});
