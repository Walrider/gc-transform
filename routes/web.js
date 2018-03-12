let express = require('express');
let router = express.Router();

let fs = require('fs');
let csv = require('fast-csv');

const tmpFileDestination = __dirname + '/../tmp/events.csv';

router.get('/', (req, res) => {
    res.render('upload.hbs', {
        pageTitle: 'Upload CSV',
    });
});

router.post('/', (req, res) => {
    if (!req.files || !req.files.eventsFile) {
        return res.status(400).send('No files were uploaded.');
    }

    if (req.files.eventsFile.mimetype !== 'text/csv') {
        return res.status(400).send('Wrong file extension.');
    }

    let eventsFile = req.files.eventsFile;

    eventsFile.mv(tmpFileDestination, function (err) {
        if (err)
            return res.status(500).send(err);
    });

    let eventsData = [];

    csv
        .fromPath(tmpFileDestination, {headers: true})
        .on("data", function (data) {
            console.log(data);
            eventsData.push(data);
        })
        .on("end", function () {
            JSON.stringify(eventsData);
            fs.unlink(tmpFileDestination);
            res.send(eventsData);
        });

    // res.render('map.hbs', {data: req});
});

module.exports = router;