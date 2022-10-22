const { expect } = require('chai');
const chai = require('chai')
const chaiHttp = require('chai-http')
const dotenv = require('dotenv');

dotenv.config();

chai.use(chaiHttp);

// API Tests
describe('API TEST WITHOUT LOCAL STORAGE', () => {
    describe('GET /home', () => {
        it('Gets main categories', (done) => {
            chai.request(`http://localhost:${process.env.PORT}`).get('/home').end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done();
            })
        });
    });
    
    describe('GET /category/:id', () => {
        it('Gets a particular category', (done) => {
            chai.request(`http://localhost:${process.env.PORT}`).get('/category/womens?').end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done();
            })
        });
    });
    
    describe('GET /category/:id/subcategory/:subCategoryId', () => {
        it('Gets subcategories of a particular subcategory of a particular main category', (done) => {
            chai.request(`http://localhost:${process.env.PORT}`).get('/category/womens/subcategory/womens-clothing?').end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done();
            })     
        });
    });
    
    describe('GET /category/:id/subcategory/:subCategoryId/subsubcategory/:subSubCategoryId/products/:page', () => {
        it('Gets products of a particular subcategory in a particular page number', (done) => {
            chai.request(`http://localhost:${process.env.PORT}`).get('/category/womens/subcategory/womens-clothing/subsubcategory/womens-outfits/products/1').end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done();
            })      
        });
    });
    
    describe('GET /category/:id/subcategory/:subCategoryId/subsubcategory/:subSubCategoryId/product/:productId', () => {
        it('Gets a product of a particular subcategory', (done) => {
            chai.request(`http://localhost:${process.env.PORT}`).get('/category/womens/subcategory/womens-clothing/subsubcategory/womens-outfits/product/5172d205ffdd81f3234d6028').end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done();
            })  
        });
    }); 
})