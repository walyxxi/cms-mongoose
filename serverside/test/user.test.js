const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../helpers/config');
const User = require('../models/user');
const should = chai.should();

chai.use(chaiHTTP);

describe('users', () => {
    beforeEach((done) => {
        let hashedPassword = bcrypt.hashSync('5678', 8);
        let user = new User({
            email: 'kerjakeras@gmail.com',
            password: hashedPassword
        })
        user.save((err) => {
            done();
        })    
    })

    afterEach((done) => {
        User.collection.drop();
        done();
    })

    it('Seharusnya menyimpan data user dan menampilkan error, email dan token dengan metode POST', (done) => {
        chai.request(server)
        .post('/api/users/register')
        .send({ 
            'email': 'cmstdd@gmail.com',
            'password': '1234',
            'retypepassword': '1234'
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.should.have.property('data');
            res.body.should.have.property('token');
            res.body.data.should.be.a('object');
            res.body.error.should.equal(false);
            res.body.data.email.should.equal('cmstdd@gmail.com');
            res.body.token.should.be.a('string');
            done();
        })
    })

    it('Seharusnya memvalidasi data login dan menampilkan error, email dan token dengan metode POST', (done) => {
        chai.request(server)
        .post('/api/users/login')
        .send({
            'email': 'kerjakeras@gmail.com',
            'password': '5678'
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.should.have.property('data');
            res.body.should.have.property('token');
            res.body.data.should.be.a('object');
            res.body.error.should.equal(false);
            res.body.data.email.should.equal('kerjakeras@gmail.com');
            res.body.token.should.be.a('string');
            done();
        })
    })

    it('Seharusnya memvalidasi token akses dengan metode POST', (done) => {
        chai.request(server)
        .get('/api/users')
        .end((err, response) => {
            let token = jwt.sign({ email: response.body[0].email }, config.secret, {
                expiresIn: 86400 // 24 Hours
            })
            chai.request(server)
            .post('/api/users/check')
            .set('x-access-token', `${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('valid');
                res.body.valid.should.equal(true);
                done();
            })
        })
    })

    it('Seharusnya logout dan menghapus token akses dengan metode GET', (done) => {
        chai.request(server)
        .get('/api/users')
        .end((err, response) => {
            let token = jwt.sign({ email: response.body[0].email }, config.secret, {
                expiresIn: 86400 // 24 Hours
            })
            chai.request(server)
            .get('/api/users/destroy')
            .set('x-access-token', `${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('logout');
                res.body.logout.should.equal(true);
                done();
            })
        })    
    })
})