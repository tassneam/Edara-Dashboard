const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)

//CREATE WAREHOUSE
router.post(
  "",
  admin,
  // upload.single("Photo"), //used to access date in (form-date)
  body("Name")
    .isString()
    .withMessage("please enter a valid product name")
    .isLength({ min: 5 })
    .withMessage("Warehouse name should be at lease 5 characters"),

  body("Location")
    .isString()
    .withMessage("please enter a valid location ")
    .isLength({ min: 10 })
    .withMessage("warehouse location should be at lease 10 characters"),

  body("Capacity").isString().withMessage("please enter a valid Capacity "),

  body("Supervisor_ID")
    .isString()
    .withMessage("please enter a valid Supervisor_ID "),

  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]

      if (
        !(
          Number.isInteger(parseInt(req.body.Capacity)) &&
          parseInt(req.body.Capacity) > 0
        )
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid request capacity",
            },
          ],
        });
      }
      const query = util.promisify(conn.query).bind(conn);
      // check if supervisor exists
      const Supervisor_ID = req.body.Supervisor_ID;

      const Supervisor = await query(
        "SELECT ID FROM user WHERE ID = ? AND Type = ?",
        [Supervisor_ID, "Supervisor"]
      );
      //make sure that the supervisor is not already assgined to a different warehouse
      const supervisorAssigned = await query(
        "SELECT ID FROM warehouse WHERE Supervisor_ID = ?",
        [Supervisor_ID]
      );
      if (supervisorAssigned[0]) {
        return res.status(404).json({
          errors: [
            {
              msg: "supervisor is already assigned to a warehouse!",
            },
          ],
        });
      }
      if (
        !(
          Number.isInteger(parseInt(req.body.Supervisor_ID)) &&
          parseInt(req.body.Supervisor_ID) > 0
        )
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid  Supervisor_ID Format",
            },
          ],
        });
      }
      if (!Supervisor[0]) {
        return res.status(404).json({
          errors: [
            {
              msg: "supervisor not found!",
            },
          ],
        });
      }
      const warehouse = {
        Name: req.body.Name,
        Location: req.body.Location,
        Capacity: req.body.Capacity,
        Status: "Active",
        Supervisor_ID: req.body.Supervisor_ID,
      };

      // 4 - INSERT Warehouse INTO DB

      await query("insert into warehouse set ?", warehouse);

      return res.status(200).json({
        msg: "warehouse created successfully !",
      });
    } catch (err) {
      //console.log(err); // to show error
      return res.status(500).json({
        errors: [
          {
            msg: err,
          },
        ],
      });
    }
  }
);

// //UPDATE
router.put(
  "/:warehouseID", //params
  admin,
  //upload.single("Photo"), //used to access date in (form-date)
  body("Name")
    .isString()
    .withMessage("please enter a valid product name")
    .isLength({ min: 5 })
    .withMessage("Warehouse name should be at lease 5 characters"),

  body("Location")
    .isString()
    .withMessage("please enter a valid location ")
    .isLength({ min: 5 })
    .withMessage("warehouse location should be at lease 10 characters"),

  body("Status").isString().withMessage("please enter a valid Status "),
  body("Capacity").isString().withMessage("please enter a validdd Capacity "),

  body("Supervisor_ID")
    .isString()
    .withMessage("please enter a valid Supervisor_ID "),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);

      // 2- CHECK IF warehouse EXISTS OR NOT

      const warehouseIDD = await query("select * from warehouse where Id = ?", [
        req.params.warehouseID,
      ]);
      if (!warehouseIDD[0]) {
        res.status(404).json({ msg: "warehouse not found!" });
      }

      const warehouse = {};

      if (req.body.Name) {
        warehouse.Name = req.body.Name;
      }

      if (req.body.Location) {
        warehouse.Location = req.body.Location
      }

      if (req.body.Status) {
        if (req.body.Status === "Active" || req.body.Status === "Inactive") {
          if(warehouseIDD[0].Status===req.body.Status) {
            return res.status(400).json({
              errors: [
                {
                  msg: "Its already activated/deactivated ",
                },
              ]
            });
          }
          warehouse.Status = req.body.Status

        } else return res.status(400).json({
          errors: [
            {
              msg: "invalid status ",
            },
          ]
        });
      }

      if (req.body.Capacity) {
        if (Number.isInteger(parseInt(req.body.Capacity)) &&
          parseInt(req.body.Capacity) > 0) {

          warehouse.Capacity = req.body.Capacity;
        } else {
          return res.status(400).json({
            errors: [
              {
                msg: "Invalid request capacity number",
              },
            ]
          })
        }
      }
      if (req.body.Supervisor_ID) {
        // check if supervisor exists
        warehouse.Supervisor_ID = req.body.Supervisor_ID;
        const Supervisor = await query(
          "SELECT ID FROM user WHERE ID = ? AND Type = ?",
          [warehouse.Supervisor_ID, "Supervisor"]
        );


        if (!Supervisor[0]) {
          return res.status(404).json({ msg: "supervisor not found!" });
        }
        //make sure that the supervisor is not already assgined to a different warehouse
        const supervisorAssigned = await query(
          "SELECT ID FROM warehouse WHERE Supervisor_ID = ?",
          [req.body.Supervisor_ID]
        );

        if (supervisorAssigned[0]) {
          return res.status(404).json({
            errors: [
              {
                msg: "supervisor already assigned to a warehouse",
              },
            ]
          });
        }
        warehouse.Supervisor_ID = req.body.Supervisor_ID;
      }
      if (Object.keys(warehouse).length === 0) {
        return res.status(404).json({
          errors: [
            {
              msg: "please update atleast one value",
            },
          ]
        })
      } else {
        await query("UPDATE warehouse SET ? WHERE ID=?", [
          warehouse,
          req.params.warehouseID,
        ]);
      }
      return res.status(200).json({
        msg: "warehouse updated successfully",
      });
    } catch (err) {
      //console.log(err); // to show error
      return res.status(500).json({
        errors: [
          {
            msg: err,
          },
        ]
      });
    }
  }
);

//delete
router.delete(
  "/:Id",
  admin,
  async (req, res) => {
    try {
      // 2- CHECK IF PRODUCT EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const warehouse = await query("select * from warehouse where Id = ?", [
        req.params.Id,
      ]);
      if (!warehouse[0]) {
        res.status(404).json({ msg: "warehouse not found!" });
      }

      // delete from database
      await query("delete from warehouse where id = ? ", [warehouse[0].ID]);

      res.status(200).json({
        msg: "warehouse deleted successfully",
      });
    } catch (err) {
      // console.log(err); // to show error
      res.status(500).json(err);
    }
  }
);

// show
router.get("", admin, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // query params  search
      search = `where name LIKE '%${req.query.search}%' or Location LIKE '%${req.query.search}%' `;
    }
    const warehouse = await query(`SELECT w.ID, w.Name, w.Location, w.Status, w.Capacity, u.Email AS SupervisorName FROM warehouse w LEFT JOIN user u ON w.Supervisor_ID = u.ID ${search}`);

    return res.status(200).json(warehouse);
  } catch (err) {
    // console.log(err); // to show error
    return res.status(500).json({
      errors: [
        {
          msg: err,
        },
      ],
    });
  }
});

module.exports = router;
