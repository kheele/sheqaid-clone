/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityEmployeeCompetency} from "../../types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeCompetency from "./findByIdEmployeeCompetency";

// 2
const mutation = graphql`
  mutation updateEmployeeCompetencyMutation($id: hr_employees_docs_competencies_pk_columns_input!, $_set: hr_employees_docs_competencies_set_input!) {
    update_hr_employees_docs_competencies_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityEmployeeCompetency) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeCompetency,
    name: 'Competency-Certificate',
    plural: 'competencies',
});
