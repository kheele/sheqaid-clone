/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listAllClientByLoggedCompanySelectMenuQuery($company_id: bigint) {
        default_clients_connection(where: {company_id: {_eq: $company_id}}, order_by: {name: asc}) {
            edges {
                node {
                    id
                    created_at
                    name
                    address
                    contractor_email
                    email
                    phone
                    profile_pic
                    linked_contractor {
                        id
                        name
                        username
                    }
                    module_list {
                        id
                        price
                        module {
                            id
                            borderColor
                            desc
                            discount
                            faIconLeft
                            faIconRight
                            has_update
                            hover
                            key
                            price
                            sort
                            status
                            svgIconLeft
                            svgIconRight
                            title
                            plugin{
                                key
                            }
                        }
                    }
                    sector_list{
                        id
                        sector {
                            id
                            name
                        }
                    }
                    project_list{
                        id
                        name
                        site_list {
                            id
                            name
                        }
                    }
                    site_list{
                        id
                        name
                    }
                    project_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    site_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    contractor_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    user_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    employee_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    team_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    incident_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    training_matrix_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                    asset_list_aggregate {
                        aggregate {
                            count
                        }
                    }
                }
            }
        }
    }
`;
//firestore_id
// 3
export default async (input: number) =>
	listMutationImpl({query, variables: {company_id: input}});
