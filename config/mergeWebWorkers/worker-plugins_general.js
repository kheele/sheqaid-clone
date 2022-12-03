'use strict';

module.exports = path => [
        'calendar/index.js',
        'dashboard/index.js',
        'notifications/index.js',
        'sectors/index.js',
        'clients/index.js',
        'projects/index.js',
        'sites/index.js',

        'document-categories/index.js',
        'signature-settings/index.js',
    ].map(v => path + '/plugins/plugin_general/' + v);
