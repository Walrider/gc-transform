const proj4 = require('proj4');
const config = require('config');

let getLatLongFromStatePlane = (state, x, y) => {
    //Define projection for given state
    proj4.defs("SPCS", config.get("projections." + state));

    //Set SPCS and LatLong projections
    const firstProjection = proj4("SPCS");
    const secondProjection = proj4(config.get("projections.latLong"));

    //Convert and reverse(lat and lng are somewhy inverted on output)
    let projection = proj4(firstProjection, secondProjection, [parseFloat(x), parseFloat(y)]);
    return projection.reverse();
};

module.exports.getLatLongFromStatePlane = getLatLongFromStatePlane;