const fs = require("node:fs");
const path = require("node:path");
const bodyParser = require('body-parser');

module.exports = 
function loadAPIS(app, dir){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    let files = fs.readdirSync(path.join(dir, "/api"), (err, data) => {if(err){return console.log(err);};return data;});
    for (let i = 0; i < files.length; i++) {
        let mod = require(path.join(dir, "/api", files[i]));
        try {
            if(!mod.name){mod.name = "undefined"}else{mod.name = mod.name};
            if(!mod.method || !mod.path){console.warn(`Error: ${mod.name}`);return;};
            app[mod.method.toLowerCase()](mod.path, (req, res, __dirname) => {
                mod.callback(req, res, dir);
            });
            console.log(`Loaded: ${mod.name} | ${mod.method} | ${mod.path}`);
        } catch (err) {
            console.log(err);
        }
    }
}