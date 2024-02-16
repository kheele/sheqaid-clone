/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
import uuidv4 from "uuid/v4";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractor} from "mutations/types.d.ts";
import findByIdContractor from "./findByIdContractor";
import findOneMutationImpl from "../../findOneMutationImpl";
import removeOTPContractor from "./removeOTPContractor";

// 2
const query = graphql`
    query confirmOTPContractorMutation($id: bigint, $code: String) {
        default_contractors_connection(where: {id: {_eq: $id}, password_otp: {_eq: $code}}) {
            edges {
                node {
                    id
                    created_at,
                    name
                    username
                    inc_contractor_pack
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
        }
    }
`;

// 3
export default async ({id, code}) => {
    if(!id || !code) {
        return;
    }

    const item = await findByIdContractor(id);
    if(!item) return "NO_USER_DB";

    const res = await findOneMutationImpl({checkLogin: false, query, variables: {id, code}});
    if(res) {
        removeOTPContractor(id);
        return res;
    }
    return "NO_OTP_MATCH";
};
