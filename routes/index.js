const express = require('express');
const router = express.Router();
const api = require('../api/index.js')

router.get('/home', (req, res, next) => {
  api.getCategoriesByParentId("root").then((categories) => {
    res.render('index', { title: 'OSF', categories: categories });
  }).catch(next)
});

router.get('/category/:id', (req, res, next) => {
  api.getCategoriesByParentId("root").then((categories) => {
    let selectedCategory;
    for( e of categories ) {
      if(e.id === req.params.id){
        selectedCategory = e
        break
      }
    }
    api.getCategoriesByParentId(req.params.id).then((subCategories) => {
      res.render('mainCategoryById', { title: selectedCategory.page_title, subCategories: subCategories, categories: categories, selectedCategory: selectedCategory });
    }).catch(next)
  }).catch(next)
});

router.get('/category/:id/subcategory/:subCategoryId', (req, res, next) => {
  api.getCategoriesByParentId("root").then((categories) => {
    let selectedCategory;
    for( e of categories ) {
      if(e.id === req.params.id){
        selectedCategory = e
        break
      }
    }
    api.getCategoriesByParentId(req.params.subCategoryId).then((subCategories) => {
      api.getCategoriesById(req.params.subCategoryId).then((selectedSubCategory) => {
        res.render('subCategoryById', { title: selectedSubCategory.page_title, subCategories: subCategories, categories: categories, selectedCategory: selectedCategory});
      }).catch(next)
    }).catch(next)
  }).catch(next)
});

router.get('/category/:id/subcategory/:subCategoryId/products/:page', (req, res, next) => {
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
      }).catch(next)
    }).catch(next)
  }).catch(next)
});

router.get('/category/:id/subcategory/:subCategoryId/product/:productId', (req, res, next) => {
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
      }).catch(next)
    }).catch(next)
    
  }).catch(next)
});

module.exports = router;