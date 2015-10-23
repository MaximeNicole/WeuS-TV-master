var moviedb = require('moviedb')('1d0a02550b7d3eb40e4e8c47a3d8ffc6'),
    movie_title_cleaner = require('../utils/title-clean'),
    path = require('path'),
    logger = require('winston');

exports.valid_filetypes = /(avi|mkv|mpeg|mov|mp4|m4v|wmv)$/gi;

exports.getInfoMovie = function (fileObject, callback) {
    var originalTitle = path.basename(fileObject.file);
    var movieInfo = movie_title_cleaner.cleanupTitle(originalTitle);
    var movieTitle = movieInfo.title.replace(this.valid_filetypes, '').trimRight();
    var searchOptions = {
        query: movieTitle,
        language: config.general.language,
        year: movieInfo.year
    };

    var metadata = {
        filePath: path.normalize(fileObject.href),
        title: movieTitle,
        posterURL: '/movies/css/img/nodata.jpg',
        backgroundURL: '/movies/css/img/backdrop.jpg',
        imdbID: 0,
        rating: 'Unknown',
        genre: 'Unknown',
        runtime: 'Unknown',
        overview: '',
        adult: false,
        hidden: 'false',
        year: movieInfo.year
    };

    moviedb.searchMovie(searchOptions, function (err, result) {
        if (err || (result && result.results.length < 1)) {
            console.log('Error retrieving data for ' + movieTitle, err);
            callback();
        } else {
            result = result.results[0];

            var posterURL = buildImageUrl('342', result.poster_path) || metadata.posterURL;
            var backgroundURL = buildImageUrl('1920', result.backdrop_path) || metadata.backgroundURL;

            metadata.title = result.title;
            metadata.posterURL = posterURL;
            metadata.backgroundURL = backgroundURL;
            metadata.imdbID = result.imdbID;
            metadata.rating = result.vote_average.toString();
            metadata.genre = result.genres && result.genres.length ? result.genres[0].name : metadata.genre;
            metadata.runtime = result.runtime || 'Unknown';
            metadata.overview = result.overview;
            metadata.adult = result.adult === 'true';
            metadata.year = result.release_date ? new Date(result.release_date).getFullYear() : metadata.year;

            //Todo: Ajouter le film à la base de données (Priorité: Important)
            var moviesMongo = db.get('movies');
            moviesMongo.insert({
                "title": metadata.title,
                "posterURL": metadata.posterURL,
                "backgroundURL": metadata.backgroundURL,
                "imdbID": metadata.imdbID,
                "rating": metadata.rating,
                "genre": metadata.genre,
                "runtime": metadata.runtime,
                "overview": metadata.overview,
                "adult": metadata.adult,
                "year": metadata.year,
                "filePath": metadata.filePath,
                "hidden": metadata.hidden
            }, function (err, doc) {
                if (err) {
                    logger.log('error', err);
                } else {
                    logger.log('info', "Movie added to the database");
                }
            });

            callback(metadata);
        }
    });
};

function buildImageUrl(width, path) {
    if (!path) return;
    return "http://image.tmdb.org/t/p/w" + width + path;
}