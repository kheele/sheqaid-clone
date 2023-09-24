const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");
const {createClient} = require("redis");

const controllers = require("./controllers");
//api/accounts/sign: add catch and throw: 177
//
// const pubClient = createClient({url: "redis://localhost:6379"});
// const subClient = pubClient.duplicate();

exports.start = ({server, corsOptions, sessionMiddleware}) => {
	// Handle server errors
	server.on('error', (error) => {
		if (error.syscall !== 'listen') {
			throw error;
		}

		switch (error.code) {
			case 'EACCES':
				console.error(`Port ${process.env.PORT} requires elevated privileges`);
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(`Port ${process.env.PORT} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
		}
	});

	server.on('listening', () => {
		console.log('Server is now listening');
	});

	global.io = new Server(server, {
		cors: corsOptions,
		transports: ['websocket'], // Only allow WebSocket transport
	});
	io.engine.use(sessionMiddleware);
	io.use((socket, next) => {
		// console.log('socket.handshake', socket.handshake);//
		if(socket.handshake) {
			const {token = null} = socket.handshake.query || {};
			if (token) {
				try {
					const [authType, tokenValue] = token.trim().split(' ');
					if (authType !== 'Bearer') {
						throw new Error('Expected a Bearer token');
					}

					console.log(authType, tokenValue);//

					// const {claims: {sub}} = await jwtVerifier.verifyAccessToken(tokenValue, 'api://default');
					// const user = await oktaClient.getUser(sub);

					// users.set(socket, {
					// 	id: user.id,
					// 	name: [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' '),
					// });
				} catch (err) {
					console.error(err);
				}
			}
		}

		next();
	});
	// io.adapter(createAdapter(pubClient, subClient));

	io.on('connection', (socket) => {
		const session = socket.request.session;
		const sessionId = session.id;
		const handshake = socket.handshake;
		// the session ID is used as a room
		socket.join(sessionId);

		// console.log('socket.request', socket.request);
		// console.log('socket.request.session', session);
		console.log('user connected', socket.id, sessionId);

		socket.on("disconnect", () => {
			// controllers.destroy();
			console.log('user disconnected', socket.id, sessionId);
		});

		socket.use((__, next) => {
			session.reload((err) => {
				// WARNING! "session" still points towards the previous session object
				// console.log('socket reload err:', err);
				if (err) {
					// forces the client to reconnect
					// socket.conn.close();
					// you can also use socket.disconnect(), but in that case the client
					// will not try to reconnect
				}

				next();
			});
		});

		controllers.start(socket);
	});
};