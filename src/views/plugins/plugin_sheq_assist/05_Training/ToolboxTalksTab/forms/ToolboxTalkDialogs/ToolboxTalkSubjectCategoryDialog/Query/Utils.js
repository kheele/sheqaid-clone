import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
    {
        name,
        //
        client_id,
        //
        exact_orgs = true,
        exact_orgs_company = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgsFilter({client_id, exact_orgs,});
    
    if (name) {
        filter.push(`name: {_ilike: "%${name}%"}`);
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
