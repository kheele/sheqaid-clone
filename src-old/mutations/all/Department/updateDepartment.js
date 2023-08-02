/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityDepartment} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateDepartmentMutation($id: default_departments_pk_columns_input!, $_set: default_departments_set_input!) {
    update_default_departments_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityDepartment) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
