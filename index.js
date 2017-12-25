const express = require("express");
const http = require("http");
const reload = require("reload");
const bodyParser = require("body-parser");
const pug = require("pug");
const path = require("path");
const morgan = require("morgan");
const url = require("url");
const fs = require("fs");

let app = express();
const port = process.env.PORT || 8000;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set("port", port);

app.use(express.static( __dirname + "/dev/"));
app.use(morgan('dev'));
app.use(bodyParser.json());

function allReq (req, res, next) {
    
    const parsedUrl = url.parse(req.url);
    let pathname = __dirname + parsedUrl.pathname;
    // let pathname = `.${parsedUrl.pathname}`;
    console.log(`method: ${req.method}, url: ${req.url}, pathname: ${pathname}`);
    let dirContent;

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

    
    fs.exists(pathname, function (exist) {
        
        if (!exist) {
            console.log("!exist")
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

     

        if (fs.statSync(pathname).isDirectory()) {
            dirContent = fs.readdirSync(pathname)
            console.log("dirContent: ", dirContent)

            pathname += "index.html";
            console.log("Yes, is a directory: ", pathname);

            if (pathname == "./") {
                res.render("index", {title: "Home View", message: "Hello mundão de deus", dir : dirContent});
                return;
            }
        }


        fs.readFile(pathname + "/", function (err, data) {
            if (err) {
                console.log("can't send: ", pathname);
                res.statusCode = 500;
                // res.send(`Error getting the file: ${err}`);
                res.render("index", {title: "runner js", dir: dirContent})
            }
            else {
                const ext = path.parse(pathname).ext;
                res.setHeader("Content-type", mimeType[ext] || 'text/plain');
                res.end(data);
            }
        })

    })

    // next();
}
function render (req, res) {
    res.render("index", {title: "runner js", dir: []});
}

app.get("*", allReq);

let server = http.createServer(app);
let reloadServer = reload(app);
app.listen(app.get("port"), () => {
    console.log(`listening to ${port}`);
});