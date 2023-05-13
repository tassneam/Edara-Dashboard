const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)

router.put("/:requestId",
  admin,
  body("Action")
    .isString()
    .withMessage("please enter a valid Action")

  , async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      const requestId = req.params.requestId;
      const action = req.body.Action;
    
      // check if the request exists
      const request = await query("SELECT * FROM stock_request WHERE ID = ?", [
        requestId,
      ]);
      if (!request[0]) {
        return res.status(404).json({ msg: "Request not found!" });
      }

      if (request[0].Status != "Pending") {
        return res
          .status(400)
          .json({ msg: "This request has already been processed!" });
      }

      // update the request status
      await query("UPDATE stock_request SET status = ? WHERE ID = ?", [
        action,
        requestId,
      ]); 

      // update the product stock
      if(req.body.Action=="Approved"){
      const productId = request[0].Product_ID;
      const quantity = request[0].Quantity;
      await query("UPDATE Product SET Stock = Stock + ? WHERE ID = ?", [
        quantity,
        productId,
      ]);
    }
    return res.status(200).json({
        msg: "Request updated successfully!",
      });

    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });
  
module.exports = router;