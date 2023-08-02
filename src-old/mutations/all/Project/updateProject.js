/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProject} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateProjectMutation($id: default_projects_pk_columns_input!, $_set: default_projects_set_input!) {
    update_default_projects_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityProject) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
