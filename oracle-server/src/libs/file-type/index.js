const os = require('os');

let mod;
try {
    if (os.platform() === 'win32') {
        mod = require('./win32');
    } else {
        mod = require('./linux');
    }
} catch (err) {
    mod = {};
    console.error(`Can't load .node module`, err);
}

module.exports = mod;