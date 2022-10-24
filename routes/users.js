const express = require('express');
const router = express.Router();
const api = require('../api/index.js')

/* GET users listing. */
router.post('/signup', (req, res, next) => {
  const newUser = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.signUp(newUser).then((user) => {
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

module.exports = router;
