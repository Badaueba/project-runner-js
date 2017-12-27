const express = require("express");
const http = require("http");
const reload = require("reload");
const bodyParser = require("body-parser");
const pug = require("pug");
const path = require("path");
const morgan = require("morgan");
const url = require("url");
const fs = require("fs");

const klawSync = require('klaw-sync');


let app = express();
const port = process.env.PORT || 8000;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set("port", port);

app.use(express.static( __dirname + "/dev/"));
app.use(morgan('dev'));
app.use(bodyParser.json());

const mimeType = {
    ".ico": "image/x-icon",
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".wav": "audio/wav",
    ".mp3": "audio/mp3",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
}

function handler (req, res, next) {
    const parsedUrl = url.parse(req.url, true, true);
    let pathname; 
    let dirContent;
    pathname = `.${parsedUrl.pathname}`;
    console.log(`method: ${req.method}, url: ${req.url}, pathname: ${pathname}`);
    console.log("\n")

    //force to not show root dir
    if (pathname === "./") {
        pathname = "./dev"
    }

    var files = klawSync(pathname, {
        nodir: true
    });
    // console.log("files: ", files);
    var paths = klawSync(pathname, {
        nofile: true
    });  

    dirContent = paths.map(p => {
        let splited = p.path.split("runner", p.path.indexOf("runner"));
        console.log(`\n spited: ${splited[1]} \n`);
        return splited[1];
    });

    fs.exists(pathname, function (exist) {
        if (!exist) {
            res.render("index");
            return;
        }
        if (fs.statSync(pathname).isDirectory()) {
            console.log("dirContent: ", dirContent);
            console.log("\n");
            pathname += "/index.html";
        } 
        req.pathname = pathname;
        req.dirContent = dirContent;
        next();
    });
}

function sendData (req, res) {
    let pathname = req.pathname;
    let dirContent = req.dirContent;
    fs.readFile(pathname, function (err, data) {
        if (err) {
            console.log("can't send this file: ", pathname);
            console.log("\n");
            res.render("index", {title: "runner js", dir: dirContent});
        }
        else {
            console.log("Sending file!", pathname);
            const ext = path.parse(pathname).ext;
            res.setHeader("Content-type", mimeType[ext] || 'text/plain');
            res.end(data);
        }
    });
}

app.get("/*", handler, sendData);
let server = http.createServer(app);
let reloadServer = reload(app);
app.listen(app.get("port"), () => {
    console.log(`listening to ${port}`);
});