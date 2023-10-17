const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const cookieParser = require("cookie-parser");
const sockets = require('./sockets');
const appRoutes = require('./app-routes');

const app = express();

const corsOptions = {origin: "*", credentials: true};
const secret = "&6%^#-=!!!=+A+`;\"[[`bRHPD8*&~";
const sessionMiddleware = session({
	secret,
	cookieName: 'sheqaid',
	cookie: {},
	resave: true,
	saveUninitialized: true,
});

// Middleware function to log requests
app.use((req, res, next) => {
	console.log(`${req.method} request received for ${req.url}`, req.session && req.session.id)
	res.header({"Access-Control-Allow-Origin": "*"});
	next()
});

app.use('/', express.static(path.join(__dirname,'static')));
app.use(express.text({limit: "200mb"}), express.json({strict: false, limit: "200mb"}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());
app.use(sessionMiddleware);
// app.use(csrf({ sessionKey: 'sheqaid' }));
app.use(morgan(
	':method :url :status :res[content-length] - :response-time ms',
	{
		stream: {
			write: (message) => console.log(message.trim()),
		},
	}
));

const server = app.listen(process.env.PORT, () => {
	console.log(`server started on port: ${server.address().port}`);
});

appRoutes.start(app);
sockets.start({server, corsOptions, sessionMiddleware});