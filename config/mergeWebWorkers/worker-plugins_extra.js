'use strict';

module.exports = path => [
        // '__A_COVID_Management/cases_impl.js',
        // '__A_COVID_Management/screening.js',
        // '__A_COVID_Management/vulnerable.js',
        // '__A_COVID_Management/return-to-work.js',
        // '__A_COVID_Management/positive.js',
        // '__A_COVID_Management/covid-submission-api.js',
        // '__A_COVID_Management/vaccine-certificates.js',
        // '__A_COVID_Management/documents.js',

        // '__B_Contractors/contractors_funs.js',
        // '__B_Contractors/contractor_users_funs.js',
        // '__B_Contractors/contractors_questionnaire_funs.js',
        // '__B_Contractors/contractors.js',
        // '__B_Contractors/contractors_users.js',
        // '__B_Contractors/questionnaires.js',
        // '__B_Contractors/questionnaire_library.js',
        // '__B_Contractors/questionnaire_templates.js',

        // '__C_StructureAndResponsibility/appointments.js',
        // '__C_StructureAndResponsibility/organograms.js'
    ].map(v => path + '/plugins/plugin_extra/' + v);
