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
  }).catch(next)
})

router.post('/signin', (req, res, next) => {
  const newUser = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.signUp(newUser).then((user) => {
    req.session.user = user
    res.redirect('/home')
  }).catch((err) => {
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
  console.log(req.session)
  api.getCart(jwt).then((cart) => {
    //console.log(cart.items[0].variant)
    res.render('cart', {
      categories: categories
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
    console.log(product)
    res.redirect('/home')
  })
})

module.exports = router;
