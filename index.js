require("dotenv").config()
const express = require("express"),
    app = express(),
    constant = require("./constant"),
    routes = require("./Route/route")(),
    db = require("./db")
    bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, UPDATE, PUT");
    res.setHeader("Access-Control-Allow-Credential", true);
    next()
})

app.use("/api/", routes);

app.all("*", (request, response) => {
    console.log("~ Action -> " + request.connection.remoteAddress +"  " + request.method + " : " + request.url);
    response.status(404).json({message: constant.INVALID_URL, code : 404})
})

const {PORT} = process.env || 5000
db.connect(STATUS => {
    if(STATUS == constant.CONNETION_SUCCESS) {        
        app.listen(PORT, () => {
            console.log("Application Started")
        })
    }
})