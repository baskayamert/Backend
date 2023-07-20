const axios =  require('axios');

module.exports = {
    getCategoriesByParentId: async (parentId) => {
        const response = await axios.get(`${process.env.API_URL}/categories/parent/${parentId}?secretKey=${process.env.API_KEY}`)
        return response.data 
    },
    getCategoriesById: async (id) => {
        const response = await axios.get(`${process.env.API_URL}/categories/${id}?secretKey=${process.env.API_KEY}`)
        return response.data 
    },
    getProductsByCategoryId: async (id, page) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/products/product_search?secretKey=${process.env.API_KEY}&primary_category_id=${id}&page=${page}`)
            return response.data 
        }catch(err){
            return undefined
        }
        
    },
    getProductById: async (id) => {
        const response = await axios.get(`${process.env.API_URL}/products/product_search?secretKey=${process.env.API_KEY}&id=${id}`)
        return response.data 
    },
    getItems: async (items) => {
        let products = []
        for(item of items){
            let doesProductExist = false
            for(product of products){
                if(product[0].id === item.productId){
                    doesProductExist = true
                    break;
                }
            }
            if(!doesProductExist){
                const response = await axios.get(`${process.env.API_URL}/products/product_search?secretKey=${process.env.API_KEY}&id=${item.productId}`)
                products.push(response.data)
            }
            
        }
        return products
    },
    signUp: async (newUser) => {
        const response = await axios.post(`${process.env.API_URL}/auth/signup`, newUser)
        return response.data
    },
    signIn: async (loggedInUser) => {
        const response = await axios.post(`${process.env.API_URL}/auth/signin`, loggedInUser)
        return response.data
    },
    getCart: async (jwt) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })
        const response = await axiosRequest.get(`${process.env.API_URL}/cart?secretKey=${process.env.API_KEY}`)
        return response.data
    },
    addItemToCart: async (jwt, product) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })

        const response = await axiosRequest.post(`${process.env.API_URL}/cart/addItem`, product)
        return response.data
    },
    removeItemFromCart: async (jwt, product) => {
        const url = '${process.env.API_URL}/cart/removeItem'
        const config = {
          headers: { Authorization: jwt },
          url,
          method: 'DELETE',
          data: product
        }
        
        const response = await axios(config)    
        return response.data   
    },
    cleanCart: async (jwt, cart) => {
        const url = '${process.env.API_URL}/cart/removeItem'
        for(item of cart.items){ 
            const product = {
                secretKey: process.env.API_KEY,
                productId: item.productId,
                variantId: item.variant.product_id
            }
            const config = {
                headers: { Authorization: jwt },
                url,
                method: 'DELETE',
                data: product
            }
            await axios(config)
        }
    },
    getAllProducts: async () => {
        let page = 1
        let totalProducts = []
        while(true){
            try{
                const response = await axios.get(`${process.env.API_URL}/products/product_search?secretKey=${process.env.API_KEY}&page=${page}`)
                totalProducts.push(...response.data)
                page++
            }catch(err){
                if(err.response.status === 400){ // All products were pulled from the API and when I cannot get more products it sends status 400
                    break
                }
            }    
        }
        return totalProducts   
    },
    getWishList: async (jwt) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })
        const response = await axiosRequest.get(`${process.env.API_URL}/wishlist?secretKey=${process.env.API_KEY}`)

        return response.data
    },
    addItemToWishList: async (jwt, item) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })
        const response = await axiosRequest.post(`${process.env.API_URL}/wishlist/addItem`, item)
        return response.data
    },
    removeItemFromWishList: async (jwt, item) => {
        const url = '${process.env.API_URL}/wishlist/removeItem'
        const config = {
          headers: { Authorization: jwt },
          url,
          method: 'DELETE',
          data: item
        }
        
        const response = await axios(config)    
        return response.data   
    },
    changeItemQuantityForCart: async (jwt, item) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })
        const response = await axiosRequest.post(`${process.env.API_URL}/cart/changeItemQuantity`, item)
        return response.data
    },
    changeItemQuantityForWishList: async (jwt, item) => {
        let axiosRequest = axios.create({
            headers: {
                Authorization: jwt
            }
        })
        const response = await axiosRequest.post(`${process.env.API_URL}/wishlist/changeItemQuantity`, item)
        return response.data
    }
}
