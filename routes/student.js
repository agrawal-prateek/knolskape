const express = require("express");

const validate = require("../utils/validateToken");
const connection = require("../config");
const response = require("../utils/response");

let router = express.Router();

router.post("/", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const name = req.body.name;
    if (!name) return response(res, 400, false, "Invalid Request");

    connection.query(
      'select id from roles where role="student"',
      (error, results, fields) => {
        if (error) return response(res, 400, false, "Invalid Request");
        else {
          connection.query(
            `insert into user(name, role) values('${name}', ${results[0].id})`,
            (error, results, fields) => {
              if (error) return response(res, 400, false, "Invalid Request");
              else return response(res, 201, true);
            }
          );
        }
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false, "Invalid Token");
  }
});

router.patch("/:id", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const id = req.params.id;
    const name = req.body.name;
    if (!name || !id) return response(res, 400, false, "Invalid Request");
    connection.query(
      `update user set name='${name}' where id=${id}`,
      (error, results, fields) => {
        if (error) return response(res, 400, false, "Invalid Request");
        else return response(res, 204, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false, "Invalid Token");
  }
});

router.delete("/:id", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const id = req.params.id;

    if (!id) return response(res, 400, false, "Invalid Request");
    connection.query(
      `delete from user where id=${id}`,
      (error, results, fields) => {
        if (error) return response(res, 304, false, "Invalid Request");
        else return response(res, 204, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false, "Invalid Token");
  }
});

module.exports = router;
