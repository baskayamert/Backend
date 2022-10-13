var express = require('express');
var router = express.Router();
const api = require('../api/index.js')

router.get('/home', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    res.render('index', { title: 'OSF', categories: categories });
  })
});

router.get('/category/:id', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    let selectedCategory;
    for( e of categories ) {
      if(e.id === req.params.id){
        selectedCategory = e
        break
      }
    }
    api.getCategoriesByParentId(req.params.id).then((subCategories) => {
      res.render('mainCategoryById', { title: 'OSF', subCategories: subCategories, categories: categories, selectedCategory: selectedCategory });
    })
  })
});

router.get('/category/subcategory/:id', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    
    api.getCategoriesByParentId(req.params.id).then((subCategories) => {
      res.render('subCategoryById', { title: 'OSF', subCategories: subCategories, categories: categories});
    })
  })
});

router.get('/category/subcategory/:id/products/:page', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    const productPerPage = 25
    const page = req.params.page || 1
    api.getProductsByCategoryId(req.params.id, req.params.page).then((products) => {
      const productCount = products.length
      res.render('productsByCategoryId', { 
        title: 'OSF', 
        products: products, 
        categories: categories,
        current: parseInt(page),
        currentCategoryId: req.params.id,
        pages: Math.ceil(productCount/productPerPage)
      });
    })
  })
});

router.get('/product/:id', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    api.getProductById(req.params.id).then((product) => {
      console.log(product[0].name)
      res.render('productById', { title: 'OSF', product: product, categories: categories});
    })
  })
});

module.exports = router;