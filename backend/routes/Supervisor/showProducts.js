const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)

//show products related to warehouse assigned to supervisor
router.get("/:SupervisorId", authorized,async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    const supervisor = await query(
      "SELECT * FROM User WHERE ID = ? AND Type = 'Supervisor'",
      [req.params.SupervisorId]
    );
    if (!supervisor[0]) {
      return res.status(404).json({ msg: "Supervisor not found!" });
    }
    //get supervisor warehouse
    //get products related to warehouse (warehouse_product)
    //get products

    const products = await query(
      "SELECT p.* FROM Product p INNER JOIN warehouse_product pw ON p.ID = pw.product_ID INNER JOIN warehouse w ON pw.warehouse_ID = w.ID WHERE w.supervisor_ID = ?",
      [req.params.SupervisorId]
    );
    products.map((product) => {
      product.Photo = "http://" + req.hostname + ":3000/" + product.Photo;
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get warehouse related to supervisor
router.get("/GETWHINFO/:SupervisorId", authorized,async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    const supervisor = await query(
      "SELECT * FROM User WHERE ID = ? AND Type = 'Supervisor'",
      [req.params.SupervisorId]
    );
    if (!supervisor[0]) { // object of arrays
      return res.status(404).json({ msg: "Supervisor not found!" });
    }
   
    const warehouse = await query(
      "SELECT * FROM warehouse WHERE supervisor_ID = ?",
      [req.params.SupervisorId]
    );
    
    return res.status(200).json(warehouse);
  } catch (err) {
    return res.status(500).json(err);
  }
});


module.exports = router;
