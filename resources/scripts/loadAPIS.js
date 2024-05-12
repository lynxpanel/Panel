const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const phpExpress = require('php-express')({binPath: 'php'});

module.exports = function loadAPIS(app, dir) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    let files = fs.readdirSync(path.join(dir, "/api"));
    for (let i = 0; i < files.length; i++) {
        let mod = require(path.join(dir, "/api", files[i]));
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
                mod.callback(req, res, dir);
            });
            }
            console.log(`Loaded: ${mod.name} | ${mod.method} | ${mod.path}`);
        } catch (err) {
            console.log(err);
        }
    }
};
