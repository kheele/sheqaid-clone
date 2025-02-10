/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionNCRByLoggedProjectQuery($project_id: bigint) {
        sheq_non_conformances_connection(where: {project_id: {_eq: $project_id}}) {
            edges {
                node {
                    id
                    created_at
                    comments
                    completed_date
                    desc
                    due_date
                    process
                    remarks
                    type
                    source
                    document_list{
                        id
                        doc
                    }
                    progress_list{
                        id
                        outstanding
                        notes
                        date
                    }
                    approving_person{
                        id
                        lname
                        fname
                        email
                        phone
                    }
                    responsible_person{
                        id
                        lname
                        fname
                        email
                        phone
                    }
                    selected_source_site {
                        id
                        name
                        project{
                            id
                            name
                        }
                        client{
                            id
                            name
                        }
                    }
                    selected_source_incident {
                        id
                    }
                    selected_source_inspection {
                        id
                    }
                    selected_source_compliance_audit {
                        id
                    }

                    client {
                        id
                        name
                    }
                    project {
                        id
                        name
                    }
                    site {
                        id
                        name
                    }
                }
            }
        }
    }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {project_id: input} });
