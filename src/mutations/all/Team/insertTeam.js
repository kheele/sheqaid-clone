/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTeam} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updateEmployee from "../Employee/updateEmployee";
import findByIdTeam from "./findByIdTeam";

// 2
const mutation = graphql`
    mutation insertTeamMutation($object: default_teams_insert_input!) {
        insert_default_teams_one(
            object: $object
        ) {
            id
            created_at
            name
            status
            
            supervisor {
                id
                fname
                lname
                email
                phone
                job_position{
                    id
                    name
                }
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

            employee_list_aggregate{
                aggregate{
                    count
                }
            }
            ppe_list_aggregate{
                aggregate{
                    count
                }
            }
        }
    }
`;

// 3
export default async (input: EntityTeam) => {
    const {
        name,
        status,
        client_id,
        project_id,
        site_id,

        supervisor_id,
        employee_list,
        ppe_list,
    } = input;

    crudUtils.injectCreate(input);

    delete input.employee_list;

    const savedItem = await createMutationImpl({mutation, input});
    if(savedItem) {
        if(employee_list) {
            await Promise.all(employee_list.data.map(async ({id}) => {
                return updateEmployee(({id, team_id: savedItem.id}));
            }));
        }

        return findByIdTeam(savedItem.id);
    }
};
