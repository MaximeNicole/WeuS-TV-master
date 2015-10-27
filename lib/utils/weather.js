// Todo: https://www.npmjs.com/package/forecast
var Forecast = require('forecast');

// Initialize
var forecast = new Forecast({
    service: 'forecast.io',
    key: config.api.forecast.apiKey,
    units: 'celcius', // Only the first letter is parsed
    cache: true,      // Cache API requests?
    ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
        minutes: 30,
        seconds: 0
    }
});

var weather = function (coords, cb) {
    // Retrieve weather information from coordinates
    forecast.get([coords.latitude, coords.longitude], function (err, weather) {
        if (err) return console.dir(err);
        console.dir(weather);
        cb(weather);
    });
};

module.exports = weather;