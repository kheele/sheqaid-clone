'use strict';

module.exports = path => [
        'error-reporting/index.js',
        'plugins/index.js',
        'support/index.js',
        'feedback/index.js',
        
        'companies_billable/index.js',
        'scheduled_tasks/index.js',
        
        'users/users_funs.js',
        'users/account.js',
        'users/update.js',
        'users/index.js',
        
        'audit-trail/index.js'
    ].map(v => path + '/admin/' + v);
