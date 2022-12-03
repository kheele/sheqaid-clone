'use strict';

module.exports = path => [
        'lib/mammoth/mammoth.browser.min.js', //
        'lib/file-converter-utils.js', //
        'alasql.js', //
        'alasql_funs.js', //
        'excel-utils.js', //
        'files.js', //
        'file-utils.js', //
        'uuidv4.min.js'//
    ].map(v => path + '/node/' + v);
