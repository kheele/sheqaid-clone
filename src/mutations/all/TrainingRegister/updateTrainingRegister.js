/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingRegister} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateTrainingRegisterMutation($id: sheq_training_registers_pk_columns_input!, $_set: sheq_training_registers_set_input!) {
    update_sheq_training_registers_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        date
        institution_conducting_training
        time_or_duration
        list_proof
        trainer{
            id
            fname
            lname
            email
            phone
        }
        trainer_external{
            id
            fname
            lname
            email
            phone
        }
        training{
            id
            course {
                id
                name
            }
        }
        employee_list{
            id
            employee{
                id
                fname
                lname
                email
                phone
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
    }
  }
`;

// 3
export default async (attrs: EntityTrainingRegister) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
