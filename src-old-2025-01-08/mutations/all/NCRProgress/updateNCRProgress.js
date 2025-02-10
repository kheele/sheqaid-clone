/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityNCRProgress} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateNCRProgressMutation($id: sheq_non_conformance_progress_pk_columns_input!, $_set: sheq_non_conformance_progress_set_input!) {
    update_sheq_non_conformance_progress_by_pk(pk_columns: $id, _set: $_set) {
        id
        outstanding
        notes
        date
    }
  }
`;

// 3
export default async (attrs: EntityNCRProgress) => {
    const {
        id,
        outstanding,
        notes,
        date,
    } = attrs;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};