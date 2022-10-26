const axios =  require('axios');

module.exports = {
    getCategoriesByParentId: async (parentId) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/categories/parent/${parentId}?secretKey=${process.env.API_KEY}`)
        return response.data 
    },
    getCategoriesById: async (id) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/categories/${id}?secretKey=${process.env.API_KEY}`)
        return response.data 
    },
    getProductsByCategoryId: async (id, page) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/products/product_search?secretKey=${process.env.API_KEY}&primary_category_id=${id}&page=${page}`)
        return response.data 
    },
    getProductById: async (id) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/products/product_search?secretKey=${process.env.API_KEY}&id=${id}`)
        return response.data 
    },
    getCartItems: async (cartItems) => {
        let products = []
        for(item of cartItems){
            const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/products/product_search?secretKey=${process.env.API_KEY}&id=${item.productId}`)
            products.push(response.data)
        }
        
        return products
    },
    signUp: async (newUser) => {
        const response = await axios.post(`https://backend-academy-osf.herokuapp.com/api/auth/signup`, newUser)
        return response.data
    },
    signIn: async (loggedInUser) => {
        const response = await axios.post(`https://backend-academy-osf.herokuapp.com/api/auth/signin`, loggedInUser)
        return response.data
    },
    getCart: async (jwt) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })
        const response = await axiosRequest.get(`https://backend-academy-osf.herokuapp.com/api/cart?secretKey=${process.env.API_KEY}`)
        return response.data
    },
    addItemToCart: async (jwt, product) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })

        const response = await axiosRequest.post(`https://backend-academy-osf.herokuapp.com/api/cart/addItem`, product)
        return response.data
    },
    removeItemFromCart: async (jwt, product) => {
        const url = 'https://backend-academy-osf.herokuapp.com/api/cart/removeItem'
        const config = {
          headers: { Authorization: jwt },
          url,
          method: 'DELETE',
          data: product
        }
        
        const response = await axios(config)    
        return response.data   
    }
    
}