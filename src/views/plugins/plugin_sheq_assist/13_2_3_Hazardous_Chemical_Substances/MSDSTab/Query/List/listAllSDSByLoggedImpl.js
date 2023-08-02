import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {chemical_sds_details_fragment} from "../Fragments";

export default (
    {
        org_id, org_id: {key, value},
        category,
        risk_level,
        manufacturer,
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        org_id,
        category,
        risk_level,
        manufacturer,
    });

    const fillNullLists = (list) => list.map(v => {
        // !v.site_list && (v.site_list = []);
        return v;
    });

    //<editor-fold desc="ByEach">
    return GQLClient
        .query({
            variables,
            query: `
                query listAllSDSByLoggedQuery(
                    $${key}: bigint
                ) {
                    sheq_chemical_sds(where: {
                        ${key}: {_eq: $${key}}
                        ${filter}
                    }) {
                        ${chemical_sds_details_fragment}
                        ${orgs_fragment}
                    }
                }
            `,
        }).then(fillNullLists);
    //</editor-fold>
};