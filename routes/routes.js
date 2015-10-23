/**
 *
 * @param app
 */
var routes = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {});
    });

    app.get('/list-movies', function (req, res) {
        res.render('list-movies', {});
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

};

module.exports = routes;