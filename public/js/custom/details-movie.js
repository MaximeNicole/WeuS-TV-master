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
            io.emit('getGenres');
            console.log(data);

            var body = $('body');
            $(body).css('background-image', 'url(' + data.backgroundURL + ')');
            $(body).css('background-size', 'cover');

            var content = $('#content');
            $('h4', content).text(data.title.toUpperCase());
            $('#year', content).text(data.year);
            $('#overview', content).text(data.overview);
            $('#jaquette', content).attr('src', data.posterURL);

            // Rating
            var etoileHTML = '';
            var etoile = Math.round(data.rating / 2);
            for (var i = 0; i < etoile; i++) {
                etoileHTML += '<i class="small yellow-text material-icons mdi-toggle-star"></i>';
            }
            for (var j = etoile; j < 5; j++) {
                etoileHTML += '<i class="small yellow-text material-icons mdi-toggle-star-outline"></i>';
            }
            $('#rating', content).html(etoileHTML);

            // Adult
            if (data.adult) {
                $('#adult', content).html('<img class="right" src="/img/icons/18+.png" alt="18+" />');
            }

            // Genre
            var genreText = '';
            var genresTmp = data.genre;
            io.on('genres', function (genres) {
                $.each(genres, function (index, genre) {
                    if (genresTmp.indexOf(genre.id) !== -1) {
                        genreText += genre.name + ', ';
                    }
                });
                genreText = genreText.substr(0, genreText.length - 2);
                $('#genre', content).text(genreText);
            });

            // No BA
            if (window.location.hash == '#noba') {
                $('#ba').remove();
                Materialize.toast('Pas de bande annonce !', 5000);
            }


        });
    });
    $('.ui-page').css('background-color', 'rgba(0,0,0,0)');

})(jQuery);