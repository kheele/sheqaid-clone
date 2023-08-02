/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityCompany} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateCompanyMutation($id: default_companies_pk_columns_input!, $_set: default_companies_set_input!) {
    update_default_companies_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityCompany) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
