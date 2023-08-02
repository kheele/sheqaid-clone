import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {chemical_hazchem_details_fragment} from "../Fragments";

export default (
    {
        org_id, org_id: {key, value},
        physical_state,
        type,
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        org_id,
        physical_state,
        type,
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
                query listAllHazchemSheetsByLoggedQuery(
                    $${key}: bigint
                ) {
                    sheq_chemical_hazchem_sheets(where: {
                        ${key}: {_eq: $${key}}
                        ${filter}
                    }) {
                        ${chemical_hazchem_details_fragment({key, value})}
                        ${orgs_fragment}
                    }
                }
            `,
        }).then(fillNullLists);
    //</editor-fold>
};