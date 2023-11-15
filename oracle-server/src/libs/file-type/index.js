const os = require('os');

let mod;
try {
    if (os.platform() === 'win32') {
        mod = require('./win32');
    } else {
        mod = require('./linux');
    }
} catch (e) {
    mod = {};
}

module.exports = mod;