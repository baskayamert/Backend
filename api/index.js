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
    signUp: async (newUser) => {
        const response = await axios.post(`https://backend-academy-osf.herokuapp.com/api/auth/signup`, newUser)
        return response.data
    },
    signUp: async (loggedInUser) => {
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
    }
    
}