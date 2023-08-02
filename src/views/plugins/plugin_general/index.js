import {lazy} from "react";

const Calendar = lazy(() => import('./Calendar/Main'/* webpackChunkName:"Calendar" */));

const Sectors = lazy(() => import('./Sectors/Main'/* webpackChunkName:"Sectors" */));

const Clients = lazy(() => import('./Clients/Main'/* webpackChunkName:"Clients" */));

const Projects = lazy(() => import('./Projects/Main'/* webpackChunkName:"Projects" */));

const Sites = lazy(() => import('./Sites/Main'/* webpackChunkName:"Sites" */));

const modules = {
    Calendar,

    Sectors,
    Clients,
    Projects, 
    Sites, 
};

export {
    modules
};
