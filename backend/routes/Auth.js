const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const upload = require("../middleWare/uploadImages");

// LOGIN
// LOGIN
router.post(
  "/login",
  //upload.single("Photo"),
  body("Email").isEmail().withMessage("please enter a valid email!"),
  body("Password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF EMAIL EXISTS
      const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
      const user = await query("select * from user where Email = ?", [
        req.body.Email,
      ]);
     
      if (user.length == 0) {
        return res.status(404).json({
          errors: [
            {
              msg: "email or password not found !",
            },
          ],
        });
      }

      // 3- CHECK PASSWORD
      const checkPassword = await bcrypt.compare(
        req.body.Password,
        user[0].Password
      );
      if (!checkPassword) {
        return res.status(401).json({
          errors: [
            {
              msg: "email or password not found !",
            },
          ],
        });
      }
      
      // 4- REMOVE PASSWORD FIELD AND SEND USER DATA
      delete user[0].Password;
      return res.status(200).json(user);

    } catch (err) {
      return res.status(500).json({ err: err });
    }
  }
);


// REGISTRATION
router.post(
  "/register",
  //upload.single("Photo"),
  body("Email").isEmail().withMessage("please enter a valid email!"),
  
  body("Password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),

  body("Phone"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
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
        res.status(400).json({
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

      // 3- PREPARE OBJECT USER TO -> SAVE
      const userData = {
        
        Email: req.body.Email,
        Password: await bcrypt.hash(req.body.Password, 10),
        Phone:req.body.Phone,
        Status:"Active",
        Type:"Supervisor",
        Token: crypto.randomBytes(16).toString("hex") // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
      };
 
      // 4- INSERT USER OBJECT INTO DB
      await query("insert into user set ? ", userData);
      delete userData.Password;
      return res.status(200).json(userData);
    } 
    catch (err) {
      return res.status(500).json({ err: err });
    }
  }
);

module.exports = router;
