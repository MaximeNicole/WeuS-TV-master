/**
 *
 * @param app
 */
var program = require('../lib/program');
var logger = require('winston');

var routes = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {});
    });

    app.get('/list-movies', function (req, res) {
        res.render('list-movies', {picturesMoviesPath: config.media.local.picturesMovies});
    });

    app.get('/search-movies', function (req, res) {
        res.render('search-movies', {});
    });

    app.get('/new-movies', function (req, res) {
        res.render('new-movies', {});
    });

    app.get('/movie/:id/details', function (req, res) {
        res.render('details-movie', {title: 'Détails film | ' + req.params.id, id: req.params.id});
    });

    app.get('/movie/:id/bande-annonce', function (req, res) {
        program.movie.getImdbID(req.params.id, function (imdbID) {
            program.movie.getBandeAnnonce(imdbID, function (infos) {
                if (infos) {
                    infos.id = req.params.id;
                    logger.log('debug', infos);
                    res.render('bande-annonce', infos);
                } else {
                    res.redirect('/movie/' + req.params.id + '/details#noba');
                }
            });
        });

    });

    app.get('/test', function (req, res) {
        var moviedb = require('../lib/movies/moviedb');
        moviedb.test();
        res.render('index', {});
    });

    /* Parameters */
    // route middleware to validate :name
    app.param('id', function (req, res, next, id) {
        // do validation on name here
        // blah blah validation
        // log something so we know its working
        console.log('doing id validations on ' + id);

        // once validation is done save the new item in the req
        req.id = id;
        // go to the next thing
        next();
    });

};

module.exports = routes;