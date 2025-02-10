import {lazy} from "react";

const Employees = lazy(() => import('./Employees/Main'/* webpackChunkName:"HR" */));

const modules = {
    Employees
};

export {
    modules
};
