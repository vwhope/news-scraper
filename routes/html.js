var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/about", function(req, res) {
    res.render("about");
  });

}; // end module.exports