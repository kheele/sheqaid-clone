'use strict';

module.exports = path => [
    '__B_Contractors/contractors.js',
    '__B_Contractors/contractors_users.js',
].map(v => path + '/plugins/plugin_extra/' + v);
