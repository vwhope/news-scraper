var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var NoteSchema = new Schema({
  // Note Body
  body: {
      type: String,
      trim: true
  },

  // `article` is an object that stores an article id
  // The ref property links the ObjectId to the article model
  // This allows populating the Article with associated Notes
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }

});

// Create the model from above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
