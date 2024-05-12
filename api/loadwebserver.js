const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: "loadwebserver",
    method: "GET",
    path: "/",
    callback: (req, res, dir) => {
        let data = fs.readFileSync(path.join(dir, "resources", "views", "installation", "index.html"), { encoding: "utf-8" });
        res.status(200).end(data);
    }
};