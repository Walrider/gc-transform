let express = require('express');
let router = express.Router();

const config = require('config');
const tmpFileDestination = __dirname + config.get('eventsFile.tmpFileDestination');

//Render initial upload page
router.get('/', (req, res) => {
    res.status(200).render('upload.hbs', {
        pageTitle: 'Upload CSV',
        error: null,
    });
});

//Retrieve posted csv file
router.post('/', (req, res) => {
    //Validation
    if (!req.files || !req.files.eventsFile) {
        return res.status(400).render('upload.hbs', {
            pageTitle: 'Upload CSV',
            error: 'No files were uploaded',
        });
    }

    if (req.files.eventsFile.mimetype !== config.get('eventsFile.mimeType')) {
        return res.status(400).render('upload.hbs', {
            pageTitle: 'Upload CSV',
            error: 'Wrong file extension.',
        });
    }

    //Move file to tmp folder
    req.files.eventsFile.mv(tmpFileDestination, function (err) {
        if (err)
            return res.status(500).send(err);
    });

    //Render map with selectors
    res.status(200).render('map.hbs', {
        mapsConfig: config.get('googleMaps'),
        APIKey: config.util.getEnv('APIKey')
    });
});

module.exports = router;