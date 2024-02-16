/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProxyTeamPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyTeamPPEMutation($id: proxy_team__ppe_type_pk_columns_input!, $_set: proxy_team__ppe_type_set_input!) {
    update_proxy_team__ppe_type_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityProxyTeamPPE) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
