const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let app = express();


app.use("/",(req, res)=> {
    res.send("Hello");
})

app.listen(8000, ()=> {
    console.log("Server started");
})