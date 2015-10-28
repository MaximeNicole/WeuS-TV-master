"use strict";

(function ($) {

    $(".button-collapse").sideNav();

    var socket = io.connect('http://localhost:3000');
    socket.on('ready', function () {
        // Envoi au Master son identification
        socket.emit('client');

        // Test
        socket.emit('play', {timeStart: 0, path: 'test', name: 'test.avi'});
    });

// Check
    socket.on('check', function () {
        console.log('Check');
        socket.emit('check-client');
    });

    /* Localisation */
    var errorLocalisation = document.getElementById("error-localisation");

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                socket.emit('position', position.coords)
            }, showError);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    }

})(jQuery);