const express = require('express');
const router = express.Router();
const api = require('../../api/index.js');

// Authorization
router.post('/signup', (req, res, next) => {
  const newUser = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.signUp(newUser).then((data) => {
    res.redirect('/home')
  }).catch((err) => {
  })
})

router.post('/signin', (req, res, next) => {
  const userInfo = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.signIn(userInfo).then((user) => {
    req.session.user = user
    res.redirect(req.get('referer'))
  }).catch((err) => {
    if(err.response.status === 400){
      req.session.sessionFlash = {
        type: 'alert alert-danger',
        message: 'User cannot be found!'
      }
      res.redirect(req.get('referer'))
  
    }
  })
})

router.get('/logout', (req, res, next) => {
  delete req.session.user
  res.redirect('/home')
})
//PROFILE
router.get('/profile', (req, res, next) => {
  let categories = req.session.categories
  res.render('profile', {
    title: "Profile",
    categories: categories,
    url: req.url,
    user: req.session.user
  })
})
// CART

const cartRouter = require('./cart');
router.use('/cart', cartRouter)

// WISH LIST

const wishListRouter = require('./cart');
router.use('/wishlist', wishListRouter)


module.exports = router;
