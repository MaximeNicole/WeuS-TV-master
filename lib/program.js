var fileUtils = require('./utils/file-utils');
var moviedb = require('./movies/moviedb');
var logger = require('winston');
var _ = require('underscore');
var moviesMongo = db.get('movies');

/* Logger level */
logger.level = 'info';


var program = {
    files: {

        listLocal: function (callback) {
            _.forEach(config.media.extensions.movies, function (ext) {
                fileUtils.getLocalFiles(config.media.local.movies, ext, function (err, files) {
                    if (!err) {
                        _.forEach(files, function (file) {
                            callback(file);
                        });
                    }
                });
            });
        },

        listServer: function (type, callback) {

        }

    },

    movie: {

        getInfo: function (fileObject, callback) {
            if (typeof(fileObject) !== 'undefined' && typeof(fileObject.file) !== 'undefined') {
                moviesMongo.findOne({filePath: fileObject.href})
                    .on('success', function (doc) {
                        if (!doc) {
                            logger.log('info', 'Info not in database');
                            moviedb.searchMovie(fileObject, function (doc) {
                                callback(doc);
                            });
                        } else {
                            logger.log('info', 'Info in database');
                            callback(doc);
                        }
                    })
                    .on('error', function (err) {
                        logger.log('error', err);
                    });
            } else {
                if (typeof(fileObject) !== 'undefined' && typeof(fileObject.id) !== 'undefined') {
                    moviesMongo.findById(fileObject.id)
                        .on('success', function (doc) {
                            if (doc)
                                callback(doc);
                        });
                }
            }
        },

        getBandeAnnonce: function (id, callback) {
            if (!id) {
                callback(false);
            } else {
                moviedb.getVideo(id, callback);
            }

        },

        getList: function (callback) {
            program.files.listLocal(function (data) {
                callback(data);
            });
            //Todo: lister les fichiers sur serveur
        },

        getImdbID: function (id, callback) {
            moviesMongo.findById(id)
                .on('success', function (doc) {
                    if (!doc) {
                        logger.log('info', 'Not in database.');
                    } else {
                        callback(doc.imdbID);
                    }
                })
                .on('error', function (err) {
                    logger.log('error', err);
                });
        },

        getGenre: function (callback) {
            moviedb.genreList(function (list) {
                callback(list);
            });
        }
    }
};

module.exports = program;