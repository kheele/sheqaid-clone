import {lazy} from "react";

const AdminUsers = lazy(() => import('./AdminUsers/Main'/* webpackChunkName:"AdminUsers" */));

const Billing = lazy(() => import('./Billing/Main'/* webpackChunkName:"Billing" */));
const Support = lazy(() => import('./Support/Main'/* webpackChunkName:"Support" */));

const Companies = lazy(() => import('./Companies/Main'/* webpackChunkName:"Companies" */));
const Clients = lazy(() => import('./Clients/Main'/* webpackChunkName:"Clients" */));
const Projects = lazy(() => import('./Projects/Main'/* webpackChunkName:"Projects" */));
const Sites = lazy(() => import('./Sites/Main'/* webpackChunkName:"Sites" */));
const Users = lazy(() => import('./Users/Main'/* webpackChunkName:"Users" */));
const Modules = lazy(() => import('./Modules/Main'/* webpackChunkName:"Modules" */));

const ScheduledTasks = lazy(() => import('./ScheduledTasks/Main'/* webpackChunkName:"ScheduledTasks" */));

const modules = {
    AdminUsers,
	
    Billing,
    Support,
	
    Companies, 
    Clients, 
    Projects, 
    Sites,
    Users, 
    Modules,
    ScheduledTasks
};
    
export {
    modules
};