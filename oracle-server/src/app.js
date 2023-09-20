const fs = require('fs');
const express = require('express');
const https = require('https');
const {Server} = require('socket.io');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const csrf = require('csurf');
const cookieParser = require("cookie-parser");
const api = require('./api');
const {relay, general, views} = require('./graphql');

const app = express();

// Middleware function to log requests
app.use((req, res, next) => {
	console.log(`${req.method} request received for ${req.url}`, req.body)
	res.header({"Access-Control-Allow-Origin": "*"});
	next()
})

app.use(express.text({limit: "200mb"}), express.json({strict: false, limit: "200mb"}));

const corsOptions = {origin: true, credentials: true};

app.use(cors(corsOptions));
app.use(cookieParser());

const secret = "&6%^#-=!!!=+A+`;\"[[`bRHPD8*&~";
const sessionMiddleware = session({
	secret,
	cookieName: 'sheqaid',
	cookie: {},
	resave: true,
	saveUninitialized: true,
});
app.use(sessionMiddleware);
// app.use(csrf({ sessionKey: 'sheqaid' }));

const morganMiddleware = morgan(
	':method :url :status :res[content-length] - :response-time ms',
	{
		stream: {
			write: (message) => console.log(message.trim()),
		},
	}
);

app.use(morganMiddleware);

app.get('/', async (req, res) => {
	res.send('welcome home');
	console.log('welcome home');
});
app.use('/api', api);
app.use('/v1beta1/relay', relay);
app.use('/v1/graphql', general);
app.use('/api/rest/views', views);

const options = {
	key: fs.readFileSync(process.env.CERT_PRIVATE_KEY),
	cert: fs.readFileSync(process.env.CERT_PUBLIC_KEY),
};

let server;
// if(isProduction) {
// 	server = https.createServer(options, app);
// 	server.listen(process.env.PORT, () => {
// 		console.log(`Server securely listening on port ${process.env.PORT}`);
// 	});
// } else {
	server = app.listen(process.env.PORT, () => {
		console.log(`server started on port: ${server.address().port}`);
	});
// }

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

const SESSION_RELOAD_INTERVAL = 30 * 1000;
io.on('connection', (socket) => {
	const sessionId = socket.request.session.id;
	// the session ID is used as a room
	socket.join(sessionId);

	console.log('a user connected');

	const timer = setInterval(() => {
		socket.request.session.reload((err) => {
			if (err) {
				// forces the client to reconnect
				socket.conn.close();
				// you can also use socket.disconnect(), but in that case the client
				// will not try to reconnect
			}
		});
	}, SESSION_RELOAD_INTERVAL);

	socket.on("disconnect", () => {
		console.log('user disconnected');
		clearInterval(timer);
	});
});