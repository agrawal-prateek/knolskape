let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

require("dotenv").config();

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/assessment', require('./routes/assessment'));
app.use('/student', require('./routes/student'));

module.exports = app;
