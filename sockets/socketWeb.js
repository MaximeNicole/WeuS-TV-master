/**
 *
 * @param appio
 */

var emitSlave = require('./socketSlave').emitSlave;
var weather = require('../lib/utils/weather');
var program = require('../lib/program');
var logger = require('winston');
logger.level = 'debug';

var sockets = function (appio) {

    appio.on('connection', function (socket) {
        socket.emit('ready');

        socket.on('client', function () {
            //console.log('CLient connected.');
        });

        socket.on('disconnect', function () {
            //emitSlave.check();
        });

        socket.on('check-client', function () {
            //console.log('Slave disconnected.');
        });


        /* Routes */
        socket.on('list-movies', function () {
            logger.log('info', 'list-movies');

            program.movie.getList(function (file) {
                logger.log('debug', file);
                program.movie.getInfo(file, function (infos) {
                    //console.log(infos);
                    socket.emit('client-list-movies-local', infos);
                });
            });

            //Todo: Lister les films disponible sur le serveur distant (program.js)
        });

        socket.on('details-movie', function (id) {
            program.movie.getInfo(id, function (infos) {
                socket.emit('details-movie', infos);
            });
        });

        socket.on('getGenres', function () {
            logger.log('debug', 'getGenres');
            program.movie.getGenre(function (data) {
                socket.emit('genres', data.genres);
            });
        });

        socket.on('bande-annonce', function (id) {

        });


        /* Program */
        socket.on('get-info-movie', function (req) {
            //Todo: Chercher toutes les informations à propos d'un film (program.js)
        });

        socket.on('get-bo', function (req) {
            //Todo: Aller chercher un lien de la bande annonce sur Youtube (program.js)n
        });


        /* Player interaction */
        socket.on('play', function (req) {
            emitSlave.play(req.timeStart, req.path, req.name);
        });

        socket.on('pause', function () {
            emitSlave.pause();
        });

        socket.on('resume', function () {
            emitSlave.pause();
        });

        socket.on('stop', function () {
            emitSlave.pause();
        });

        socket.on('status', function () {
            emitSlave.pause();
        });

        socket.on('upVolume', function () {
            emitSlave.pause();
        });

        socket.on('downVolume', function () {
            emitSlave.pause();
        });


        /* Weather */
        socket.on('weather', function (coords) {
            weather(coords, function (data) {
                socket.emit('weather-data', data);
            });
        })
    });
};

module.exports = sockets;