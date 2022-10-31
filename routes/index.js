const express = require('express');
const router = express.Router();
const api = require('../api/index.js')
const stripe = require('stripe')(process.env.Secret_Key)

router.get('/', (req, res, next) => {
  res.redirect('/home')
})

router.get('/home', (req, res, next) => {
  api.getCategoriesByParentId("root").then((categories) => {
    req.session.categories = categories
    res.render('index', { title: 'OSF', categories: categories, url: req.url });
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
    req.session.selectedCategory = selectedCategory
    api.getCategoriesByParentId(req.params.id).then((subCategories) => {
      req.session.subCategories = subCategories
      res.render('mainCategoryById', { title: selectedCategory.page_title, subCategories: subCategories, categories: categories, selectedCategory: selectedCategory, url: req.url });
    }).catch(next)
  }).catch(next)
});

router.get('/category/:id/subcategory/:subCategoryId', (req, res, next) => {
  const subCategories = req.session.subCategories
  const categories = req.session.categories
  const selectedCategory = req.session.selectedCategory

  if(subCategories && categories && selectedCategory){ // If necessarry data is in cookies
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
        selectedCategory: selectedCategory,
        url: req.url
      });
  
    }).catch(next)   
  } else { // If necessarry data isn't in cookies. Here, API requests are sent to obtain necessarry data.
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
            selectedCategory: selectedCategory,
            url: req.url
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
  
  if(categories && selectedCategory && selectedSubCategory){ // If necessarry data is in cookies
    api.getCategoriesById(req.params.subSubCategoryId).then((selectedSubSubCategory) => {
      
      req.session.selectedSubSubCategory = selectedSubSubCategory
      const productPerPage = 25
      const page = req.params.page || 1
      api.getProductsByCategoryId(req.params.subSubCategoryId, req.params.page).then((products) => {
        if(products === undefined) {
          res.render('error', {
            title: 'OSF',
            categories: categories,
            selectedCategory: selectedCategory,
            url: req.url
          })
        }
        const productCount = products.length
        res.render('productsByCategoryId', {
          title: 'OSF',
          products: products,
          categories: categories,
          selectedCategory: selectedCategory,
          selectedSubCategory: selectedSubCategory,
          selectedSubSubCategory: selectedSubSubCategory,
          current: parseInt(page),
          pages: Math.ceil(productCount / productPerPage),
          url: req.url
        });
      }).catch(next)
    }).catch(next)
  } else { // If necessarry data isn't in cookies. Here, API requests are sent to obtain necessarry data.
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
            if(products === undefined) {
              res.render('error', {
                title: 'OSF',
                categories: categories,
                selectedCategory: selectedCategory,
                url: req.url
              })
            }
            const productCount = products.length
            res.render('productsByCategoryId', { 
              title: 'OSF',
              products: products,
              categories: categories,
              selectedCategory: selectedCategory,
              selectedSubCategory: selectedSubCategory,
              selectedSubSubCategory: selectedSubSubCategory,
              current: parseInt(page),
              pages: Math.ceil(productCount / productPerPage),
              url: req.url
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

  if(categories && selectedCategory && selectedSubCategory && selectedSubSubCategory){ // If necessarry data is in cookies
    api.getProductById(req.params.productId).then((selectedProduct) => {

      if(JSON.stringify(selectedProduct) !== JSON.stringify(req.session.selectedProduct)) delete req.session.selectedProductVariants

      req.session.selectedProduct = selectedProduct

      let productWithChosenAttributes = undefined
      if(selectedProduct[0].variants.length > 0){
          
        res.locals.selectedProductVariants = selectedProduct[0].variants[0].variation_values
        res.locals.selectedProductVariants = {
          ...res.locals.selectedProductVariants,
          ...req.session.selectedProductVariants
        }

        const filterAttributes = res.locals.selectedProductVariants

        productWithChosenAttributes = selectedProduct[0].variants.filter((obj) => {       
          if(JSON.stringify(filterAttributes) === JSON.stringify(obj.variation_values)) return obj
        })  
      }
      res.render('productById', {
        title: 'OSF',
        selectedProduct: selectedProduct,
        categories: categories,
        selectedCategory: selectedCategory,
        selectedSubSubCategory: selectedSubSubCategory,
        selectedSubCategory: selectedSubCategory,
        productWithChosenAttributes: productWithChosenAttributes,
        user: req.session.user,
        key: process.env.Publishable_Key,
        url: req.url
      });
    }).catch(next)
  } else { // If necessarry data isn't in cookies. Here, API requests are sent to obtain necessarry data.
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

            if(JSON.stringify(selectedProduct) !== JSON.stringify(req.session.selectedProduct)) delete req.session.selectedProductVariants

            let productWithChosenAttributes = undefined
            if(selectedProduct[0].variants.length > 0){
              res.locals.selectedProductVariants = selectedProduct[0].variants[0].variation_values
              res.locals.selectedProductVariants = {
                ...res.locals.selectedProductVariants,
                ...req.session.selectedProductVariants
              } 

              delete req.session.selectedProductVariants

              const filterAttributes = res.locals.selectedProductVariants
               
              productWithChosenAttributes = selectedProduct[0].variants.filter((obj) => {       
                if(JSON.stringify(filterAttributes) === JSON.stringify(obj.variation_values)) return obj
              })  
            }         
            res.render('productById', { 
              title: 'OSF',
              selectedProduct: selectedProduct,
              categories: categories,
              selectedCategory: selectedCategory,
              selectedSubSubCategory: selectedSubSubCategory,
              selectedSubCategory: selectedSubCategory,
              productWithChosenAttributes: productWithChosenAttributes,
              user: req.session.user,
              key: process.env.Publishable_Key,
              url: req.url
            });
          }).catch(next)
        }).catch(next)
      }).catch(next)  
    }).catch(next)
  }
});

router.post('/category/:id/subcategory/:subCategoryId/subsubcategory/:subSubCategoryId/product/:productId', (req, res, next) => {
  req.session.selectedProductVariants = {
    ...req.session.selectedProductVariants,
    ...req.body
  }

  res.redirect(`/category/${req.params.id}/subcategory/${req.params.subCategoryId}/subsubcategory/${req.params.subSubCategoryId}/product/${req.params.productId}`)
});

router.post('/payment', (req, res) =>{
  stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: req.body.stripeBillingName,
      address: {
          line1: req.body.stripeBillingAddressLine1,
          postal_code: req.body.stripeBillingAddressZip,
          city: req.body.stripeBillingAddressCity,
          state: req.body.stripeBillingAddressState,
          country: req.body.stripeBillingAddressCountry,
      }
  })
  .then((customer) => {
      return stripe.charges.create({
          amount: req.body.price,     
          description: req.body.description,
          currency: req.body.currency,
          customer: customer.id
      });
  })
  .then((charge) => {
    // If no error occurs
    if(req.get('referer') === 'http://localhost:3000/users/cart'){
      const jwt = "Bearer " + req.session.user.token
      api.getCart(jwt).then((cart) => {
        console.log(cart)
        api.cleanCart(jwt, cart).then(() => {
          res.redirect('/home') 
        })  
      }).catch((err) => {
        console.log(err)
      })
    } else {
      res.redirect(req.get('referer'))  
    }
    
  })
  .catch((err) => {
      res.send(err)       // If some error occurs
  });
})

module.exports = router;