const { expect } = require('chai');
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp);

// API tests

describe('GET /home', () => {
    it('Gets main categories', (done) => {
        chai.request('http://localhost:3000').get('/home').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            done();
        })
    });
});

 describe('GET /category/:id', () => {
    it('Gets a particular category', (done) => {
        chai.request('http://localhost:3000').get('/category/womens?').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            done();
        })
    });
});

describe('GET /category/:id/subcategory/:subCategoryId', () => {
    it('Gets subcategories of a particular subcategory of a particular main category', (done) => {
        chai.request('http://localhost:3000').get('/category/womens/subcategory/womens-clothing?').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            done();
        })     
    });
});

describe('GET /category/:id/subcategory/:subCategoryId/products/:page', () => {
    it('Gets products of a particular subcategory in a particular page number', (done) => {
        chai.request('http://localhost:3000').get('/category/womens/subcategory/womens-outfits/products/1').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            done();
        })      
    });
});

describe('GET /category/:id/subcategory/:subCategoryId/product/:productId', () => {
    it('Gets a product of a particular subcategory', (done) => {
        chai.request('http://localhost:3000').get('/category/womens/subcategory/womens-outfits/products/5172d205ffdd81f3234d6028?').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            done();
        })  
    });
}); 

