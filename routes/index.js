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

router.get('/category/:id/subcategory/:subCategoryId', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    let selectedCategory;
    for( e of categories ) {
      if(e.id === req.params.id){
        selectedCategory = e
        break
      }
    }
    
    api.getCategoriesByParentId(req.params.subCategoryId).then((subCategories) => {
      res.render('subCategoryById', { title: 'OSF', subCategories: subCategories, categories: categories, selectedCategory: selectedCategory});
    })
  })
});

router.get('/category/:id/subcategory/:subCategoryId/products/:page', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    let selectedCategory;
    for( e of categories ) {
      if(e.id === req.params.id){
        selectedCategory = e
        break
      }
    }
    api.getCategoriesById(req.params.subCategoryId).then((selectedSubCategory) => {
      const productPerPage = 25
      const page = req.params.page || 1
      api.getProductsByCategoryId(req.params.subCategoryId, req.params.page).then((products) => {
        const productCount = products.length
        res.render('productsByCategoryId', { 
          title: 'OSF', 
          products: products, 
          categories: categories,
          selectedCategory: selectedCategory,
          selectedSubCategory: selectedSubCategory, 
          current: parseInt(page),
          currentCategoryId: req.params.subCategoryId,
          pages: Math.ceil(productCount/productPerPage)
        });
      })
    })
    
  })
});

router.get('/category/:id/subcategory/:subCategoryId/product/:productId', function(req, res, next) {
  api.getCategoriesByParentId("root").then((categories) => {
    let selectedCategory;
    for( e of categories ) {
      if(e.id === req.params.id){
        selectedCategory = e
        break
      }
    }
    api.getCategoriesById(req.params.subCategoryId).then((selectedSubCategory) => {
      api.getProductById(req.params.productId).then((selectedProduct) => {
        res.render('productById', { 
          title: 'OSF', 
          selectedProduct: selectedProduct, 
          categories: categories, 
          selectedCategory: selectedCategory,
          selectedSubCategory: selectedSubCategory
        });
      })
    })
    
  })
});

module.exports = router;