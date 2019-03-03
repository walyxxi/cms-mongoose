var express = require('express');
var router = express.Router();
const Data = require('../models/data');

router.get('/', (req, res) => {
    Data.find().then(data => {
        res.status(200).send(data);
    }).catch(err => {
        if (err) return res.status(500).send('There was problem getting Datas!');
    })
})

router.post('/', (req, res) => {
    let x = req.body;
    Data.create({
        letter: x.letter,
        frequency: x.frequency
    }).then(data => {
        res.status(201).send({
            success: true,
            message: 'Data have been added!',
            data: {
                _id: data._id,
                letter: data.letter,
                frequency: data.frequency
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem adding Data!');
    })
})

router.post('/search', (req, res) => {
    let x = req.body;
    let params = {};
    if (x.letter) {
        params.letter = x.letter;
    }
    if (x.frequency) {
        params.frequency = x.frequency;
    }
    Data.find(params).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        if (err) return res.status(500).send('There was problem searching Data!');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Data.findOne({_id: id}).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data found!',
            data: {
                _id: data._id,
                letter: data.letter,
                frequency: data.frequency
            }
        })
    }).catch(err => {
        res.status(500).send('There was problem finding Data!');
    })
})

router.put('/:id', (req, res) => {
    let x = req.body;
    let id = req.params.id;
    Data.findOneAndUpdate({_id: id}, { $set: {
            letter: x.letter,
            frequency: x.frequency
        }
    }, {new: true}).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data have been updated!',
            data: {
                _id: data._id,
                letter: data.letter,
                frequency: data.frequency
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem updating Data!');
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Data.findOneAndDelete({_id: id}).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data have been deleted!',
            data: {
                _id: data._id,
                letter: data.letter,
                frequency: data.frequency
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem updating Data!');
    })
})

module.exports = router;