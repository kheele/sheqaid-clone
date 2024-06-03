require('./client-sockets');

const {Server} = require("socket.io");
const {createShardedAdapter, createAdapter} = require("@socket.io/redis-adapter");
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
	
	io.use(async (socket, next) => {
		console.log("io.use1");
		const res = await setAuthDecodedIdTokenBySocket(socket);
		console.log("io.use", res);
		if (res === "UNAUTHORIZED") {
			return;
		}
		
		socket.injectCreate = injectCreate.bind(socket);
		
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

async function injectCreate(input, skipOrgs = false) {
	if (!input) return;
	
	const {session} = this.request;
	
	const {
		sess_company_id,
		sess_my_client_id,
		sess_my_project_id,
		sess_my_site_id,
		sess_my_contractor_id,
		
		user_id,
		
		selected_client_id,
		selected_project_id,
		selected_site_id,
		logged_contractor_id,
		
		// access_type,
	} = session.decodedIdToken;
	
	const {
		isConsultant,
		isContractor,
		isNoProjects,
	} = session.decodedIdToken;
	
	const {
		client_id,
		project_id,
		site_id,
	} = input;
	
	if (isContractor) {
		input.contractor_user_id = user_id;
	} else {
		input.user_id = user_id;
	}
	
	if (skipOrgs) return;
	
	if (isContractor) {
		input.contractor_id = sess_my_contractor_id || logged_contractor_id;
		input.company_id = 38;//TODO: THIS IS A HACK. THE COMPANY WITH THIS ID WAS CREATED ONLY TO ASSIGN CONTRACTORS DATA TO THE COMPANY. BECAUSE PGSQL THROWS NON-NULL ERROR.
		return;
	}
	
	input.company_id = sess_company_id;
	
	if (sess_my_site_id) {
		input.site_id = sess_my_site_id;
	} else if (isConsultant) {
		if (site_id || selected_site_id) {
			input.site_id = site_id || selected_site_id;
		}
	} else if (!isNoProjects) {
		if (site_id || selected_site_id) {
			input.site_id = site_id || selected_site_id;
		}
	}
	
	if (sess_my_project_id) {
		input.project_id = sess_my_project_id;
	} else if (isConsultant) {
		if (project_id || selected_project_id) {
			input.project_id = project_id || selected_project_id;
		}
	} else if (!isNoProjects) {
		if (project_id || selected_project_id) {
			input.project_id = project_id || selected_project_id;
		}
	}
	
	if (sess_my_client_id) {
		input.client_id = sess_my_client_id;
	} else if (isConsultant) {
		if (client_id || selected_client_id) {
			input.client_id = client_id || selected_client_id;
		}
	}
}
