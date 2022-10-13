const axios =  require('axios');

module.exports = {
    getCategoriesByParentId: async (parentId) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/categories/parent/${parentId}?secretKey=$2a$08$eaCV.trJKD4tzqmu.XOS/eTAq4CokqUjRRDGvl1Tuall8GFV.upJG`)
        return response.data 
    },
    getCategoriesById: async (id) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/categories/${id}?secretKey=$2a$08$eaCV.trJKD4tzqmu.XOS/eTAq4CokqUjRRDGvl1Tuall8GFV.upJG`)
        return response.data 
    },
    getProductsByCategoryId: async (id, page) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/products/product_search?secretKey=$2a$08$eaCV.trJKD4tzqmu.XOS/eTAq4CokqUjRRDGvl1Tuall8GFV.upJG&primary_category_id=${id}&page=${page}`)
        return response.data 
    },
    getProductById: async (id) => {
        const response = await axios.get(`https://backend-academy-osf.herokuapp.com/api/products/product_search?secretKey=$2a$08$eaCV.trJKD4tzqmu.XOS/eTAq4CokqUjRRDGvl1Tuall8GFV.upJG&_id=${id}`)
        return response.data 
    }
    
}