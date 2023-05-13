const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)

//  Show a history of stock requests related to his account(supervisor)

router.get("/:SupervisorId", authorized,async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      const Supervisor = await query("select * from user where Id = ?", [
        req.params.SupervisorId,
      ]);
      if (!Supervisor[0]) {
        return res.status(404).json({ msg: "Supervisor not found!" });
      }
  
      const Request = await query(
        "SELECT stock_request.*, product.Name AS product_name FROM stock_request JOIN product ON stock_request.product_id = product.ID where Supervisor_ID = ?",
        [req.params.SupervisorId]
      );
  
      return res.status(200).json(Request);
    } catch (err) {
      // console.log(err); // to show error
      return res.status(500).json(err);
    }
  });
  
 
  
module.exports = router;