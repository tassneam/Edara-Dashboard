const router = require("express").Router();
const conn = require("../../db/dbConnection");
const util = require("util"); //helper
const authorized = require("../../middleWare/authorize");
const admin = require("../../middleWare/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../../middleWare/uploadImages");
const fs = require("fs"); // edit in files (file system)
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Admin manage supervisors
//Admin add supervisor
router.post(
  "",
  admin,
  upload.single("Photo"), //used to access date in (form-date)
  body("Email").isEmail().withMessage("please enter a valid email!"),
  body("Password").isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  body("Phone").isString().withMessage("please enter a valid Phone "),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF EMAIL EXISTS
      const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
      const checkEmailExists = await query(
        "select * from user where Email = ?",
        [req.body.Email]

      );

      if (checkEmailExists.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "email already exists !",
            },
          ],
        });
      }
      if (!Number.isInteger(parseInt(req.body.Phone)) ||
      !(parseInt(req.body.Phone) > 0)) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid  Phone",
          },
        ],
      });
    }
      // 2- PREPARE SUPERVISOR OBJECT

      const supervisor = {
        Email: req.body.Email,
        Password: await bcrypt.hash(req.body.Password, 10),
        Phone: req.body.Phone,
        Token: crypto.randomBytes(6).toString("hex"),
      };

      //check if email already exists in db
      var checkEmail = "SELECT * FROM user WHERE Email = ?";
      conn.query(checkEmail, [supervisor.Email], function (err, result) {
        if (result.length) {
          // Email already exists, show error message

          return res.status(500).json(({
            errors: [
              {
                msg: "Email already exists in the database.",
              },
            ],
          }));
        }
      });

      // 4 - INSERT PRODUCT INTO DB
      await query("insert into user set ?", supervisor);

      return res.status(200).json({
        msg: "user created successfully !",
      });
    } catch (err) {
      console.log(err); // to show error
      return res.status(500).json(err);
    }
  }
);

// delete supervisor
router.delete(
  "/:supervisorID", admin, async (req, res) => {
    try {
      // 2- CHECK IF PRODUCT EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const supervisor = await query(
        "select * from user where Id = ? and Type ='supervisor'",
        [req.params.supervisorID]
      );
      if (!supervisor[0]) {
        return res.status(404).json(({
          errors: [
            {
              msg: 'supervisor not found!',
            },
          ],
        }));
      }

      await query("delete from user where id = ? ", [supervisor[0].ID]);

      return res.status(200).json({
        msg: "supervisor deleted successfully",
      });
    } catch (err) {
      // console.log(err); // to show error
      return res.status(500).json(({
        errors: [
          {
            msg: err,
          },
        ],
      }));
    }
  });

//  SHOW A SPECIFIC SUPERVISOR BY SEARCHING WITH EMAIL or all supervisors
router.get(
  "", admin, async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      let search = "";
      if (req.query.search) {
        // query params  search
        search = `AND Email LIKE '%${req.query.search}%' `;
      }
      const supervisors = await query(
        `SELECT * FROM user where Type ='Supervisor'${search} `
      );
      if (!supervisors[0]) {
        return res.status(404).json({
          errors: [
            {
              msg: "supervisor not found!",
            },
          ],
        });
      }

      return res.status(200).json(supervisors);
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

//   //UPDATE Supervisor
router.put(
  "/:supervisor_ID",
  admin,
  //upload.single("Photo"),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);// transform query mysql --> promise to use [await/async]
      const supervisor = await query(
        "SELECT * FROM User WHERE ID = ? AND Type = 'Supervisor'",
        [req.params.supervisor_ID]
      );
      if (!supervisor[0]) {
        return res.status(404).json(({
          errors: [
            {
              msg: "Supervisor not found!",
            },
          ],
        }));
      }


      let updateFields = [];
      let values = [];

      if (req.body.Email) {
        const checkEmailExists = await query(
          "select * from user where Email = ?",
          [req.body.Email]

        );
        if (checkEmailExists.length > 0) {
          return res.status(400).json({
            errors: [
              {
                msg: "email already exists !",
              },
            ],
          });
        }

        updateFields.push("Email = ?");
        values.push(req.body.Email);
      }

      if (req.body.Password) {
        updateFields.push("Password = ?");
        values.push(await bcrypt.hash(req.body.Password, 10));
      }

      if (req.body.Phone) {
        updateFields.push("Phone = ?");
        values.push(req.body.Phone);
      }

      if (req.body.Status) {

        if (req.body.Status === "Active" || req.body.Status === "Inactive") {
          if (supervisor[0].Status === req.body.Status) {
            return res.status(400).json({
              errors: [
                {
                  msg: "Its already activated/deactivated ",
                },
              ]
            });
          }

          updateFields.push("Status = ?");
          values.push(req.body.Status);
        }

      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "no fields to update !",
            },
          ],
        });
      }

      let sql = `UPDATE User SET ${updateFields.join(
        ", "
      )} WHERE ID = ? AND Type = 'Supervisor'`;

      await query(sql, [...values, req.params.supervisor_ID]);

      return res.status(200).json({ msg: "Supervisor updated successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(({
        errors: [
          {
            msg: err,
          },
        ],
      }));
    }
  }
);

module.exports = router;