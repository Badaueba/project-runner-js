const express = require("express");
const http = require("http");
const reload = require("reload");
const bodyParser = require("body-parser");
const pug = require("pug");
const path = require("path");
const morgan = require("morgan");
const url = require("url");

let app = express();
const port = process.env.PORT || 8000;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set("port", port);
app.use(morgan('dev'));
app.use(bodyParser.json());

function allReq (req, res, next) {
    
    const parserdUrl = url.parse(req.url);
    console.log(`method: ${req.method} url: ${req.url} parsed: ${parsedUrl}`);
    next();
}
function render (req, res) {
    res.render("index", {title: "runner js", message: "Hellow World"});
}

app.get("*", allReq, render);

let server = http.createServer(app);
let reloadServer = reload(app);
app.listen(app.get("port"), () => {
    console.log(`listening to ${port}`);
});