'use strict'
const express=require('express');
const cors=require('cors');
const axios=require('axios');
require('dotenv').config();

const server=express();
server.use(express.json());
server.use(cors());
const PORT=process.env.PORT;


server.listen(PORT,listenHandler);
function listenHandler(){
    console.log(`listining on port${PORT}`);
}


///axios.get(`${process.env.REACT_APP_SERVER}/getApiData`);
server.get('/getApiData',getApiDataHandler)
async function getApiDataHandler(req,res){
let apiData = await axios.get('https://ltuc-asac-api.herokuapp.com/allChocolateData');
let apiDataArr=apiData.data.map(item=>{
    return new ChocolateData(item)
})

res.send(apiDataArr)
}

class ChocolateData{
    constructor(data){
        this.name=data.title;
        this.img=data.imageUrl;
    }
}



//// save data in DB 
var mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGOATLAS}`, { useNewUrlParser: true });
var chocolateSchema = new mongoose.Schema({
 
  email: String,
  name: String,
   img:String
 
});

var chocolatemodel = mongoose.model("chocolatemodel", chocolateSchema);

/////addToFav?email=...... body 
server.post('/addToFav',addToFavHandler)
async function addToFavHandler(req,res){
    console.log("addToFav hited");
    let email=req.query.email;
    let{name,img}=req.body;

    await chocolatemodel.create({email,name,img});
}


// get data from DB
/////getFromDB?email=......

server.get('/getFromDB',getFromDBHandler)
async function getFromDBHandler(req,res){
    console.log("getFromDBHandler hited");
    let email=req.query.email;
 

    await chocolatemodel.find({email},(err,data)=>{
        console.log(data);
        res.send(data)
    });
}

/// deleteFromDB/:id?email=emil
//let newDBData= await axios.delete(`${process.env.REACT_APP_SERVER}/deleteFromDB/${id}?email=${email}`)

server.delete('/deleteFromDB/:id',deleteFromDBHandler)
async function deleteFromDBHandler(req,res){
    console.log("deleteFromDB hited");

    let _id = req.params.id;
    let email=req.query.email;
     chocolatemodel.remove({_id},await function  (err,data){
         chocolatemodel.find({email},(error,allData)=>{
                    res.send(allData)
        })
    });
}

//// update from DB 
server.put('/updateFromDB/:id',updateFromDBHandler)
async function  updateFromDBHandler(req,res){
    console.log("updateFromDBHandler hited");
    let _id = req.params.id;
    let email=req.query.email;
    let {name,img}= req.body;
    chocolatemodel.findOne({_id},(err,data)=>{
       data.name=name;
       data.img=img;
        data.save();
        chocolatemodel.find({email},(error,allData)=>{

            res.send(allData);
        })


    })


}