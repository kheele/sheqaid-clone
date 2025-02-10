/* eslint-disable camelcase */

// 1
import { gql } from 'graphql-request';
// @ts-ignore
import {EntityTrainingPlan} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";
import {fillNullLists} from "./fillNullLists";

// 2
const query = gql`
  query listAllGroupByYearPlanByLoggedSiteQuery($site_id: bigint) {
    sheq_training_plans_per_year(where: {site_id: {_eq: $site_id}}) {
        group
        attendance_list
        course_list
        employee_list
        job_position_list
        training_list
        list
        cost
        status_outstanding
        status_completed
        results_failed
        results_passed
        results_average
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({
        path: `training-plan/year/list/site/${input}`,
    }).then(fillNullLists);
