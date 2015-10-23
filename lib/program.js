var fileUtils = require('./utils/file-utils');
var moviedb = require('./movies/moviedb');
var logger = require('winston');
var _ = require('underscore');

/* Logger level */
logger.level = 'info';


var program = {
    files: {

        listLocal: function (callback) {
            _.forEach(config.media.extensions.movies, function (ext) {
                fileUtils.getLocalFiles(config.media.local.movies, ext, function (err, data) {
                    if (!err) {
                        callback(data);
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
                console.log(fileObject.file);

                //Todo: Chercher en base de données avant
                var moviesMongo = db.get('movies');
                moviesMongo.findOne({filePath: fileObject.href})
                    .on('success', function (doc) {
                        if (!doc) {
                            moviedb.getInfoMovie(fileObject, callback);
                        } else {
                            callback(doc);
                        }
                    });
            }
        },

        getBO: function () {

        },

        getList: function (callback) {
            program.files.listLocal(function (data) {
                callback(data[0]);
            });
            //Todo: lister les fichiers sur serveur
        }

    }
};

module.exports = program;