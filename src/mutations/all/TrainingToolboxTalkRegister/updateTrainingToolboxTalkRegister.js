/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingToolboxTalkRegister} from "mutations/types.d.ts";
import findByIdTrainingToolboxTalkRegister from "./findByIdTrainingToolboxTalkRegister";

// 2
const mutation = graphql`
  mutation updateTrainingToolboxTalkRegisterMutation($id: sheq_training_toolbox_talk_registers_pk_columns_input!, $_set: sheq_training_toolbox_talk_registers_set_input!) {
    update_sheq_training_toolbox_talk_registers_by_pk(pk_columns: $id, _set: $_set) {
      id
      date
      subject{
        id
        name
      }
      employee_list{
        id
        signature
        date
        employee{
          id
          fname
          lname
          job_position{
            id
            name
          }
        }
      }
      site{
        id
        name
      }
      project{
        id
        name
      }
      client{
        id
        name
      }
      company{
        id
        name
      }
    }
  }
`;

// 3
export default async (attrs: EntityTrainingToolboxTalkRegister) => {
  const {
    id,
    name,
  } = attrs;
  
  const item = await findByIdTrainingToolboxTalkRegister(id);
  if(!item) return;
  
  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
};
