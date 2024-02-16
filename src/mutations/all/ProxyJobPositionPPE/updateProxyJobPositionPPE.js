/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobPositionPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyJobPositionPPEMutation($id: proxy_job_position__ppe_type_pk_columns_input!, $_set: proxy_job_position__ppe_type_set_input!) {
    update_proxy_job_position__ppe_type_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityJobPositionPPE) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
