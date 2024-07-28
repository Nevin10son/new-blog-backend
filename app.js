const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models");
const postModel = require("./posts");


let app = express();
app.use(express.json());
app.use(cors());



mongoose.connect("mongodb+srv://Nevin:nevintensonk@cluster0.0rfrr.mongodb.net/newblogapp?retryWrites=true&w=majority&appName=Cluster0")

app.post("/create",async(req,res) =>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"BlogToken",async(error,decoded)=>{
        if(decoded && decoded.emailid) {
            let result = new postModel(input)
            await result.save()
            res.json({"status":"Success"})
        }else {
            res.json({"Status":"Invalid Authentication"})
        }
    })
})

app.post("/viewall",(req,res) =>{
    let token = req.headers.token
    jwt.verify(token,"BlogToken",(error, decoded) => {
        if(decoded && decoded.emailid) {
                postModel.find().then(
                    (items) => {
                        res.json(items)
                        
                    }
                ).catch(
                    (error) => {
                        res.json({"Status":"Error"})
                    }
                )
        } else {
            res.json({"Status":"Invalid Authentication"})
        }
            
        }
    )
    })


app.post("/signin", (req, res) => {
    let data = req.body;
    let result = userModel.find({emailid:req.body.emailid}).then(
        (details) => {
            console.log(details);
            if (details.length > 0) {
                let comparepassword = bcrypt.compareSync(req.body.password, details[0].password);
                if (comparepassword){
                jwt.sign({emailid:req.body.emailid},"BlogToken",{expiresIn:"1d"},
                    (error,token) => {
                        if (error){
                            res.json({"Status":"error","Error":error});
                        }
                        else{
                            res.json({"Status":"Success","Token":token,"UserId":details[0]._id})
                        }
                    }
                )
                }
                else {
                    res.json({"Status":"Invalid password" })
                }
                
            } else {
                res.json({"Status":"Invalid Emailid"});
            }
        }

    )
})



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