'use strict';

module.exports = path => [
        'employees/employees_transfer_funs.js',
        
        'employees/employee_docs_impl.js',
        'employees/employees_funs.js',
        'employees/employees.js',
        'employees/account.js',
        'employees/teams.js',
        'employees/departments.js',
        'employees/job_positions.js',
        'employees/job_categories.js',
        'employees/supervisors.js',
        
        'competencies/competencies.js',
        'medicals/medicals.js',
        'warnings/warnings.js',
        'leaves/leaves.js',
        'contracts/contracts.js',
        'licences/licences.js',
        'work_permits/work_permits.js',
        'counselling/counselling.js',
        'appointments/appointments.js',
        'attendance/attendance.js',
        'ppe/ppe.js'
    ].map(v => path + '/plugins/plugin_hr_management/' + v);
