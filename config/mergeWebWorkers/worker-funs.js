'use strict';

module.exports = path => [
        'plugins_funs.js',
        'all_users_funs.js',
        'questionnaire_funs.js'
    ].map(v => path + '/funs/' + v);
