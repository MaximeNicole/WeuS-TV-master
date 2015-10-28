"use strict";

(function ($) {

    $(".button-collapse").sideNav();

    io = io.connect();

    // Emit ready event.
    io.emit('ready');
    io.emit('index');
    console.time('ready');

    io.on('ready', function () {
        console.timeEnd('ready');
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