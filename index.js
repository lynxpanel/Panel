require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const loadAPIS = require('./resources/scripts/apiHandler');

const app = express();

if(process.env.DB_TYPE === "sqlite"){

} else if(process.env.DB_TYPE === "mysql"){

} else if(process.env.DB_TYPE === "redis"){
    return console.warn("redis isn't supported yet.");
} else {
    return console.warn("Wrong Database type specified.");
}

try {
    console.clear();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    app.listen(process.env.APP_PORT, process.env.APP_IP, () => {
        console.log(`Panel running on: ${process.env.APP_IP}:${process.env.APP_PORT}`);
        loadAPIS(app, __dirname);
    });
} catch (error) {
	console.warn(error);
};