/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
import uuidv4 from "uuid/v4";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {findByIdContractor} from "../../findById";

// 2
const mutation = graphql`
    mutation sendOTPContractorMutation($id: default_contractors_pk_columns_input!, $_set: default_contractors_set_input!) {
        update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (id: number) => {
    const item = await findByIdContractor(id);
    if (!item) return "NO_USER_DB";

    const password_otp = uuidv4().substring(0, 5);
    return updateMutationImpl({
        checkLogin: false,
        mutation,
        id,
        attrs: {password_otp},
    });
};
