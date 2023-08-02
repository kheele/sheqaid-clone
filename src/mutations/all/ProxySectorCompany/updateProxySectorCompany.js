/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySectorCompany} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxySectorCompanyMutation($id: proxy_sector__company_pk_columns_input!, $_set: proxy_sector__company_set_input!) {
    update_proxy_sector__company_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntitySectorCompany) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
