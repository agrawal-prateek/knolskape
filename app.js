let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

const validate = require("./utils/validateToken");
const connection = require("./config");
const response = require("./response");

require("dotenv").config();

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post("/assessment", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const assigner_id = tokenData.id;
    const assignee_id = req.body.assignee_id;
    const assessment_name = req.body.assessment_name;
    const assessment_detail = req.body.assessment_detail;

    connection.query(
      `insert into assessment(assignee_id, assigner_id, assessment_name, assessment_detail) values
            (${assignee_id}, ${assigner_id}, '${assessment_name}', '${assessment_detail}')`,
      (error, results, fields) => {
        if (error)
          return response(res, 400, false, "Could not create assessment");
        else return response(res, 201, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false, "Invalid Token");
  }
});

app.patch("/assessment", (req, res) => {
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);

  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const assessment_id = req.body.assessment_id;
    const assigner_id = tokenData.id;
    const assignee_id = req.body.assignee_id;
    const assessment_name = req.body.assessment_name;
    const assessment_detail = req.body.assessment_detail;

    connection.query(
      `update assessment set 
            assigner_id=${assigner_id}, 
            assignee_id=${assignee_id}, 
            assessment_name='${assessment_name}', 
            assessment_detail='${assessment_detail}'
            where id=${assessment_id}`,
      (error, results, fields) => {
        if (error)
          return response(res, 304, false, "Could not update assessment");
        else return response(res, 204, true);
      }
    );
  } else {
    // Invalid Token
    return response(res, 401, false, "Invalid Token");
  }
});

app.delete("/assessment/:id", (req, res) =>{
  // Get Token From Request Header
  const tokenData = validate(req.headers.authorization);
  // Validate Token and Role
  if (tokenData && tokenData.role === "teacher") {
    const id = req.params.id;
    connection.query(
        `delete from assessment where id=${id}`,
        (error, results, fields) => {
          if (error)
            return response(res, 304, false, "Could not delete assessment");
          else return response(res, 204, true);
        }
    );
  } else {
    // Invalid Token
    return response(res, 401, false, "Invalid Token");
  }
});

module.exports = app;
