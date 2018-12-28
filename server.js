var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Setup Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
  );
  app.set("view engine", "handlebars");
  
  // Require routes
  require("./routes/api")(app);
  require("./routes/html")(app);
  
  // Connect to the Mongo DB
  mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });
  
  // implement when deploying on Heroku - after get all working locally
  //```js
  // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
  //var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
  //mongoose.connect(MONGODB_URI);
  //```
  //* This code should connect mongoose to your remote mongolab database if deployed, but otherwise will connect to the local mongoHeadlines database on your computer.
  //
  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
  module.exports = app;
  