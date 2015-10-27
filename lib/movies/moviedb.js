var moviedb = require('moviedb')(config.api.moviedb.apiKey),
    movie_title_cleaner = require('../utils/title-clean'),
    fileUtils = require('../utils/file-utils'),
    path = require('path'),
    logger = require('winston');

exports.valid_filetypes = /(avi|mkv|mpeg|mov|mp4|m4v|wmv)$/gi;

exports.searchMovie = function (fileObject, callback) {
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
            logger.log('info', 'No data for ' + movieTitle);
            callback(metadata);
        } else {
            result = result.results[0];

            var posterURL = buildImageUrl('342', result.poster_path) || metadata.posterURL;
            var backgroundURL = buildImageUrl('1920', result.backdrop_path) || metadata.backgroundURL;

            //todo: télécharger les images et les utilisés
            /*var output = config.media.local.picturesMovies;
             fileUtils.downloadFile(posterURL, output + result.poster_path, {}, function (result) {
             logger.log('info', result);
             });
             fileUtils.downloadFile(backgroundURL, output + result.backdrop_path, {}, function (result) {
             logger.log('info', result);
             });*/


            metadata.title = result.title;
            metadata.posterURL = posterURL;
            metadata.backgroundURL = backgroundURL;
            metadata.imdbID = result.id;
            metadata.rating = result.vote_average.toString();
            metadata.genre = result.genre_ids;
            metadata.runtime = result.runtime || 'Unknown';
            metadata.overview = result.overview;
            metadata.adult = result.adult === 'true';
            metadata.year = result.release_date ? new Date(result.release_date).getFullYear() : metadata.year;
            metadata.release_date = result.release_date;

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
                "releaseDate": metadata.release_date,
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

exports.getVideo = function (movieID, callback) {
    var options = {
        language: config.general.language,
        id: movieID
    };

    moviedb.movieVideos(options, function (err, result) {
        if (err || (result && result.results.length < 1)) {
            logger.log('info', 'No data for ' + movieTitle);
            callback(false);
        } else {

        }
    })
};

exports.getVideo = function (id, callback) {
    var searchOptions = {
        id: id,
        language: config.general.language
    };
    moviedb.movieVideos(searchOptions, function (err, result) {
        if (err || (result && result.results.length < 1)) {
            logger.log('info', 'No video for ' + id);
            callback(false);
        } else {
            result = result.results[0];
            callback(result);
        }
    });
};