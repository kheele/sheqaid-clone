'use strict';

module.exports = path => [
        '01_Claim_Management_For_Companies/funs.js',
        '01_Claim_Management_For_Companies/client_employer_details.js',
        '01_Claim_Management_For_Companies/claims.js',
        '01_Claim_Management_For_Companies/requests.js',
        '01_Claim_Management_For_Companies/coid_provider.js',
        '01_Claim_Management_For_Companies/medical_center.js',
        
        '02_Claim_Management_For_MedicalCenters/funs.js',
        '02_Claim_Management_For_MedicalCenters/claims.js',
        
        '03_Claim_Management_For_ServiceProviders/funs.js',
        '03_Claim_Management_For_ServiceProviders/claims.js',
        '03_Claim_Management_For_ServiceProviders/requests.js',
        '03_Claim_Management_For_ServiceProviders/companies.js',
    ].map(v => path + '/plugins/plugin_claim_management/' + v);
