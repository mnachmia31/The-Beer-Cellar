var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  craftbeer: { type: mongoose.Schema.Types.ObjectId, ref: 'CraftBeer' }
});

mongoose.model('Comment', CommentSchema);