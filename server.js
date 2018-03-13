const express = require('express');
const fileUpload = require('express-fileupload');
const hbs = require('hbs');
const fs = require('fs');
const config = require('config');

let app = express();

//Enable fileUpload for CSV import
app.use(fileUpload());

//require routes files
let webRoutes = require('./routes/web');
let apiRoutes = require('./routes/api');

//Register partials and helpers
hbs.registerPartials(__dirname + '/views/partials');

//Set view engine and static files
app.set('views', (__dirname + '/views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

//Set logging
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to write to log file');
        }
    });
    next();
});

//Init routes
app.use('/api', apiRoutes);
app.use('/', webRoutes);

//Fire up server
app.listen(config.get('server.port'), () => {
    console.log(`Server is up on port ${config.get('server.port')}`);
});