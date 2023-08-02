import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
    {
        doc_type
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgsFilter();

    if (doc_type) {
        filter.push(`doc_type: {_eq: "${doc_type}"}`);
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};