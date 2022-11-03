const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const api = require('../api/index.js');

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
    res.redirect(req.get('referer'))
  }).catch((err) => {
    console.log(err)
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

router.get('/wishlist', (req, res, next) => {
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
        url: req.url
      })
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    if(err.response.status === 400){

      if(req.get('referer') === "http://localhost:3000/users/wishlist"){
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

router.post('/wishlist/addItem', (req, res, next) => {
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
    console.log(err)
    res.redirect(req.get('referer'))
  })
})

router.delete('/wishlist/removeItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const item = {
    secretKey: process.env.API_KEY,
    productId: req.body.productId,
    variantId: req.body.variantId  
  }
  api.removeItemFromWishList(jwt, item).then((item) => {
    res.redirect('/users/wishlist')
  }).catch((err) => {
    console.log(err)
  })
})

router.get('/cart', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const categories = req.session.categories

  api.getCart(jwt).then((cart) => {
    api.getItems(cart.items).then((products) =>{
      let productsWithDesiredAttributes = []
      for(product of products){
        cart.items.filter((item) => {
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
      let totalCost = 0
      for(product of productsWithDesiredAttributes){
        totalCost += product.variant.price * product.quantity
      }
      res.render('cart', {
        title: "The Shopping Cart",
        categories: categories,
        cart: cart,
        products: productsWithDesiredAttributes,
        totalCost: totalCost,
        key: process.env.Publishable_Key,
        url: req.url
      })
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    if(err.response.status === 400){

      if(req.get('referer') === "http://localhost:3000/users/cart"){
        res.redirect('/home')
      } else{
        req.session.sessionFlash = {
          type: 'alert alert-danger',
          message: 'The cart does not exist!'
        }
        res.redirect(req.get('referer'))
      } 
    }
  })
})

router.post('/cart/addItem', (req, res, next) => {
  const jwt = "Bearer " + req.session.user.token
  const product = {
    secretKey: process.env.API_KEY,
    ...req.body
  }
  api.addItemToCart(jwt, product).then((product) => {
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
    console.log(err)
  })
})

router.get('/cart/product/:productId', (req, res, next) => {
  const categories = req.session.categories
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

        const filterAttributes = req.session.selectedProductVariants
  
        productWithChosenAttributes = selectedProduct[0].variants.filter((obj) => {       
          if(JSON.stringify(filterAttributes) === JSON.stringify(obj.variation_values)) return obj
        })  
      }
    res.render('productInCart', {
      title: selectedProduct[0].page_title,
      selectedProduct: selectedProduct,
      productWithChosenAttributes: productWithChosenAttributes,
      categories: categories,
      url: req.url
    })
  }).catch((err) => {
    console.log(err)
  })
})
router.post('/cart/product/:productId', (req, res, next) => {
  req.session.selectedProductVariants = {
    ...req.session.selectedProductVariants,
    ...req.body
  }
  res.redirect(`/users/cart/product/${req.params.productId}`)
});

router.get('/profile', (req, res, next) => {
  let categories = req.session.categories
  res.render('profile', {
    title: "Profile",
    categories: categories,
    url: req.url,
    user: req.session.user
  })
})

module.exports = router;
