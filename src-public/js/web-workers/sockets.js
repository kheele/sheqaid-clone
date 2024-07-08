importScripts("https://cdn.socket.io/4.6.0/socket.io.min.js");

// self.SERVER_HOST = "http://localhost:5000";
self.SERVER_HOST = "https://bun-server.cloud.sheqaid.com";
// self.SERVER_HOST = "https://server.cloud.sheqaid.com";

self.socket = io(SERVER_HOST, {
    withCredentials: true,
    transports: ['websocket'], // Only allow WebSocket transport
    auth: (cb) => {
        const {session} = self;
        if (session.isLoggedIn) {
            const {currentUser} = session.auth;
            const {uid} = currentUser;
            // console.log('currentUser', currentUser)
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
            socket.emit('emit', {
                path: 'auth',
                data: {token, uid},
            }, (res, err) => {
                if (err) {
                    err = JSON.parse(err);
                    console.log('auth emit err', err)
                    return;
                }

                console.log('auth emit res', res)
            });
        });
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server', socket.id);
    Events.emit('connection', "DISCONNECTED");
});
