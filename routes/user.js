const express = require("express");

const validate = require("../utils/validateToken");
const connection = require("../config");
const response = require("../utils/response");

let router = express.Router();

router.post("/", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);
  const type = req.body.type;

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher" && type === "student") {
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
  const type = req.body.type;

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher" && type === "student") {
    const id = req.params.id;
    const name = req.body.name;
    if (!name || !id) return response(res, 400, false);
    connection.query(
      `update user set name='${name}' where id=${id}`,
      (error, results, fields) => {
        if (error) return response(res, 400, false);
        else return response(res, 204, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false);
  }
});

router.delete("/:id", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const id = req.params.id;
    if (!id) return response(res, 400, false);

    connection.query(
      'select id from roles where role="student"',
      (error, results, fields) => {
        if (error) return response(res, 304, false);
        const roleId = results[0].id;
        connection.query(
          `delete from user where id=${id} and role=${roleId}`,
          (error, results, fields) => {
            if (error) return response(res, 304, false);
            else return response(res, 204, true);
          }
        );
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false);
  }
});

router.get("/leaderboard", (req, res) => {
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    connection.query(
      'select id from roles where role="student"',
      (error, results) => {
        if (error) throw error;
        else {
          const studentRoleId = results[0].id;
          connection.query(
            `select a.id as assessment_id, a.assessment_name, a.assessment_detail, a.score, u.id as user_id 
            from assessment a join user u where a.assignee_id=u.id and u.role=${studentRoleId} order by u.id`,
            (error, results) => {
              if (error) throw error;
              else {
                for (let i = 0; i < results.length; i++) {
                  if (results[i].score) {
                    results[i].score = JSON.parse(results[i].score);
                  }
                }
                return response(res, 200, true, results);
              }
            }
          );
        }
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false);
  }
});

module.exports = router;
