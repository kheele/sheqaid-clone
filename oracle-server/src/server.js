process.on('uncaughtException', (err) => {
    console.error('Caught exception: ', err);
});

require('./globals.js');
require('./app.js');
