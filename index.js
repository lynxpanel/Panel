require('dotenv').config();
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

if(process.env.DB_TYPE === "sqlite"){

} else if(process.env.DB_TYPE === "mysql"){

} else if(process.env.DB_TYPE === "redis"){
    return console.warn("redis isn't supported yet.");
} else {
    return console.warn("Wrong Database type specified.");
}


function loadAPIS(app){
    let files = fs.readdirSync(path.join(__dirname, "/api"), (err, data) => {if(err){return console.log(err);};return data;});
    for (let i = 0; i < files.length; i++) {
        let mod = require(path.join(__dirname, "/api", files[i]));
        try {
            if(!mod.name){mod.name = "undefined"}else{mod.name = mod.name};
            if(!mod.method || !mod.path){console.warn(`Error: ${mod.name}`);return;};
            app[mod.method.toLowerCase()](mod.path, (req, res) => {
                mod.callback(req, res);
            });
            console.log(`Loaded: ${mod.name} | ${mod.method} | ${mod.path}`);
        } catch (err) {
            console.log(err);
        }
    }
}

try {
    console.clear();
    app.listen(process.env.APP_PORT, () => {
        console.log(`Panel running on: ${process.env.APP_IP}:${process.env.APP_PORT}`);
        loadAPIS(app);
    });
} catch (error) {
	console.warn(error);
}