/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTeam} from "mutations/types.d.ts";
import findByIdJobPosition from "../JobPosition/findByIdJobPosition";
import findByIdTeam from "./findByIdTeam";
import updateProxyTeamPPE from "../ProxyTeamPPE/updateProxyTeamPPE";
import insertProxyTeamPPE from "../ProxyTeamPPE/insertProxyTeamPPE";
import updateEmployee from "../Employee/updateEmployee";

// 2
const mutation = graphql`
    mutation updateTeamMutation($id: default_teams_pk_columns_input!, $_set: default_teams_set_input!) {
        update_default_teams_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityTeam) => {
    const {
        id,
        name,
        status,
        removed,
        client_id,
        project_id,
        site_id,

        supervisor_id,
        employee_list,
        ppe_list,
    } = attrs;

    const existingItem = await findByIdTeam(id);
    if (!existingItem) {
        return "NOT_FOUND";
    }

    if(employee_list) {
        await Promise.all(employee_list.map(async item => {
            return updateEmployee({...item, team_id: id});
        }));
    }
    if(ppe_list) {
        await Promise.all(ppe_list.map(async item => {
            if(item.id) {
                return updateProxyTeamPPE(item);
            } else {
                return insertProxyTeamPPE(item);
            }
        }));
    }
    
    if('removed' in attrs) {
        attrs.status = removed ? 'Inactive' : 'Active';
        delete attrs.removed;
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
