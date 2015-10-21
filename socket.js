var socketEmit = {};

var iosockets = function (iosockets) {

    socketEmit = iosockets;

    // Add a connect listener
    iosockets.on('connection', function (socket) {
        console.log('Slave connected.');

        // Disconnect listener
        socket.on('disconnect', function () {
            console.log('Slave disconnected.');
        });
    });
};

exports.iosocket = iosockets;


var emit = {
    play: function (timeStart, path, name) {
        socketEmit.emit('play', {timeStart: timeStart, path: path, name: name});
    }
};

exports.emit = emit;