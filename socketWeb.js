/**
 *
 * @param appio
 */

var sockets = function (appio) {
    appio.route('ready', function (req) {
        req.io.emit('ready', {
            message: 'Client connected.'
        });
    });

    appio.route('list-movies', function (req) {

    });
};

module.exports = sockets;