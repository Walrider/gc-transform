let proj4 = require('proj4');

proj4.defs("ESRI:102738","+proj=lcc +lat_1=32.13333333333333 +lat_2=33.96666666666667 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000.0000000001 +y_0=2000000 +datum=NAD83 +units=us-ft +no_defs");

let firstProjection = proj4("ESRI:102738");
let secondProjection = proj4("EPSG:4326");

let x = 2463017.564;
let y = 6959380.819;

let lngLatProjection = proj4(firstProjection, secondProjection, [x, y]);

console.log(lngLatProjection.reverse());