/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeCounselling} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeCounselling from "./updateEmployeeCounselling";

// 2
const mutation = graphql`
  mutation insertEmployeeCounsellingMutation($object: hr_employees_docs_counsellings_insert_input!) {
    insert_hr_employees_docs_counsellings_one(
      object: $object
    ) {
      id
      created_at
      doc
      corrective_actions
      counselling_hrs_to_complete
      expiry_date
      expiry_updated
      removed
      incident_desc
      reasons
      types
      responsible_person{
        id
        fname
        lname
        phone
        email
        id_num
        passport_num
      }
      employee{
        id
        fname
        lname
        phone
        email
        id_num
        passport_num
      }
      witness_list{
        id
        witness{
          fname
          lname
          phone
          email
          id_num
          passport_num
        }
      }
      company {
        id
        name
      }
      client {
        id
        name
      }
      project {
        id
        name
      }
      site {
        id
        name
      }
    }
  }
`;

// 3
export default async (input: EntityEmployeeCounselling) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeCounselling,
  name: 'Counselling',
  plural: 'counsellings',
});
