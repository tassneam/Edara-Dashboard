const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)
const { devNull } = require("os");

//ADMIN [CREATE, UPDATE, DELETE, LIST]
//CREATE
router.post(
  "/:warehouseID",
  admin,
  upload.single("Photo"), //used to access date in (form-date)
  body("Name")
    .isString()
    .withMessage("please enter a valid product name")
    .isLength({ min: 5 })
    .withMessage("product name should be at lease 5 characters"),

  body("Description")
    .isString()
    .withMessage("please enter a valid description ")
    .isLength({ min: 5 })
    .withMessage("description name should be at least 5 characters"),
    body("Stock"),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);

      // 2- CHECK IF warehouse EXISTS OR NOT

      const warehouseIDD = await query("select * from warehouse where Id = ?", [
        req.params.warehouseID,
      ]);
      if (!warehouseIDD[0]) {
        return res.status(404).json({ msg: "warehouse not found!" });
      }

      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //console.log ("hello");

      //2- VALIDATE THE IMAGE
      if (!req.file) {
        return res.status(400).json({
          errors: [
            {
              msg: "Image is Required",
            },
          ],
        });
      }
      if (!Number.isInteger(parseInt(req.body.Stock)) ||
      !(parseInt(req.body.Stock) > 0)) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid  Stock",
          },
        ],
      });
    }
      
      const product = {
        Name: req.body.Name,
        Description: req.body.Description,
        Photo: req.file.filename,
        Stock : req.body.Stock
      };

      // 4 - INSERT PRODUCT INTO DB

      // await query("INSERT INTO product (Name, Description, Photo) VALUES (?, ?, ?)", [name, description, photo]);
      const Result = await query("insert into product set ?", product);

      // 5- UPDATE WAREHOUSE_PRODUCT TABLE
      const warehouseProduct = {
        Warehouse_ID: req.params.warehouseID,
        Product_ID: Result.insertId,
      };
      await query("INSERT INTO warehouse_product SET ?", warehouseProduct);

      return res.status(200).json({
        msg: "product created successfully !",
      });
    } catch (err) {
      console.log(err); // to show error
      return res.status(500).json(err);
    }
  }
);

// //UPDATE
router.put(
  "/:wareID/:prodID", //params
  admin,
  upload.single("Photo"), //used to access date in (form-date)
  body("Name"),
  body("Description"),
  body("NewwarehouseID"),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);

      //  CHECK IF WAREHOUSE EXISTS OR NOT
      const warehouse = await query("SELECT * FROM warehouse WHERE ID = ?", [
        req.params.wareID,
      ]);
      if (!warehouse[0]) {
        return res.status(404).json({errors: [
          {
            msg:"warehouse not found!",
          },
        ]})
      }

      ///CHECK IF PRODUCT EXISTS OR NOT
      const productcheck = await query("select * from product where Id = ?", [
        req.params.prodID,
      ]);
      if (!productcheck[0]) {
        return res.status(404).json({errors: [
          {
            msg:"product not found!",
          },
        ]})
      }

      const Product = {};

      if (req.body.Name) {
        Product.Name = req.body.Name;
      }

      if (req.body.Description) {
        Product.Description = req.body.Description;
      }

      // check if the user provided a new photo, and update the photo variable accordingly
      if (req.file) {
        Product.Photo = req.file.filename; // or however you get the filename from the uploaded file
        fs.unlinkSync("./upload/" + productcheck[0].Photo);
      }
     

      if (req.body.NewwarehouseID) { 

        // 2- CHECK IF warehouse EXISTS OR NOT
        const warehouseIDD = await query(
          "select * from warehouse where Id = ?",
          [req.body.NewwarehouseID]
        );
        if (!warehouseIDD[0]) {
          return res.status(404).json({errors: [
            {
              msg:"new warehouse ID not found!",
            },
          ]})
        }
        if (req.body.NewwarehouseID===req.params.wareID) {
          return res.status(404).json({errors: [
            {
              msg:"This product is already assigned to this warehouse",
            },
          ]})
        }
       Product.NewwarehouseID = req.body.NewwarehouseID
      
    } 
    if (Object.keys(Product).length == 0){ 
        return res.status(404).json({errors: [
          {
            msg:"please update atleast one value",
          },
        ]})
      
    }else{      
      if(Product.NewwarehouseID){
        await query("UPDATE Warehouse_product SET Warehouse_ID = ? WHERE Product_ID=?", [
          req.body.NewwarehouseID,
          req.params.prodID,

        ]);
        delete Product.NewwarehouseID ; 
      } 
      
      if(!Object.keys(Product).length == 0){{
      await query("UPDATE product SET ? WHERE ID=?", [
        Product,
        req.params.prodID,
      ]);
     }

    }
  }
      return res.status(200).json({
        msg: "Product updated successfully",
      });
    } catch (err) {
      console.log(err); // to show error
      return res.status(500).json(err);
    }
  }
);
// //delete product from all warehouses
router.delete("/:ProdId", admin, async (req, res) => {
  try {
    // 2- CHECK IF PRODUCT EXISTS OR NOT
    const query = util.promisify(conn.query).bind(conn);
    const product = await query("select * from product where Id = ?", [
      req.params.ProdId,
    ]);
    if (!product[0]) {
      return res.status(404).json({ msg: "product not found!" });
    }

    // remove image of product
    fs.unlinkSync("./upload/" + product[0].Photo); // delete old image

    // delete from database
    await query("delete from product where id = ? ", [product[0].ID]);

    return res.status(200).json({
      msg: "product deleted successfully",
    });
  } catch (err) {
    // console.log(err); // to show error
    return res.status(500).json(err);
  }
});
//delete product from a specific warehouse
router.delete("/:warehouseId/:productId", admin, async (req, res) => {
  try {
    // 1- CHECK IF PRODUCT EXISTS OR NOT
    const query = util.promisify(conn.query).bind(conn);
    const product = await query("SELECT * FROM product WHERE Id = ?", [
      req.params.productId,
    ]);
    if (!product[0]) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    // 2- REMOVE PRODUCT FROM SPECIFIED WAREHOUSE
    const warehouseProduct = await query(
      "SELECT * FROM warehouse_product WHERE Product_ID = ? AND Warehouse_ID = ?",
      [req.params.productId, req.params.warehouseId]
    );
    if (!warehouseProduct[0]) {
      return res.status(404).json({ msg: "Product not found in warehouse!" });
      return;
    }

    await query(
      "DELETE FROM warehouse_product WHERE Product_ID = ? AND Warehouse_ID = ?",
      [req.params.productId, req.params.warehouseId]
    );

    // 3- DELETE PRODUCT FROM DATABASE IF IT IS NO LONGER LINKED TO ANY WAREHOUSES
    const remainingWarehouseProducts = await query(
      "SELECT * FROM warehouse_product WHERE Product_ID = ?",
      [req.params.productId]
    );
    if (remainingWarehouseProducts.length === 0) {
      fs.unlinkSync("./upload/" + product[0].Photo); // delete old image

      await query("DELETE FROM product WHERE Id = ?", [product[0].ID]);
    }

    return res.status(200).json({
      msg: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err); // log error to console
    return res.status(500).json(err);
  }
});



// Search Product by its name or description in a specific warehouse
router.get("/:warehouseID", admin,async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // query params  search
      search = `AND (p.Name LIKE '%${req.query.search}%' OR p.Description LIKE '%${req.query.search}%') `;
    }
    const products = await query(
      `SELECT p.* FROM product p INNER JOIN warehouse_product pw ON p.ID = pw.product_ID where Warehouse_ID = ? ${search} `,
      [req.params.warehouseID]
    );

    products.map((product) => {
      product.Photo = "http://" + req.hostname + ":3000/" + product.Photo;
    });
    return res.status(200).json(products);
  } catch (err) {
    // console.log(err); // to show error
    return res.status(500).json(err);
  }
});

// get all products for admin
// Search Product by its name or description
router.get("", admin, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // query params  search
      search = `(and p.Name LIKE '%${req.query.search}%' or p.Description LIKE '%${req.query.search}%') `;
    }
    const products = await query(
      `SELECT p.* FROM product p INNER JOIN warehouse_product pw ON p.ID = pw.product_ID  ${search} `,
    );

    products.map((product) => {
      product.Photo = "http://" + req.hostname + ":3000/" + product.Photo;
    });
    return res.status(200).json(products);
  } catch (err) {
    // console.log(err); // to show error
    return res.status(500).json(err);
  }
});




module.exports = router;
