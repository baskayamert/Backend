const axios =  require('axios');

module.exports = {
    getMainCategories: async () => {
        const response = await axios.get("https://backend-academy-osf.herokuapp.com/api/categories/parent/root?secretKey=$2a$08$eaCV.trJKD4tzqmu.XOS/eTAq4CokqUjRRDGvl1Tuall8GFV.upJG")
        return response.data 
    },
    getCategories: async () => {
        const response = await axios.get("https://backend-academy-osf.herokuapp.com/api/categories/?secretKey=$2a$08$eaCV.trJKD4tzqmu.XOS/eTAq4CokqUjRRDGvl1Tuall8GFV.upJG")
        return response.data 
    }
}