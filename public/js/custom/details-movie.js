"use strict";

(function ($) {

    $(".button-collapse").sideNav();

    io = io.connect();
    var $ = jQuery;

    // Emit ready event.
    io.emit('ready');
    console.time('ready');
    io.emit('details-movie', {id: $('body').attr('id')});

    // Listen for the talk event.
    io.on('ready', function (data) {
        console.timeEnd('ready');

        io.on('details-movie', function (data) {
            console.log(data);
            var body = $('body');
            $(body).css('background-image', 'url(' + data.backgroundURL + ')');
            $(body).css('background-size', 'cover');

            var content = $('#content');
            $('h4', content).text(data.title);
            $('#year', content).text(data.year);
            $('#rating', content).text(data.rating);
            $('#genre', content).text(data.genre);
            $('#adult', content).text(data.adult);
            $('#overview', content).text(data.overview);
            $('#jaquette', content).attr('src', data.posterURL);

        });
    });
    $('.ui-page').css('background-color', 'rgba(0,0,0,0)');

})(jQuery);