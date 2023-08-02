/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
export const EmployeeFragment = graphql`
    fragment EmployeeFragment on hr_employees {
        id
        created_at,
        fname
        lname
        email
        phone
        dob
        sex
        profile_pic
        employment_num
        employment_date
        linked_user {
            id
            fname
            lname
            username
            phone
        }
        department {
            id
            name
        }
        job_position {
            id
            name
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
`;
