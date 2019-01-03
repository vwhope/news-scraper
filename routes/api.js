// Require all models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    // Scrape data from Medical News Today, load HTML into $, create record in the mongodb db
    app.get("/scrape", function(req, res) {

        // Make a request via axios for nutrition news of `medicalnewstoday.com`
        axios.get("https://www.medicalnewstoday.com/categories/nutrition-diet/1").then(function(response) {

            // Load the html body from axios into cheerio
            var $ = cheerio.load(response.data);

            async function getData(i, element) {
                var result = {};

                // Save title, link, image and date each link enclosed in the current element
                // the $ is a jquery selector wrapper that allows jquery operations on the raw DOM object
                result.title = $(element).children("a").attr("title");
                result.link = $(element).children("a").attr("href");
                result.image = $(element).children("a").children("img").attr("data-src");
                var date = $(element).children("a").children("span").children("span").text();

                result.date = Date.parse(date);

                // go to expanded article page to get summary text
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
        // Send a message to the client

        // } // end for loop

        Promise.all(threads).then(function (promises) {

            db.Article.find({}).sort({date: 'desc'})
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.render("index", { newsFeed : dbArticle });
                // $("#notesModal").modal();
                //  res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
            //res.send("Scrape completed")
        });
    });

    //
}); // end app.get

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({}).sort({date: 'desc'})
    .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", { newsFeed : dbArticle });
        //  res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
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

// Render 404 page for any unmatched routes
// app.get("*", function(req, res) {
//     res.render("404");
// });
};