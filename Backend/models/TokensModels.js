const db = require("../config/db");

const Token = {
  saveToken: (userId, token, callback) => {
    db.query(
      "INSERT INTO tokens (user_id, token, expiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
      [userId, token],
      callback
    );
  },
  findToken: (token, callback) => {
    db.query("SELECT * FROM tokens WHERE token = ?", [token], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0]);
    });
  },
  deleteToken: (token, callback) => {
    db.query("DELETE FROM tokens WHERE token = ?", [token], callback);
  },
};

module.exports = Token;
