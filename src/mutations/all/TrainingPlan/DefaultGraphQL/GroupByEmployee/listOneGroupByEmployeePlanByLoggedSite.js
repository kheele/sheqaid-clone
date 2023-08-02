/* eslint-disable camelcase */

// 1
import { gql } from 'graphql-request';
// @ts-ignore
import {EntityTrainingPlan} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";
import {fillNullLists} from "./fillNullLists";

// 2
const query = gql`
  query listOneGroupByEmployeePlanByLoggedSiteQuery($group: bigint, $site_id: bigint) {
    sheq_training_plans_per_employee(where: {group: {_eq: $group}, site_id: {_eq: $site_id}}) {
      group
      attendance_list
      course_list
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
      company_id
      client_id
      project_id
      site_id
    }
  }
`;
//firestore_id
// 3
export default async ({group, input}) =>
    listMutationImpl({
      path: `training-plan/employee/list/site/${input}/${group}`,
    }).then(fillNullLists);
