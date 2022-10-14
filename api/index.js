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
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/products/product_search?secretKey=${process.env.API_KEY}&_id=${id}`)
        return response.data 
    }
    
}