const fs = require('fs');
const express = require('express');
const https = require('https');
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
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());

const secret = "&6%^#-=!!!=+A+`;\"[[`bRHPD8*&~";
app.use(
	session({
		secret,
		cookieName: 'sheqaid',
		cookie: {},
		resave: false,
		saveUninitialized: false,
	}),
);
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

app.use('/api', api);
app.use('/v1beta1/relay', relay);
app.use('/v1/graphql', general);
app.use('/api/rest/views', views);

const options = {
	key: fs.readFileSync(process.env.CERT_PRIVATE_KEY),
	cert: fs.readFileSync(process.env.CERT_PUBLIC_KEY),
};

if(isProduction) {
	https.createServer(options, app).listen(process.env.PORT, () => {
		console.log(`Server securely listening on port ${process.env.PORT}`);
	});
} else {
	const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port: ${server.address().port}`);
	});
}