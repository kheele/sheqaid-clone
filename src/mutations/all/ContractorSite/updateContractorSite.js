/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractorSite} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateContractorSiteMutation($id: default_sites_pk_columns_input!, $_set: default_sites_set_input!) {
    update_default_sites_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityContractorSite) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
