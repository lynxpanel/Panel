const fs = require('fs');
const path = require('path');
const phpExpress = require('php-express')({binPath: 'php'});
let mainDir;

function ifFile(app, dir){
    let mod = require(dir);
    try {
        if(mod.method === "PHP"){
            app.engine('php', phpExpress.engine);
            app.all(/.+\.php$/, phpExpress.router);
            app.set('view engine', 'php');
            app.use(mod.path, (req, res) => {
                mod.callback(req, res, dir);
            });
        }else{
        app[mod.method.toLowerCase()](mod.path, (req, res) => {
            mod.callback(req, res, mainDir);
        });
        }
        console.log(`Loaded: ${mod.name} | ${mod.method} | ${mod.path}`);
    } catch (err) {
        console.log(err);
    }
}

function ifDir(app, dir){
    let files = fs.readdirSync(dir);
    if(files.length === 0){return;}else{
        for (let i = 0; i < files.length; i++) {
            let stats = fs.lstatSync(path.join(dir, files[i]));
            if (stats.isDirectory()) {
                ifDir(app, path.join(dir, files[i]));
            } else {
                ifFile(app, path.join(dir, files[i]));
            }
        }
    }
}

module.exports = function loadAPIS(app, dir){
    const apiDir = path.join(dir, 'api'); // Where the apis are stored.

    mainDir = dir;
    let files = fs.readdirSync(apiDir);
    for (let i = 0; i < files.length; i++) {
        let stats = fs.lstatSync(path.join(apiDir, files[i]));
        if(files.length === 0){return;}else{
            if (stats.isDirectory()) {
                ifDir(app, path.join(apiDir, files[i]));
            } else {
                ifFile(app, path.join(apiDir, files[i]));
            }
        }
    }
}