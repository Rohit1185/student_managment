const express = require("express");
const app = express();
const cors = require("cors")
const dbconnet = require('./Config/dbconfig')
const Inquiry = require('./Router/InquiryRouter')
const path = require('path')
app.use(cors(
    {origin: "http://localhost:5173", // Allow requests from React app
    credentials: true,}
))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/',Inquiry)
app.use('/uploads', express.static(path.join(__dirname+'/uploads')))
app.listen(8080,()=>{console.log("Server is running on Port 8080")})