import {lazy} from "react";

const _01_Claim_Management_For_Companies = lazy(() => import('./01_Claim_Management_For_Companies/Main'/* webpackChunkName:"01_Claim_Management_For_Companies" */));

const _02_Claim_Management_For_MedicalCenters = lazy(() => import('./02_Claim_Management_For_MedicalCenters/Main'/* webpackChunkName:"02_Claim_Management_For_MedicalCenters" */));

const _03_Claim_Management_For_ServiceProviders = lazy(() => import('./03_Claim_Management_For_ServiceProviders/Main'/* webpackChunkName:"03_Claim_Management_For_ServiceProviders" */));

const modules = {
    _01_Claim_Management_For_Companies,
    _02_Claim_Management_For_MedicalCenters,
    _03_Claim_Management_For_ServiceProviders
};

export {
    modules
};
