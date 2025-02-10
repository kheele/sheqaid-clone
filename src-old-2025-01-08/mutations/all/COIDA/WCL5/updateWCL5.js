/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityWCL5} from "mutations/types.d.ts";
import findByIdWCL5 from "./findByIdWCL5";

// 2
const mutation = graphql`
  mutation updateWCL5Mutation($id: coida_claims_wcl_5_pk_columns_input!, $_set: coida_claims_wcl_5_set_input!) {
    update_coida_claims_wcl_5_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityWCL5) => {
    const {
        id,
    } = attrs;

    const item = await findByIdWCL5(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).
    then(res => res && findByIdWCL5(res.id));
};
