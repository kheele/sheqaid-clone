const api = require('./api');

exports.start = (app) => {
	app.get('/', async (req, res) => {
		res.send('welcome home');
		console.log('welcome home');
	});
	app.use('/api', api);
};