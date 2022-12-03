'use strict';

module.exports = path => [
        'objects.util.js',
        'date-utils.js',
        
        'bson.bundle.js',

        'Events.js'
    ].map(v => path + '/' + v);
