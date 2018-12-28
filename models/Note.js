var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var NoteSchema = new Schema({
  // Note Title
  title: {
      type: String,
      trim: true
  },
  // Note Body
  body: {
      type: String,
      trim: true
  }
});

// This creates the model from above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
