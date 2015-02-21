var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var CraftBeer = mongoose.model('CraftBeer');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/craftbeers', function(req, res, next) {
  CraftBeer.find(function(err, craftbeers){
    if(err){ return next(err); }

    res.json(craftbeers);
  });
});

router.post('/craftbeers', function(req, res, next) {
  var craftbeer = new CraftBeer(req.body);

  craftbeer.save(function(err, craftbeer){
    if(err){ return next(err); }

    res.json(craftbeer);
  });
});

router.param('craftbeer', function(req, res, next, id) {
  var query = CraftBeer.findById(id);

  query.exec(function (err, craftbeer){
    if (err) { return next(err); }
    if (!craftbeer) { return next(new Error('can\'t find craftbeer')); }

    req.craftbeer = craftbeer;
    return next();
  });
});

router.get('/craftbeers/:craftbeer', function(req, res, next) {
    res.json(req.craftbeer);
});

router.put('/craftbeers/:craftbeer', function(req, res, next) {
	var craftBeer = new CraftBeer(req.body);
	
	req.craftbeer.name = craftBeer.name;
	req.craftbeer.brewery = craftBeer.brewery;
	req.craftbeer.year = craftBeer.year;
	req.craftbeer.type = craftBeer.type;
	req.craftbeer.notes = craftBeer.notes;
	req.craftbeer.abv = craftBeer.abv;
	req.craftbeer.inventory = craftBeer.inventory;
	req.craftbeer.beeradvocate = craftBeer.beeradvocate;
	
	req.craftbeer.save(function(err, craftbeer) {
      if(err){ return next(err); }
	  
      res.json(craftbeer);
    });
})

router.delete('/craftbeers/:craftbeer', function(req, res, next) {
    req.craftbeer.remove();
});

router.get('/craftbeers/:craftbeer/comments', function(req, res, next) {
	req.craftbeer.populate('comments', function(err, craftbeer) {
    if (err) { return next(err); }

    res.json(craftbeer);
  });
});

router.post('/craftbeers/:craftbeer/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.craftbeer = req.craftbeer;

  comment.save(function(err, comment){
	if(err){ return next(err); }

    req.craftbeer.comments.push(comment);
    req.craftbeer.save(function(err, craftbeer) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

module.exports = router;