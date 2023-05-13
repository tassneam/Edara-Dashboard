const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)

// show requests history of all supervisors

router.get("", admin, async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn);
        const Request = await query("SELECT stock_request.*, product.Name AS product_name,warehouse.Name AS warehouse_name, user.email FROM stock_request JOIN product ON stock_request.product_id = product.ID JOIN warehouse ON stock_request.warehouse_id = warehouse.ID JOIN user ON stock_request.supervisor_id = user.ID ; ");

        return res.status(200).json(Request);
    } catch (err) {
        console.log(err); // to show error
        return res.status(500).json(err);
    }
});
module.exports = router;