importScripts("https://cdn.socket.io/4.6.0/socket.io.min.js");

if (location.hostname.contains('sheqintel.com')) {
    self.SERVER_HOST = "https://bun-server.cloud.sheqintel.com";
} else {
    // self.SERVER_HOST = "http://localhost:5000";
    self.SERVER_HOST = "https://bun-server.cloud.sheqintel.com";
// self.SERVER_HOST = "https://server.cloud.sheqintel.com";
}

self.socket = io(SERVER_HOST, {
    withCredentials: true,
    transports: ['websocket'], // Only allow WebSocket transport
    auth: (cb) => {
        const {session} = self;
        if (session.isLoggedIn) {
            const {currentUser} = session.auth;
            const {uid} = currentUser;
            console.log('currentUser', currentUser)
            currentUser.getIdToken(true).then(token => {
                cb({token, uid});
            });
        } else {
            cb({token: null, uid: null});
        }
    },
});

socket.on('connect', () => {
    console.log('Connected to server', socket.id);
    Events.emit('connection', "CONNECTED");

    const {session} = self;
    if (session.isLoggedIn) {
        const {currentUser} = session.auth;
        const {uid} = currentUser;
        console.log('auth currentUser', currentUser)
        currentUser.getIdToken(true).then(token => {
            return socket.emit('emit', {
                path: 'auth',
                data: {token, uid},
            });
        });
    }
});//

socket.on('disconnect', () => {
    console.log('Disconnected from server', socket.id);
    Events.emit('connection', "DISCONNECTED");
});

(() => {
    const emit = socket.emit;
    socket.emit = (...args) => {
        return new Promise((resolve, reject) => {
            emit.apply(socket, [...args, (res, err) => {
                if (err) {
                    console.error('emit err', err)
                    return reject(err);
                }

                console.log('emit res', res)
                if (res) {
                    resolve(res);
                } else {
                    resolve();
                }
            }]);
        });
    };
})();