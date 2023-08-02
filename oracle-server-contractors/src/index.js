require('./globals.js');

require('./app.js');

process.on('uncaughtException', (err) => {
    console.error('Caught exception: ', err);
});