var express = require('express');
var router = express.Router();
const Map = require('../models/map');

router.get('/', (req, res) => {
    Map.find().then(data => {
        res.status(200).send(data);
    }).catch(err => {
        if (err) return res.status(500).send('There was problem getting Datas!');
    })
})

router.post('/', (req, res) => {
    let x = req.body;
    Map.create({
        title: x.title,
        lat: x.lat,
        lng: x.lng
    }).then(data => {
        res.status(201).send({
            success: true,
            message: 'Data have been added!',
            data: {
                _id: data._id,
                title: data.title,
                lat: data.lat,
                lng: data.lng
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem adding Data!');
    })
})

router.post('/search', (req, res) => {
    let x = req.body;
    Map.find({ title: x.title }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        if (err) return res.status(500).send('There was problem searching Data!');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Map.findOne({ _id: id }).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data found!',
            data: {
                _id: data._id,
                title: data.title,
                lat: data.lat,
                lng: data.lng
            }
        })
    }).catch(err => {
        res.status(500).send('There was problem finding Data!');
    })
})

router.put('/:id', (req, res) => {
    let x = req.body;
    let id = req.params.id;
    Map.findOneAndUpdate({ _id: id }, {
        $set: {
            title: x.title,
            lat: x.lat,
            lng: x.lng
        }
    }, {new: true}).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data have been updated!',
            data: {
                _id: data._id,
                title: data.title,
                lat: data.lat,
                lng: data.lng
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem updating Data!');
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Map.findOneAndDelete({ _id: id }).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data have been deleted!',
            data: {
                _id: data._id,
                title: data.title,
                lat: data.lat,
                lng: data.lng
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem updating Data!');
    })
})

module.exports = router;