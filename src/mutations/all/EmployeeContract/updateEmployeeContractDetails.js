/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "../../updateMutationImpl";

// 2
const mutation = graphql`
  mutation updateEmployeeContractDetailsMutation($id: hr_employees_docs_contracts_details_pk_columns_input!, $_set: hr_employees_docs_contracts_details_set_input!) {
    update_hr_employees_docs_contracts_details_by_pk(pk_columns: $id, _set: $_set) {
        id
        contract_type
        daily_working_hours
        end_of_trial_period
        end_time
        expiry_date
        notes
        start_date
        start_time
    }
  }
`;

// 3
export default async (attrs) => {
    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
}
