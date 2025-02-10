import {lazy} from "react";

const __B_Contractors = lazy(() => import('./__B_Contractors/Main'/* webpackChunkName:"__B_Contractors" */));

const __C_Structure_And_Responsibility = lazy(() => import('./__C_Structure_And_Responsibility/Main'/* webpackChunkName:"__C_Structure_And_Responsibility" */));

const modules = {
    __B_Contractors,
    __C_Structure_And_Responsibility
};

export {
    modules
};
