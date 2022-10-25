const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const api = require('../api/index.js')

/* GET users listing. */
router.post('/signup', (req, res, next) => {
  const newUser = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.signUp(newUser).then((data) => {
    res.redirect('/home')
  }).catch((err) => {
    console.log(err)
  })
})

router.post('/signin', (req, res, next) => {
  const userInfo = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.signIn(userInfo).then((user) => {
    req.session.user = user
    res.redirect('/home')
  }).catch((err) => {
    console.log(err)
    if(err.response.status === 400){
      req.session.sessionFlash = {
        type: 'alert alert-danger',
        message: 'User cannot be found!'
      }
      res.redirect('/home')
  
    }
  })
})

router.get('/logout', (req, res, next) => {
  delete req.session.user
  res.redirect('/home')
})

router.get('/cart', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const categories = req.session.categories

  api.getCart(jwt).then((cart) => {
    api.getCartItems(cart.items).then((products) =>{
      let productsWithDesiredAttributes = []
      for(product of products){
        for(item of cart.items){
          if(item.productId === product[0].id) {
            productsWithDesiredAttributes.push({
              name: product[0].page_title,
              page_title: product[0].page_title,
              short_description: product[0].short_description,
              image_groups: product[0].image_groups,
              id: item.productId,
              variant: item.variant,
              currency: product[0].currency
            })
          }
        }
      }
      res.render('cart', {
        title: "The Shopping Cart",
        categories: categories,
        cart: cart,
        products: productsWithDesiredAttributes,
        url: req.url
      })
    })
  })
})

router.post('/cart/addItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const product = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.addItemToCart(jwt, product).then((product) => {
    res.redirect('/home')
  })
})

router.delete('/cart/removeItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const product = {
    secretKey: process.env.API_KEY,
    productId: req.body.productId,
    variantId: req.body.variantId  
  }
  api.removeItemFromCart(jwt, product).then((product) => {
    res.redirect('/users/cart')
  }).catch((err) => {
    //console.log(err)
  })
})

module.exports = router;
