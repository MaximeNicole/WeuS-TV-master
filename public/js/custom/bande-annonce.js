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


    });
    $('.ui-page').css('background-color', 'rgba(0,0,0,0)');

})(jQuery);