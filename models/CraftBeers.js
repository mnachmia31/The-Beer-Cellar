var mongoose = require('mongoose');

var CraftBeerSchema = new mongoose.Schema({
  name : String, 
  brewery : String, 
  type : String, 
  abv: String, 
  year : String, 
  notes : String, 
  beeradvocate : String, 
  inventory : String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('CraftBeer', CraftBeerSchema);
