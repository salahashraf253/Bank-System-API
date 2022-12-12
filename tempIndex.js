const fs=require("fs/promises");
const express=require("express");
const cors=require("cors");
const _=require("lodash");
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose");

const uri = "mongodb+srv://salah:AsuBank123@cluster0.jeljdqg.mongodb.net/?retryWrites=true&w=majority";

// async function connectDataBase(){
//     try{
//         await mongoose.connect(uri);
//         console.log("Connected to database");   
//     }
//     catch(err){
//         console.log(err);
//     }
// }
// connectDataBase();
const {MongoClient} = require('mongodb');

async function main(){
    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        // await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 
main().catch(console.error);
const app=express();
const port=3000;

const bodyParser=require('body-parser');
app.use(bodyParser.json());

app.post("/",(req,res)=>{
    console.log(req.body);
    res.send("Hello World");
});
app.listen(port,()=>{
    console.log("Server started at port "+port);
});
