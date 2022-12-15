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
const { result } = require("lodash");
const { accountSchema } = require("./model/account.js");
// const { accountSchema } = require("./model/account.js");
const User=require("./model/user.js").User;
const AccountSchema=require("./model/account.js").accountSchema;
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


app.get("/",(req,res)=>{
    res.send("Hello world")
});

//add user to db
app.post('/add-user',(req,res)=>{
   let user=new User(req.body);
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
            res.json(result);
        })
        .catch((err)=>{
            console.log("Error: "+err);
        });
});


//get user by ssn
app.post("/user",(req,res)=>{
    User.find({SSN:req.body.SSN})
        .then((result)=>{
            if(result){
                res.status(200).send(result);
            }
            else res.status(404);
        })
        .catch((err)=>{
            console.log("Error: "+err);
        });
})

//get account for user 
app.post("/add-account",(req,res)=>{
    User.findOne({SSN:req.body.SSN})
    .then((result)=>{
        if(result){
            let userAccounts=result.Accounts;
            const updatedUser={
                SSN:req.body.SSN,
                Accounts:[...userAccounts,req.body.Accounts]
            }    
            User.update({SSN:req.body.SSN},{$set: updatedUser}).then((result)=>{
                res.send(result);
            }).catch((err)=>{
                console.log(err);
            });
        }
        else res.status(404);
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
            const userToSend=new User(result);
            res.status(200).send(JSON.stringify(userToSend));
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
function getUpdatedAccountWithTransaction(accountToUpdate,transactionToAdd){
    const modelAccount=model("modelAccount",accountSchema);
    let acc=new modelAccount(accountToUpdate);
    acc.Transactions.addToSet(transactionToAdd);
    return acc;
}
function updateAccountsList(allUserAccounts, transactionToAdd,accountType){
    for(var i=0;i<allUserAccounts.length;i++){
        if(allUserAccounts[i].Type==accountType){
            allUserAccounts[i]=getUpdatedAccountWithTransaction(allUserAccounts[i],transactionToAdd);
            return allUserAccounts;
        }
    }
}
//add transaction for a account
app.post('/add-transaction',(req,res)=>{
    const ssn=req.body.SSN;
    const accountType=req.body.accountType;
    const transactionToAdd=req.body.Transactions;
    try {
        const filter={SSN:ssn};
        User.findOne( filter)
        .then((result)=>{
            if(result){
                let allUserAccounts=updateAccountsList(result.Accounts,transactionToAdd,accountType);
                const updatedUser={
                    SSN:req.body.SSN,
                    Accounts:allUserAccounts
                }  
                User.update({SSN:req.body.SSN},{$set: updatedUser}).then((result)=>{
                    res.send(result);
                }).catch((err)=>{
                    console.log(err);
                });
            }
            else{
                res.status(404).send("Account or User is not found");
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