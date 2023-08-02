/* eslint-disable camelcase */

// 1
import { gql } from 'graphql-request';
// @ts-ignore
import {EntityTrainingPlan} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";
import {fillNullLists} from "./fillNullLists";

// 2
const query = gql`
  query listOneGroupByJobPositionPlanByLoggedSiteQuery($group: bigint, $site_id: bigint) {
    sheq_training_plans_per_job_position(where: {group: {_eq: $group}, site_id: {_eq: $site_id}}) {
      group
      attendance_list
      course_list
      employee_list
      year_list
      training_list
      list
      cost
      status_outstanding
      status_completed
      status_not_started
      results_failed
      results_passed
      results_average
    }
  }
`;
//firestore_id
// 3
export default async ({group, input}) =>
    listMutationImpl({
      path: `training-plan/job-position/list/site/${input}/${group}`,
    }).then(fillNullLists);
