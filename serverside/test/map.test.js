const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../app');
const Map = require('../models/map');
const should = chai.should();

chai.use(chaiHTTP);

describe('maps', () => {
    beforeEach((done) => {
        let map = new Map({
            title: 'Gedung Sate',
            lat: -6.4836573,
            lng: 106.8735859
        })
        map.save((err) => {
            done();
        })
    })

    afterEach((done) => {
        Map.collection.drop();
        done();
    })

    it('Seharusnya mendapatkan semua data dengan metode GET', (done) => {
        chai.request(server)
        .get('/api/maps')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('lat');
            res.body[0].should.have.property('lng');
            res.body[0]._id.should.be.a('string');
            res.body[0].title.should.equal('Gedung Sate');
            res.body[0].lat.should.equal(-6.4836573);
            res.body[0].lng.should.equal(106.8735859);
            done();
        })
    })

    it('Seharusnya menambahkan satu data dengan metode POST', (done) => {
        chai.request(server)
        .post('/api/maps')
        .send({
            'title': 'Trans Studio Hotel',
            'lat': -9.4836573,
            'lng': 105.6335859
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
            res.body.data.title.should.equal('Trans Studio Hotel');
            res.body.data.lat.should.equal(-9.4836573);
            res.body.data.lng.should.equal(105.6335859);
            done();
        })
    })

    it('Seharusnya menemukan data berdasarkan letter dan frequency dengan metode POST', (done) => {
        chai.request(server)
        .post('/api/maps/search')
        .send({
            'title': 'Gedung Sate',
            'lat': -6.4836573,
            'lng': 106.8735859
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('lat');
            res.body[0].should.have.property('lng');
            res.body[0]._id.should.be.a('string');
            res.body[0].title.should.equal('Gedung Sate');
            res.body[0].lat.should.equal(-6.4836573);
            res.body[0].lng.should.equal(106.8735859);
            done();
        })
    })

    it('Seharusnya menemukan data berdasarkan id melalui path api/maps/<id> GET', (done) => {
        chai.request(server)
        .get('/api/maps')
        .end((err, response) => {
            chai.request(server)
            .get(`/api/maps/${response.body[0]._id}`)
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
            res.body.data.title.should.equal('Gedung Sate');
            res.body.data.lat.should.equal(-6.4836573);
            res.body.data.lng.should.equal(106.8735859);
            done();
            })
        })
    })

    it('Seharusnya meperbaharui data berdasarkan id melalui path api/maps/<id> PUT', (done) => {
        chai.request(server)
        .get('/api/maps')
        .end((err, response) => {
            chai.request(server)
            .put(`/api/maps/${response.body[0]._id}`)
            .send({
                'title': 'Trans Studio Hotel',
                'lat': -9.4836573,
                'lng': 105.6335859
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
                res.body.data.title.should.equal('Trans Studio Hotel');
                res.body.data.lat.should.equal(-9.4836573);
                res.body.data.lng.should.equal(105.6335859);
                done();
            })
        })
    })

    it('Seharusnya menghapus data berdasarkan id melalui path api/maps/<id> DELETE', (done) => {
        chai.request(server)
        .get('/api/maps')
        .end((err, response) => {
            chai.request(server)
            .delete(`/api/maps/${response.body[0]._id}`)
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
            res.body.data.title.should.equal('Gedung Sate');
            res.body.data.lat.should.equal(-6.4836573);
            res.body.data.lng.should.equal(106.8735859);
            done();
            })
        })
    })
})