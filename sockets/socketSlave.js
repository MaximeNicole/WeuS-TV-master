var socketEmit = false;

var sockets = function (appio) {

    // Add a connect listener
    appio.on('connection', function (socket) {
        // Disconnect listener
        socket.on('disconnect', function () {
            //console.log('Launch check');
            //socket.emit('check');
            // Todo: Use led with GPIO (https://github.com/EnotionZ/GpiO)
            emitSlave.check();
        });

        socket.on('slave', function () {
            //console.log('Slave connected.');
            socketEmit = socket;
        });

        socket.on('check-slave', function () {
            //console.log('Client disconnected.');
        });
    });
};

exports.sockets = sockets;


var emitSlave = {
    play: function (timeStart, path, name) {
        if (socketEmit)
            socketEmit.emit('play', {timeStart: timeStart, path: path, name: name});
    },

    pause: function () {
        socketEmit.emit('pause', {});
    },

    resume: function () {
        socketEmit.emit('resume', {});
    },

    stop: function () {
        socketEmit.emit('stop', {});
    },

    status: function () {
        socketEmit.emit('status', {});
    },

    upVolume: function () {
        socketEmit.emit('upVolume', {});
    },

    downVolume: function () {
        socketEmit.emit('downVolume', {});
    },

    check: function () {
        if (socketEmit) {
            socketEmit.emit('check');
        } else {
            console.error('Slave disconnected');
            socketEmit = false;
        }
    }
};

exports.emitSlave = emitSlave;