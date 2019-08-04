const express = require("express");

const validate = require("../utils/validateToken");
const connection = require("../config");
const response = require("../utils/response");
const { getScore } = require("../utils/score");

let router = express.Router();

router.post("/", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const assigner_id = tokenData.id;
    const assignee_id = req.body.assignee_id;
    const assessment_name = req.body.assessment_name;

    connection.query(
      `insert into assessment(assignee_id, assigner_id, assessment_name) values
            (${assignee_id}, ${assigner_id}, '${assessment_name}')`,
      (error, results, fields) => {
        if (error) return response(res, 400, false);
        else return response(res, 201, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false);
  }
});

router.patch("/:id", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);
  const assessment_id = req.params.id;
  // Validate Token and Role
  if (tokenData) {
    let query;

    if (tokenData.role === "teacher") {
      const assessment_name = req.body.assessment_name;
      query = `update assessment set 
            assigner_id=${tokenData.id}, 
            assignee_id=${req.body.assignee_id}, 
            assessment_name='${assessment_name}'
            where id=${assessment_id}`;
      connection.query(query, (error, results, fields) => {
        if (error) return response(res, 304, false);
        else return response(res, 204, true);
      });
    } else if (tokenData.role === "student") {
      connection.query(
        `select assessment_name from assessment where id=${assessment_id}`,
        (error, results, fields) => {
          const assessment_detail = req.body.assessment_detail;
          getScore(
            assessment_detail,
            results[0].assessment_name.split(" ")
          ).then(score => {
            query = `update assessment set assessment_detail='${assessment_detail}', 
            score='${score}' where id=${assessment_id}`;
            connection.query(query, (error, results, fields) => {
              if (error) return response(res, 304, false);
              else return response(res, 204, true);
            });
          });
        }
      );
    }
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
    connection.query(
      `delete from assessment where id=${id}`,
      (error, results, fields) => {
        if (error) return response(res, 304, false);
        else return response(res, 204, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false);
  }
});

module.exports = router;
