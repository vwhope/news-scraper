var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
  // Article Title
  title: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  // Article Link
  link: {
    type: String,
    trim: true,
    required: true
  },
  // Article Image
  image: {
    type: String,
    trim: true,
  },
  // Article Publish Date
  date: {
    type: Number,
    trim: true,
  },
  // Article Summary
  summary: {
    type: String,
    trim: true,
    required: true
  },
  // Article Saved
  saved: {
    type: Boolean,
    default: false,
    required: true
  }
});

// Add index to allow "text" search for a word within article title
// If clear database, you have restart application to get "search" to work again
// If the index doesn't rebuild, the search option won't work
ArticleSchema.index( { title: "text"});

// Create the Article model from above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
