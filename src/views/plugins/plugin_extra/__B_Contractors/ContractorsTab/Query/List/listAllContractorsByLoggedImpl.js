import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_no_site_fragment} from "graphql/Fragments";
import {contractor_details_fragment} from "../Fragments";

export default (
    {
        org_id, org_id: {key, value},
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        org_id,
    });

    const fillNullLists = (list) => list.map(v => {
        !v.site_list && (v.site_list = []);
        return v;
    });

    //<editor-fold desc="ByEach">
    return GQLClient
        .query({
            variables,
            query: `
                query listAllContractorsByLoggedQuery(
                    $${key}: bigint
                ) {
                    default_contractors(where: {
                        site_list: {site: {${key}: {_eq: $${key}}}}
                    }) {
                        ${contractor_details_fragment({key, value})}
                        ${orgs_no_site_fragment}
                    }
                }
            `,
        }).then(fillNullLists);
    //</editor-fold>
};