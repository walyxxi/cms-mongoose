const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../app');
const Data = require('../models/data');
const should = chai.should();

chai.use(chaiHTTP);

describe('datas', () => {
    beforeEach((done) => {
        let data = new Data({
            letter: 'A',
            frequency: 1.1
        })
        data.save((err) => {
            done();
        })
    })

    afterEach((done) => {
        Data.collection.drop();
        done();
    })

    it('Seharusnya mendapatkan semua data dengan metode GET', (done) => {
        chai.request(server)
        .get('/api/datas')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('letter');
            res.body[0].should.have.property('frequency');
            res.body[0].letter.should.equal('A');
            res.body[0].frequency.should.equal(1.1);
            done();
        })
    })

    it('Seharusnya menambahkan satu data dengan metode POST', (done) => {
        chai.request(server)
        .post('/api/datas')
        .send({
            'letter': 'B',
            'frequency': 1.2
        })
        .end((err, res) => {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.success.should.equal(true);
            res.body.message.should.equal('Data have been added!');
            res.body.data._id.should.be.a('string');
            res.body.data.letter.should.equal('B');
            res.body.data.frequency.should.equal(1.2);
            done();
        })
    })

    it('Seharusnya menemukan data berdasarkan letter dan frequency dengan metode POST', (done) => {
        chai.request(server)
        .post('/api/datas/search')
        .send({
            'letter': 'A',
            'frequency': 1.1
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('letter');
            res.body[0].should.have.property('frequency');
            res.body[0].letter.should.equal('A');
            res.body[0].frequency.should.equal(1.1);
            done();
        })
    })

    it('Seharusnya menemukan data berdasarkan id melalui path api/datas/<id> GET', (done) => {
        chai.request(server)
        .get('/api/datas')
        .end((err, response) => {
            chai.request(server)
            .get(`/api/datas/${response.body[0]._id}`)
            .end((err, res) => {
                res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.success.should.equal(true);
            res.body.message.should.equal('Data found!');
            res.body.data._id.should.be.a('string');
            res.body.data.letter.should.equal('A');
            res.body.data.frequency.should.equal(1.1);
            done();
            })
        })
    })

    it('Seharusnya meperbaharui data berdasarkan id melalui path api/datas/<id> PUT', (done) => {
        chai.request(server)
        .get('/api/datas')
        .end((err, response) => {
            chai.request(server)
            .put(`/api/datas/${response.body[0]._id}`)
            .send({
                'letter': 'B',
                'frequency': 1.2
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.success.should.equal(true);
                res.body.message.should.equal('Data have been updated!');
                res.body.data._id.should.be.a('string');
                res.body.data.letter.should.equal('A');
                res.body.data.frequency.should.equal(1.1);
                done();
            })
        })
    })

    it('Seharusnya menghapus data berdasarkan id melalui path api/datas/<id> DELETE', (done) => {
        chai.request(server)
        .get('/api/datas')
        .end((err, response) => {
            chai.request(server)
            .delete(`/api/datas/${response.body[0]._id}`)
            .end((err, res) => {
                res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.success.should.equal(true);
            res.body.message.should.equal('Data have been deleted!');
            res.body.data._id.should.be.a('string');
            res.body.data.letter.should.equal('A');
            res.body.data.frequency.should.equal(1.1);
            done();
            })
        })
    })
})