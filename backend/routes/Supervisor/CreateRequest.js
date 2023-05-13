const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)

//create new request
router.post(
  "/:SupervisorID",
  authorized,
  body("ProductID").isString().withMessage("please enter a valid product ID"),
  body("quantity").isString().withMessage("please enter a valid Qantity "),
  async (req, res) => {
    try {
      //check if quantity is 0 value
      const query = util.promisify(conn.query).bind(conn);
      const ProductID = req.body.ProductID;
        if (!Number.isInteger(parseInt(req.body.quantity)) ||
          !(parseInt(req.body.quantity) > 0)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Invalid request quantity",
              },
            ],
          });
        }
      
      //check if product exists
      const product = await query("select * from product where ID = ?", [
        ProductID,
      ]);
      ;

      if (!product[0]) {
        return res.status(404).json({
          errors: [
            {
              msg: "Please choose product",
            },
          ],
        });
      }
      //GET WAREHOUSE ID OF SUPERVISOR 

      const SupervisorID = req.params.SupervisorID;
      const Warehouse_ID = await query("select ID from warehouse where Supervisor_ID = ?", [
        SupervisorID
      ]);

      //check that this product belong to this warehouse
      //res.json(Warehouse_ID[0].ID)
      const ProdToWare = await query("select * from warehouse_product where Product_ID = ? and Warehouse_ID =?", [
        ProductID, Warehouse_ID[0].ID
      ]);

      if (!ProdToWare[0]) {
        return res.status(404).json({ msg: "Product does not belong to your warehouse!" });
      }
      //res.json(ProdToWare)
      // db insertion
      await query(
        "INSERT INTO stock_request (Product_ID, Warehouse_ID, Supervisor_ID, Quantity) VALUES (?, ?, ?, ?)",
        [ProductID, Warehouse_ID[0].ID, SupervisorID, req.body.quantity]
      );

      return res.status(200).json({
        msg: "Request created successfully!",
      });
    } catch (err) {
      //console.log(err); // to show error
      return res.status(500).json(err);
    }
  }
);


module.exports = router;
