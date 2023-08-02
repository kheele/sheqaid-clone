'use strict';

module.exports = path => [
        'firebase_app.js',
        'Utils.js',
        'Session.js',

        'controllers/AControllerWrite.js',
        'controllers/AControllerRead.js',

        'controllers//AAccountsFunsCntr.js',
        'controllers//AAccountsServerCntr.js',
        'controllers//AAccountsCntr.js',

        'controllers/plugins/plugin_sheq_assist/AControllerAssist.js',
        'controllers/plugins/plugin_sheq_assist/ADocumentCntr.js'
    ].map(v => path + '/' + v);
