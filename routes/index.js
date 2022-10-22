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
    for (category of categories) {
      if (category.id === req.params.id) {
        selectedCategory = category
        break
      }
    }
    req.session.categories = categories
    req.session.selectedCategory = selectedCategory
    api.getCategoriesByParentId(req.params.id).then((subCategories) => {
      req.session.subCategories = subCategories
      res.render('mainCategoryById', { title: selectedCategory.page_title, subCategories: subCategories, categories: categories, selectedCategory: selectedCategory });
    }).catch(next)
  }).catch(next)
});

router.get('/category/:id/subcategory/:subCategoryId', (req, res, next) => {
  const subCategories = req.session.subCategories
  const categories = req.session.categories
  const selectedCategory = req.session.selectedCategory

  if(subCategories && categories && selectedCategory){ // If necessarry data is in local storage
    let selectedSubCategory;
    for (subCategory of subCategories) {
      if (subCategory.id === req.params.subCategoryId) {
        selectedSubCategory = subCategory
        break
      }
    }
    req.session.selectedSubCategory = selectedSubCategory
  
    api.getCategoriesByParentId(req.params.subCategoryId).then((subSubCategories) => {
      req.session.subSubCategories = subSubCategories
      res.render('subCategoryById', {
        title: selectedSubCategory.page_title,
        subSubCategories: subSubCategories,
        selectedSubCategory: selectedSubCategory,
        categories: categories,
        selectedCategory: selectedCategory
      });
  
    }).catch(next)   
  } else { // If necessarry data isn't in local storage. Here, API requests are sent to obtain necessarry data.
    api.getCategoriesByParentId("root").then((categories) => {
      let selectedCategory;
      for(category of categories ) {
        if(category.id === req.params.id){
          selectedCategory = category
          break
        }
      }
      req.session.category = categories
      req.session.selectedCategory = selectedCategory

      api.getCategoriesByParentId(req.params.subCategoryId).then((subSubCategories) => {
        req.session.subSubCategories = subSubCategories

        api.getCategoriesById(req.params.subCategoryId).then((selectedSubCategory) => {
          req.session.selectedSubCategory = selectedSubCategory

          res.render('subCategoryById', { 
            title: selectedSubCategory.page_title,
            subSubCategories: subSubCategories,
            selectedSubCategory: selectedSubCategory,
            categories: categories,
            selectedCategory: selectedCategory
          });
        }).catch(next)
      }).catch(next)
    }).catch(next)
  }
});

router.get('/category/:id/subcategory/:subCategoryId/subsubcategory/:subSubCategoryId/products/:page', (req, res, next) => {
  const categories = req.session.categories
  const selectedCategory = req.session.selectedCategory
  const selectedSubCategory = req.session.selectedSubCategory
  
  if(categories && selectedCategory && selectedSubCategory){ // If necessarry data is in local storage
    api.getCategoriesById(req.params.subSubCategoryId).then((selectedSubSubCategory) => {
      req.session.selectedSubSubCategory = selectedSubSubCategory
      const productPerPage = 25
      const page = req.params.page || 1
      api.getProductsByCategoryId(req.params.subSubCategoryId, req.params.page).then((products) => {
        const productCount = products.length
        res.render('productsByCategoryId', {
          title: 'OSF',
          products: products,
          categories: categories,
          selectedCategory: selectedCategory,
          selectedSubCategory: selectedSubCategory,
          selectedSubSubCategory: selectedSubSubCategory,
          current: parseInt(page),
          pages: Math.ceil(productCount / productPerPage)
        });
      }).catch(next)
    }).catch(next)
  } else { // If necessarry data isn't in local storage. Here, API requests are sent to obtain necessarry data.
    api.getCategoriesByParentId("root").then((categories) => {
      let selectedCategory;
      for(category of categories ) {
        if(category.id === req.params.id){
          selectedCategory = category
          break
        }
      }

      req.session.categories = categories
      req.session.selectedCategory = selectedCategory

      api.getCategoriesById(req.params.subCategoryId).then((selectedSubCategory) => {
        req.session.selectedSubCategory = selectedSubCategory

        api.getCategoriesById(req.params.subSubCategoryId).then((selectedSubSubCategory) => {
          req.session.selectedSubSubCategory = selectedSubSubCategory

          const productPerPage = 25
          const page = req.params.page || 1
          api.getProductsByCategoryId(req.params.subSubCategoryId, req.params.page).then((products) => {
            const productCount = products.length
            res.render('productsByCategoryId', { 
              title: 'OSF',
              products: products,
              categories: categories,
              selectedCategory: selectedCategory,
              selectedSubCategory: selectedSubCategory,
              selectedSubSubCategory: selectedSubSubCategory,
              current: parseInt(page),
              pages: Math.ceil(productCount / productPerPage)
            });
          }).catch(next)
        }).catch(next)
      }).catch(next)
    }).catch(next)
  }
});

router.get('/category/:id/subcategory/:subCategoryId/subsubcategory/:subSubCategoryId/product/:productId', (req, res, next) => {
  const categories = req.session.categories
  const selectedCategory = req.session.selectedCategory
  const selectedSubSubCategory = req.session.selectedSubSubCategory
  const selectedSubCategory = req.session.selectedSubCategory

  if(categories && selectedCategory && selectedSubCategory && selectedSubSubCategory){ // If necessarry data is in local storage
    api.getProductById(req.params.productId).then((selectedProduct) => {
      res.render('productById', {
        title: 'OSF',
        selectedProduct: selectedProduct,
        categories: categories,
        selectedCategory: selectedCategory,
        selectedSubSubCategory: selectedSubSubCategory,
        selectedSubCategory: selectedSubCategory
      });
    }).catch(next)
  } else { // If necessarry data isn't in local storage. Here, API requests are sent to obtain necessarry data.
    api.getCategoriesByParentId("root").then((categories) => {
      let selectedCategory;
      for(category of categories ) {
        if(category.id === req.params.id){
          selectedCategory = category
          break
        }
      }

      req.session.categories = categories
      req.session.selectedCategory = selectedCategory

      api.getCategoriesById(req.params.subCategoryId).then((selectedSubCategory) => {
        req.session.selectedSubCategory = selectedSubCategory

        api.getCategoriesById(req.params.subSubCategoryId).then((selectedSubSubCategory) => {

          req.session.selectedSubSubCategory = selectedSubSubCategory
          
          api.getProductById(req.params.productId).then((selectedProduct) => {
            res.render('productById', { 
              title: 'OSF',
              selectedProduct: selectedProduct,
              categories: categories,
              selectedCategory: selectedCategory,
              selectedSubSubCategory: selectedSubSubCategory,
              selectedSubCategory: selectedSubCategory
            });
          }).catch(next)
        }).catch(next)
      }).catch(next)  
    }).catch(next)
  }
});

module.exports = router;