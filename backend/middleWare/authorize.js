const conn = require("../db/dbConnection");
const util = require("util"); // helper

const authorized = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const { token } = req.headers;
  const supervisor = await query("select * from user where token = ?", [token]);
  if (supervisor[0]) {
    res.locals.supervisor = supervisor[0];
    next();
  } else {
    res.status(403).json({
      errors: [
        {
          msg: "you are not authorized to access this route !",
        },
      ],
    });
  }
};

module.exports = authorized;
