const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: "installation",
    method: "PHP",
    path: "/",
    callback: (req, res, dir) => {
        res.status(200).render(path.join(dir, "resources", "views", "events", "installation", "index.php"));
    }
};