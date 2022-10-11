var express = require('express');
var router = express.Router();
const api = require('../api/index.js')

/* GET home page. */
router.get('/category', function(req, res, next) {
  api.getMainCategories().then((mainCategories) => {
    console.log(mainCategories)
    res.render('index', { title: 'OSF', mainCategories: mainCategories });
  })
});

router.get('/category/products', function(req, res, next) {
  res.render('products', { title: 'OSF' });
});

router.get('/productById', function(req, res, next) {
  res.render('productById', { title: 'OSF' });
});

module.exports = router;