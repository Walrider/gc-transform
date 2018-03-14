const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const config = require('config');
const requiredFields = config.get('eventsFile.requiredFields');
const tmpDir = path.dirname(require.main.filename) + config.get('eventsFile.tmpDir');
const tmpFileLocation = tmpDir + config.get('eventsFile.tmpFileName');

const projectionConverter = require('../lib/projections');

//Get formatted events data from tmp file
router.get('/events', (req, res) => {
    let eventsData = [];

    //check if file exists
    if (fs.existsSync(tmpFileLocation)) {
        //stream csv to array
        csv.fromPath(tmpFileLocation, {headers: true})
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
                                error: `Wrong data format on line ${index + 2}. Each row must contain 'X Coordinate', 'Y Coordinate', 'Date1 of Occurrence' and 'TYPE' rows and proper headers`,
                            });
                        }
                    });
                });

                //Get coordinates converted from SPCS to LatLng and add them to object
                eventsData.forEach((line, index, arr) => {
                    let LatLong = projectionConverter.getLatLongFromStatePlane(line['State'], line['X Coordinate'], line['Y Coordinate']);
                    arr[index]['Lat'] = LatLong[0];
                    arr[index]['Lng'] = LatLong[1];
                });

                //Remove tmp file
                fs.unlink(tmpFileLocation);
                res.status(200).json(eventsData);
            });
    }
});

module.exports = router;