/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "../../updateMutationImpl";

// 2
const mutation = graphql`
  mutation updateEmployeeContractSalaryInfoMutation($id: hr_employees_docs_contracts_salary_info_pk_columns_input!, $_set: hr_employees_docs_contracts_salary_info_set_input!) {
    update_hr_employees_docs_contracts_salary_info_by_pk(pk_columns: $id, _set: $_set) {
        id
        deductible_list{
            id
            created_at
            text
            value
        }
        payment_type
        salary
        salary_interval
        wage
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
