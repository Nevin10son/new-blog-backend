const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models");

let app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Nevin:nevintensonk@cluster0.0rfrr.mongodb.net/newblogapp?retryWrites=true&w=majority&appName=Cluster0")


app.post("/signUp",(req, res)=> {
    let data = req.body;
    let hashedpwd = bcrypt.hashSync(req.body.password,10);
    req.body.password = hashedpwd;
    
    userModel.find({emailid:req.body.emailid}).then(
        (userdata)=> {
            if (userdata.length > 0)
            res.json({"Status":"This email is currently in use"});

            else {
                let item = new userModel(data);
                item.save();
                res.json({"Status":"Success"})
            }
        }

    ).catch(
      
    )
    
    

    
})

app.listen(8000, ()=> {
    console.log("Server started");
})