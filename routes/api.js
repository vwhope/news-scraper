// Require all models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
    // Scrape data from Medical News Today, load HTML into $, create record in the mongodb db - WORKS
    app.get("/scrape", function(req, res) {

        // Using Axios, request nutrition news from `medicalnewstoday.com`
        axios.get("https://www.medicalnewstoday.com/categories/nutrition-diet/1").then(function(response) {

        // Load the html body from axios into cheerio
        var $ = cheerio.load(response.data);

        async function getData(i, element) {
            var result = {};

            // Build result object with: title, link, image link and date
            // the $ is a jquery selector wrapper that allows jquery operations on the raw DOM object
            result.title = $(element).children("a").attr("title");

            var count = await db.Article.estimatedDocumentCount({"title": {$eq: result.title}}).exec();
            if (count > 0) {
                return true;
            }

            result.link = $(element).children("a").attr("href");
            result.image = $(element).children("a").children("img").attr("data-src");
            var date = $(element).children("a").children("span").children("span").text();

            result.date = Date.parse(date);

            // MUST GO to expanded article page to get Summary text
            await axios.get("https://www.medicalnewstoday.com" + result.link).then(async function(response) {

            var $ = cheerio.load(response.data);
            result.summary = $(".article_body").children("[itemprop='articleBody']").children("header").text();

            // Create a new Article using "result" object
            await db.Article.create(result ,function(err, dbArticle) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(dbArticle);
                }
            });

        }); // end axios.get

    } // end getData function

    const threads = [];
    $(".listing").children().each(function (i, e) {threads[i] = getData(i, e);});

    // Wait for all requests to complete
    Promise.all(threads).then(function (promises) {

        // Get all articles from the db
        db.Article.find({}).sort({date: 'desc'})
        .then(function(dbArticle) {
            // If Articles found, send back to client
            res.render("index", { newsFeed : dbArticle });
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
        //res.send("Scrape completed") - need to send something to client to let know scrape completed
    });
  });
 }); // end app.get

    // GET ALL SAVED articles from db - WORKS
    app.get("/saved", function(req, res) {
        db.Article.find( { saved: { $eq: true } } )
        .then(function(dbArticle) {
            // If articles successfully found, send back to client
            res.render("saved", { savedNewsFeed : dbArticle });
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // FYI - BELOW is the format for updating the saved field to "true"
    // this will ONLY update one record/document in collection which is what I want in this case, BUT...
    // to update more than one doc in a collection follow below with " , {multi: true}) "
    // db.articles.update( { _id: ObjectId("5c2e53580b55ca0454c16646") }, {$set: {"saved": true }})

    // FYI - to remove an article pass the id that you want to remove
    // db.articles.remove({ _id: ObjectId"5c2e53580b55ca0454c16646"})

    // However, in this case, I may not want to remove it from the db,
    // but instead:
    // 1. toggle the "saved" field from True to False so it no longer shows up in the SAVED list
    // 2. clear any notes data associated with that article ID
    // OR I could delete it from the DB and any associated Note

    // REMOVE database newsScraper - WORKS
    app.get("/clear", function(req, res) {
        mongoose.connection.dropDatabase();
        res.send("Database dropped.");
    });


    // SAVE article - WORKS whether saving or unsaving
    app.post("/save", function(req, res) {
    // Create a new note and pass the req.body to the entry
        db.Article.updateOne( { _id: req.body.id }, {$set: {"saved": req.body.saved }})
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });


  // SAVE/UPDATE Article's associated Note - WORKS
  app.post("/notes/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var result = {};
    result.body = req.body.body;

    db.Note.create(result)
    .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});


// Route to get specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//     })
//     .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//     });
// });

// Render 404 page for any unmatched routes
// app.get("*", function(req, res) {
//     res.render("404");
// });
}; // end exports