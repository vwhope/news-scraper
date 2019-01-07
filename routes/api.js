// Require all models
var db = require("../models");
//  Require all scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
// Require Mongoose for schema and querying
var mongoose = require("mongoose");

module.exports = function(app) {
    // Scrape data from Medical News Today, load HTML into $, create record in the mongodb db
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
    $(".listing").children().each(function (i, e) {
        threads[i] = getData(i, e);
    });

    // Wait for all requests to complete
    Promise.all(threads).then(function (promises) {

        // Get all articles from the db server side
        db.Article.find(/*{ saved: { $eq: false } }*/).sort({date: 'desc'})
        .then(function(dbArticle) {
            // If article(s) found, send back to client side
            res.render("index", { newsFeed : dbArticle });
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
        // res.send("Scrape completed")
        // TODO: send message to client to let know scrape completed
        // OR that scrape is doing something
    });
  });
 }); // end app.get

    // GET ALL SAVED articles from db
    app.get("/saved", function(req, res) {
        db.Article.find( { saved: { $eq: true } } )
        .then(function(dbArticle) {
            // If articles successfully found, send back to client
            res.render("saved", { newsFeed : dbArticle });
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

    // However, in this case, I will not remove it from the db,
    // but instead:
    // 1. toggle the "saved" field from True to False so it no longer shows up in the SAVED list
    // 2. clear any notes data associated with that article ID

    // REMOVE database newsScraper
    app.get("/clear", function(req, res) {
        mongoose.connection.dropDatabase();
        res.send("Database dropped.");
    });


    // SAVE article - works for BOTH saving and unsaving
    app.post("/save", function(req, res) {

        db.Article.updateOne( { _id: req.body.id }, {$set: {"saved": req.body.saved }})
        .then(function(dbArticle) {
            // If able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });


    // SAVE/UPDATE Article's associated NOTE(s)
    // one article can have many notes
    app.post("/notes/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        var result = {};
        result.body = req.body.body;
        result.article = req.params.id;

        db.Note.create(result)
        .then(function(dbArticle) {
            // If able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // Delete a specific NOTE
    app.post("/deleteNote/:id", function(req, res) {

        db.Note.remove({ _id: req.params.id})
        .then(function() {
            res.json(true);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // GET specific Article by id, then populate with its note(s)
    app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, query the db for matching id
        db.Article.findOne({ _id: req.params.id })
        .then(function(dbArticle) {

            // If successfully find an Article with the given id, send it back to the client side

            db.Note.find({article: dbArticle._id})
            .then(function(notes) {

                var result = {};
                result.article = dbArticle;
                result.notes = notes;
                res.json(result);
            })
            .catch(function(err) {
                console.log(err);
                res.json(err);
            });
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            console.log(err);
            res.json(err);
        });
    });

    // Render Search Page
    app.get("/search/", function(req, res) {
        res.render("search");
      });

    // Using the user's search word, query db for articles whose title includes that word
    app.get("/search/:word", function(req, res) {

        let searchword = req.params.word
        // To create index for a text search it should look like this:
        // db.Article.createIndex( { title: "text"})
        // but not sure why - I have to do this from Mongo shell command line
        // db.articles.createIndex( { title: "text"})

        // get articles that have "searchword" in their title
        // need to pass in variable that has the user's searchword
        db.Article.find( { $text: { $search: searchword } } )

      .then(function(dbArticle) {
            // If search is successful, send back articles that match search to client
            res.render("partials/feed", { newsFeed : dbArticle });
      })
      .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
      });
    });

}; // end exports