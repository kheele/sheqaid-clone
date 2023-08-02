/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractor} from "mutations/types.d.ts";
import findByIdClient from "../Client/findByIdClient";
import findByIdContractor from "./findByIdContractor";
import insertProxyContractorSite from "../ProxyContractorSite/insertProxyContractorSite";
import updateProxyContractorSite from "../ProxyContractorSite/updateProxyContractorSite";

// 2
const mutation = graphql`
    mutation updateContractorMutation($id: default_contractors_pk_columns_input!, $_set: default_contractors_set_input!) {
        update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {
            id
            created_at,
            name
            username
            inc_contractor_pack
            contractor_user_list_aggregate{
                aggregate{
                    count
                }
            }
            employee_list_aggregate{
                aggregate{
                    count
                }
            }
            questionnaire_list_aggregate:contractor_questionnaire_list_aggregate{
                aggregate{
                    count
                }
            }
            questionnaire_active_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_neq: "CompleteAccepted"}}){
                aggregate{
                    count
                }
            }
            questionnaire_complete_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_eq: "CompleteAccepted"}}){
                aggregate{
                    count
                }
            }
            questionnaire_compliance_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_eq: "CompleteAccepted"}}){
                nodes {
                    id
                    question_list_aggregate {
                        aggregate {
                            sum {
                                score
                                maxScore
                            }
                            min {
                                score
                            }
                            max {
                                score
                            }
                            avg {
                                score
                            }
                        }
                    }
                }
            }
            incident_list_aggregate{
                aggregate{
                    count
                }
            }
            site_pending_list:site_list(where: {status: {_eq: "Pending"}}){
                id
                status
                contractor{
                    id
                    name
                    username
                }
                site {
                    id
                    name
                    company {
                        id
                        name
                    }
                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                }
            }
            site_accepted_list:site_list(where: {status: {_eq: "Accepted"}}){
                id
                status
                contractor{
                    id
                    name
                    username
                }
                site {
                    id
                    name
                    company {
                        id
                        name
                    }
                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                }
            }
            site_declined_list:site_list(where: {status: {_eq: "Declined"}}){
                id
                status
                contractor{
                    id
                    name
                    username
                }
                site {
                    id
                    name
                    company {
                        id
                        name
                    }
                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                }
            }
            site_cancelled_list:site_list(where: {status: {_eq: "Cancelled"}}){
                id
                status
                contractor{
                    id
                    name
                    username
                }
                site {
                    id
                    name
                    company {
                        id
                        name
                    }
                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                }
            }
            site_removed_list:site_list(where: {status: {_eq: "Removed"}}){
                id
                status
                contractor{
                    id
                    name
                    username
                }
                site {
                    id
                    name
                    company {
                        id
                        name
                    }
                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                }
            }
            site_list{
                id
                status
                contractor{
                    id
                    name
                    username
                }
                site {
                    id
                    name
                    company {
                        id
                        name
                    }
                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                }
            }
            company {
                id
                name
            }
            client {
                id
                name
            }
            project {
                id
                name
            }
        }
    }
`;

// 3
export default async (attrs: EntityContractor) => {
    const {
        id,
        name,
        username,
        inc_contractor_pack,
        client_id,
        project_id,
        site_list,
    } = attrs;

    const item = await findByIdContractor(id);
    if(!item) return;

    if(site_list) {
        delete attrs.site_list;
        await Promise.all((site_list.data || site_list).map(async v => {
            if(v.id) {
                updateProxyContractorSite(v);
            } else {
                insertProxyContractorSite({...v, contractor_id: id});
            }
        }));
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs: {
            name,
            username,
            inc_contractor_pack,
            client_id,
            project_id,
        },
    });
};
