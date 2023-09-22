'use strict';

module.exports = path => [
        'error-reporting/index.js',
        'countries/index.js',
        'plugins/index.js',
        'support/index.js',
        'feedback/index.js',
        'users/users_funs.js',
        'users/account.js',
        'users/update.js',
        'users/index.js',
        'audit-trail/index.js',

        'docs/index.js',

        "files/index.js",
        "graphql/index.js"
    ].map(v => path + '/default/' + v);
