import {lazy} from "react";

const AuditTrail = lazy(() => import('./AuditTrail/Main'/* webpackChunkName:"AuditTrail" */));
const Billing = lazy(() => import('./Billing/Billing'/* webpackChunkName:"Billing" */));
const Chats = lazy(() => import('./Chats/Main'/* webpackChunkName:"Users" */));
const Profile = lazy(() => import('./Profile/Profile'/* webpackChunkName:"Profile" */));
const Settings = lazy(() => import('./Settings/Settings'/* webpackChunkName:"Settings" */));

const Support = lazy(() => import('./Support/Support'/* webpackChunkName:"Support" */));
const Users = lazy(() => import('./Users/Users'/* webpackChunkName:"Users" */));

const modules = {
    AuditTrail, 
    Billing, 
    Chats,
    Profile, 
    Settings, 
    Support, 
    Users
};
    
export {
    modules
};