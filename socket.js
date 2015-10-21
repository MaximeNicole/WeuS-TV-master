var socketEmit = {},
    socketStart = false;

var sockets = function (appio) {

    socketEmit = appio;

    // Add a connect listener
    appio.on('connection', function (socket) { // Todo: A tester
        console.log('Slave connected.');
        socketStart = true;

        // Disconnect listener
        socket.on('disconnect', function () {// Todo: A tester
            console.log('Slave disconnected.');
            socketStart = false;
        });
    });
};

exports.sockets = sockets;


var emit = {
    play: function (timeStart, path, name) {
        //if (socketStart) {
        socketEmit.broadcast('play', {timeStart: timeStart, path: path, name: name});
        return true;
        //}
        //return false;
    }
};

exports.emit = emit;