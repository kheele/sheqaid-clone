const {Server} = require("socket.io");
const {createShardedAdapter,createAdapter } = require("@socket.io/redis-adapter");
// const {createAdapter } = require("@socket.io/redis-streams-adapter");

const controllers = require("./controllers");
//api/accounts/sign: add catch and throw: 177

exports.start = async ({server, corsOptions, getRedisClient, sessionMiddleware, helmetMiddleware}) => {
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
	
	const {pubClient, subClient} = getRedisClient();
	
	await Promise.all([
		pubClient.connect(),
		subClient.connect()
	]);
	
	global.io = new Server(server, {
		adapter: createAdapter(pubClient, subClient),
		// adapter: createShardedAdapter(pubClient, subClient),
		cors: corsOptions,
		transports: ['websocket'],
		connectionStateRecovery: {
			// the backup duration of the sessions and the packets
			maxDisconnectionDuration: 2 * 60 * 1000,
			// whether to skip middlewares upon successful recovery
			skipMiddlewares: false,
		}
	});
	
	io.engine.use(helmetMiddleware);
	io.engine.use(sessionMiddleware);
	
	io.use((socket, next) => {
		const {request, handshake} = socket;
		if (handshake) {
			// if (request) {
			const {headers, auth} = handshake;
			const {session} = request;
			const {auth_id} = session;
			// console.log('io.use session auth', auth);
			const {token = null, uid, access_type} = auth || {};
			if (token) {
				// admin.auth().verifyIdToken(token).then(decodedIdToken => {
				// 	console.log("decodedIdToken", decodedIdToken);
				// 	return decodedIdToken;
				// }).catch(err => {
				// 	console.error(err);
				// 	return 'UNAUTHORIZED REQUEST!';
				// });
				// try {
				// 	const [authType, tokenValue] = token.trim().split(' ');
				// 	if (authType !== 'Bearer') {
				// 		// throw new Error('Expected a Bearer token');
				// 	}
				//
				// 	console.log(authType, tokenValue);//
				//
				// 	// const {claims: {sub}} = await jwtVerifier.verifyAccessToken(tokenValue, 'api://default');
				// 	// const user = await oktaClient.getUser(sub);
				//
				// 	// users.set(socket, {
				// 	// 	id: user.id,
				// 	// 	name: [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' '),
				// 	// });
				// } catch (err) {
				// 	console.error(err);
				// }
			}
		}

		next();
	});

	io.on('connection', (socket) => {
		// const {auth} = socket.handshake;
		const {session} = socket.request;
		// console.log(session);

		const sessionId = session.id;
		// the session ID is used as a room
		socket.join(sessionId);

		console.log('user connected', socket.id, sessionId);

		socket.on("disconnect", () => {
			// controllers.destroy();
			console.log('user disconnected', socket.id, sessionId);
		});

		// socket.use((__, next) => {
		// 	session.reload((err) => {
		// 		// WARNING! "session" still points towards the previous session object
		// 		if (err) {
		// 			console.log('socket reload err:', err);
		// 			// forces the client to reconnect
		// 			// socket.conn.close();
		// 			// you can also use socket.disconnect(), but in that case the client
		// 			// will not try to reconnect
		// 		}
		//
		// 		next();
		// 	});
		// });

		controllers.start(socket);
	});
};
