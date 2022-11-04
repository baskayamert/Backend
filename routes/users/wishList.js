const express = require('express');
const router = express.Router();
const api = require('../../api/index.js');

router.get('/', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const categories = req.session.categories

  api.getWishList(jwt).then((wishList) => {
    api.getItems(wishList.items).then((products) =>{
      let productsWithDesiredAttributes = []
      for(product of products){
        wishList.items.filter((item) => {
          if(product[0].id === item.productId){
            productsWithDesiredAttributes.push({
              name: product[0].page_title,
              page_title: product[0].page_title,
              short_description: product[0].short_description,
              image_groups: product[0].image_groups,
              id: item.productId,
              variant: item.variant,
              currency: product[0].currency,
              primary_category_id: product[0].primary_category_id,
              quantity: item.quantity
            })
          }
        })
      }
      res.render('wishList', {
        title: "The Wish List",
        categories: categories,
        wishList: wishList,
        products: productsWithDesiredAttributes,
        key: process.env.Publishable_Key,
        url: req.url + 'wishlist'
      })
    }).catch((err) => {
    })
  }).catch((err) => {
    if(err.response.status === 400){

      if(req.get('referer').includes("/users/wishlist")){
        res.redirect('/home')
      } else{
        req.session.sessionFlash = {
          type: 'alert alert-danger',
          message: 'The wish list does not exist!'
        }
        res.redirect(req.get('referer'))
      } 
    }
  })
})

router.post('/addItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const item = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.addItemToWishList(jwt, item).then((product) => {
    res.redirect(req.get('referer'))
  }).catch((err) => {
    if(err.response.data.error === 'You must inform a valid Variant ID for this Product'){
      req.session.sessionFlash = {
        type: 'alert alert-danger',
        message: 'Variant ID does not exist!'
      }
      
    }
    res.redirect(req.get('referer'))
  })
})

router.delete('/removeItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const item = {
    secretKey: process.env.API_KEY,
    productId: req.body.productId,
    variantId: req.body.variantId  
  }
  api.removeItemFromWishList(jwt, item).then((item) => {
    res.redirect('/users/wishlist')
  }).catch((err) => {
  })
})

router.post('/changeItemQuantity', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const item = {
    secretKey: process.env.API_KEY,
    productId: req.body.productId,
    variantId: req.body.variantId,
    quantity: req.body.quantity  
  }
  api.changeItemQuantityForWishList(jwt, item).then((data) => {
    res.redirect('/users/wishlist')
  }).catch((err) => {
  })
})

module.exports = router;