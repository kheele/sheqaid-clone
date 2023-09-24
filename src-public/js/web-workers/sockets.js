importScripts("https://cdn.socket.io/4.6.0/socket.io.min.js");

const ws_url = "http://localhost:5000";
// const ws_url = "https://server.cloud.sheqaid.com";

self.socket = io(ws_url, {
	withCredentials: true,
	transports: ['websocket'], // Only allow WebSocket transport
	auth: (cb) => {
		const {session} = self;
		if (session.isLoggedIn) {
			const {currentUser} = session.auth;
			currentUser.getIdToken().then(token => {
				cb({token});
			});
		} else {
			cb({token: null});
		}
	},
});

socket.on('connect', () => {
	console.log('Connected to server', socket.id);
	Events.emit('connection', "CONNECTED");
});

socket.on('disconnect', () => {
	console.log('Disconnected from server', socket.id);
	Events.emit('connection', "DISCONNECTED");
});