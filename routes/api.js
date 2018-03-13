let express = require('express');
let router = express.Router();

const fs = require('fs');
const csv = require('fast-csv');

const config = require('config');
const requiredFields = config.get('eventsFile.requiredFields');
const tmpFileDestination = __dirname + config.get('eventsFile.tmpFileDestination');

const projectionConverter = require('../lib/projections');

//Get formatted events data from tmp file
router.get('/events', (req, res) => {
    let eventsData = [];

    csv.fromPath(tmpFileDestination, {headers: true})
        .on("data", function (data) {
            eventsData.push(data);
        })
        .on("end", function () {
            //Check validity of input data format
            eventsData.forEach((line, index, arr) => {
                requiredFields.forEach((field) => {
                    if (!line.hasOwnProperty(field) || line[field] === "") {
                        return res.status(400).render('upload.hbs', {
                            pageTitle: 'Upload CSV',
                            error: `Wrong data format on line ${index+2}. Each row must contain 'X Coordinate', 'Y Coordinate', 'Date1 of Occurrence' and 'TYPE' rows and proper headers`,
                        });
                    }
                });
            });

            //Get coordinates converted from SPCS to LatLng and add them to object
            eventsData.forEach((line, index, arr) => {
                let LatLong = projectionConverter.getLatLongFromStatePlane(line['State'] ,line['X Coordinate'], line['Y Coordinate']);
                arr[index]['Lat'] = LatLong[0];
                arr[index]['Lng'] = LatLong[1];
            });

            //Remove tmp file
            fs.unlink(tmpFileDestination);
            res.status(200).json(eventsData);
        });
});

module.exports = router;