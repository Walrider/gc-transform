const express = require('express');
const fileUpload = require('express-fileupload');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

app.use(fileUpload());

//require routes files
let webRoutes = require('./routes/web');
let apiRoutes = require('./routes/api');

//register partials and helpers
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

//set view engine
app.set('views', (__dirname + '/views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

//set logging
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

//init routes
app.use('/api', apiRoutes);
app.use('/', webRoutes);

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});