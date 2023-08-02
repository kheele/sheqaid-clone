import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {compliance_audit_details_fragment} from "../Fragments";

export default (
    {
        org_id, org_id: {key, value},
        scope,
        type,
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        org_id,
        scope,
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
                query listAllAuditByLoggedQuery(
                    $${key}: bigint
                ) {
                    sheq_compliance_audits(where: {
                        ${key}: {_eq: $${key}}
                        ${filter}
                    }) {
                        ${compliance_audit_details_fragment}
                        ${orgs_fragment}
                    }
                }
            `,
        }).then(fillNullLists);
    //</editor-fold>
};