import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
    {
        name,
        type,
        target,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgsFilter({site_id, project_id, client_id, exact_orgs,});

    if (target) {
        filter.push(`target: {_eq: ${target}}`);
    }
    if (type) {
        filter.push(`type: {_eq: ${type}}`);
    }
    if (name) {
        filter.push(`_or: [
		    {client: {name: {_ilike: "%${name}%"}}}, 
		    {project: {name: {_ilike: "%${name}%"}}}, 
		    {site: {name: {_ilike: "%${name}%"}}}
		]`);
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};