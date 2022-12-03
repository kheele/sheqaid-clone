import {lazy} from "react";

const CompanyAddressMap = lazy(() => import('./CompanyAddressMap'/* webpackChunkName:"CompanyAddressMap" */));
const NearbyPlaces = lazy(() => import('./NearbyPlaces'/* webpackChunkName:"NearbyPlaces" */));

export {CompanyAddressMap, NearbyPlaces};
