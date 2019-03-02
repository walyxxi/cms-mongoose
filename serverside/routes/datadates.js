var express = require('express');
var router = express.Router();
const moment = require('moment');
const Datadate = require('../models/datadate');

router.get('/', (req, res) => {
    let data = [];
    Datadate.find().then(dataDate => {
        dataDate.forEach(item => {
            data.push({
                _id: item._id,
                letter: moment(item.letter).format("YYYY-MM-DD"),
                frequency: item.frequency
            })
        })
        res.status(200).send(data);
    }).catch(err => {
        if (err) return res.status(500).send('There was problem getting Datas!');
    })
})

router.post('/', (req, res) => {
    let x = req.body;
    Datadate.create({
        letter: x.letter,
        frequency: x.frequency
    }).then(data => {
        res.status(201).send({
            success: true,
            message: 'Data have been added!',
            data: {
                _id: data._id,
                letter: moment(data.letter).format('YYYY-MM-DD'),
                frequency: data.frequency
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem adding Data!');
    })
})

router.post('/search', (req, res) => {
    let x = req.body;
    let data = [];
    let params = {};
    if (x.letter) {
        params.letter = x.letter;
    }
    if (x.frequency) {
        params.frequency = x.frequency;
    }
    Datadate.find(params).then(dataDate => {
        dataDate.forEach(item => {
            data.push({
                _id: item._id,
                letter: moment(item.letter).format("YYYY-MM-DD"),
                frequency: item.frequency
            })
        })
        res.status(200).send(data);
    }).catch(err => {
        if (err) return res.status(500).send('There was problem searching Data!');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Datadate.findOne({ _id: id }).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data found!',
            data: {
                _id: data._id,
                letter: moment(data.letter).format('YYYY-MM-DD'),
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
    Datadate.findOneAndUpdate({ _id: id }, {
        $set: {
            letter: x.letter,
            frequency: x.frequency
        }
    }).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data have been updated!',
            data: {
                _id: data._id,
                letter: moment(data.letter).format('YYYY-MM-DD'),
                frequency: data.frequency
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem updating Data!');
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Datadate.findOneAndDelete({ _id: id }).then(data => {
        res.status(200).send({
            success: true,
            message: 'Data have been deleted!',
            data: {
                _id: data._id,
                letter: moment(data.letter).format('YYYY-MM-DD'),
                frequency: data.frequency
            }
        })
    }).catch(err => {
        if (err) return res.status(500).send('There was problem updating Data!');
    })
})

module.exports = router;