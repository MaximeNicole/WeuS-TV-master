"use strict";

(function ($) {

    $(".button-collapse").sideNav();

    io = io.connect();

    // Emit ready event.
    io.emit('ready');
    io.emit('list-movies');
    console.time('ready');

    // Listen for the talk event.
    io.on('ready', function () {
        console.timeEnd('ready');
    });

    // List of movies
    io.on('client-list-movies-local', function (data) {
        if (data) {
            //console.log(data);
            $('#list-movies').append(
                '<div class="movie col s3" movie="' + data.imdbID + '" releaseDate="' + (typeof(data.releaseDate) !== 'undefined' ? data.releaseDate : data.year + '-99-99') + '">' +
                '<a href="/movie/' + data._id + '/details" filePath="' + data.filePath + '">' +
                '<div class="title"><h2>' + data.title + '</h2></div>' +
                '<div class="info"><span class="year">' + data.year + '</span></div>' +
                '<img src="' + data.posterURL + '" />' +
                '</a>' +
                '</div>'
            );
        }
    });

    // Sort
    $('.sort-releasedate').on('click', function () {
        var movies = $('.movie');
        $('#list-movies').html('');
        var sort = $(movies).sort(function (a, b) {
            if ($(a).attr('releaseDate') !== 'undefined' && $(b).attr('releaseDate') !== 'undefined') {
                if ($(a).attr('releaseDate') > $(b).attr('releaseDate')) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;

        });
        $.each(sort, function (key, value) {
            $('#list-movies').append($(value));
        });
    });

})(jQuery);