/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTeam} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateTeamMutation($id: default_teams_pk_columns_input!, $_set: default_teams_set_input!) {
    update_default_teams_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityTeam) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
