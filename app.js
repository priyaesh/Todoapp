const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongo = require('mongodb');
const MongoClient= mongo.MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url ="mongodb://127.0.0.1:27017/";


app.use("/", express.static(__dirname +'/'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post("/tasks/new",function(req,res){
    
    MongoClient.connect(url, function(err, mgClient){

        if(err){ 
            console.log("Error in connection");
            console.log(err);
        }else {
            console.log("Connection successful ");
            console.log("inside the post");
            let db = mgClient.db("amazingtodoapp");
            let tasks= db.collection('tasks');

            tasks.insertOne({
                timestamp:new Date(),
                //description:"Esaa Test"
                description:req.body.description
            });

        }
        res.redirect("/");
    })

})

app.get("/tasks", function(req, res){
    console.log("Inside tasks GET function");
    MongoClient.connect(url,function(err, mgClient){
        if(!err){
            console.log("no error");
            let db = mgClient.db("amazingtodoapp");
            let tasks= db.collection('tasks');

            tasks.find({}).toArray(function(err, results){
                res.send(JSON.stringify(results));
            })
        }else {
            console.log("Error is "+err.stack);
        }
    })
})

app.get("/",function(req,res){
        res.sendFile(__dirname +"/index.html")
})

// app.put("/tasks/update/:id",function(req,res){
//     MongoClient.connect(url,function(err,db){
//         let tasks =db.collection('tasks');
//         tasks.update({
//             _id: new ObjectId(req.params.id)
//             },{$set:{
//             description: req.body.description
//             }}

//         )
//     })
// })

app.listen(3000,function(err){
    if(err){
        console.log("Error in connection"+ err);
    } else {
        console.log("Server ready");
    }
});