/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityCompanyCategory} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateCompanyCategoryMutation($id: default_company_categories_pk_columns_input!, $_set: default_company_categories_set_input!) {
    update_default_company_categories_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityCompanyCategory) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
