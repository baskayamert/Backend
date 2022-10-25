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
  console.log(jwt)
  api.getCart(jwt).then((cart) => {
    console.log(cart)
    res.redirect('/home')
  })
})

router.post('/cart/addItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const product = {
    ...req.body
  }
  api.addItemToCart(jwt, product).then((data) => {
    console.log(data)
    res.redirect('/home')
  })
})

module.exports = router;
