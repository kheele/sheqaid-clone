'use strict';

module.exports = path => [
    'employees/employee_docs_impl.js',
    'employees/employees.js',
    'employees/account.js',
].map(v => path + '/plugins/plugin_hr_management/' + v);
