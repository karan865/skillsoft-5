const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config({ path: "./config.env" });

require('./db/conn');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(
	cors({
		credentials: true
	})
);

app.use(require('./router/auth'));

app.get("/about", (req,res) => {
    res.send("Hello to the about us page");
});

const myMiddleWare = (req,res,next) => {
    console.log("I am the middleWare");
    next();
}

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`backend is running at port no ${port}`);
});

