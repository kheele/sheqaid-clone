import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_no_project_and_site_fragment} from "graphql/Fragments";
import {contractor_questionnaire_template_details_fragment} from "../Fragments";

export default (
    {
        org_id, org_id: {key, value},
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        org_id,
    });

    const fillNullLists = (list) => list.map(v => {
        !v.doc_version_list && (v.doc_version_list = []);
        if(isArray(v.latest_version)) {
            v.latest_version = v.latest_version[0];
        }
        return v;
    });

    //<editor-fold desc="ByEach">
    return GQLClient
        .query({
            variables,
            query: `
                query listAllContractorQuestionnaireTemplatesByLoggedQuery(
                    $${key}: bigint
                ) {
                    default_contractor_questionnaire_templates(where: {
                        ${key}: {_eq: $${key}}
                    }) {
                        ${contractor_questionnaire_template_details_fragment}
                        ${orgs_no_project_and_site_fragment}
                    }
                }
            `,
        }).then(fillNullLists);
    //</editor-fold>
};