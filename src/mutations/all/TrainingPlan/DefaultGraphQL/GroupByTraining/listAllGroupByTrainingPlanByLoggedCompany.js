/* eslint-disable camelcase */

// 1
import { gql } from 'graphql-request';
// @ts-ignore
import {EntityTrainingPlan} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";
import {fillNullLists} from "./fillNullLists";

// 2
const query = gql`
  query listAllGroupByTrainingPlanByLoggedCompanyQuery($company_id: bigint) {
    sheq_training_plans_per_training(where: {company_id: {_eq: $company_id}}) {
      group
      attendance_list
      year_list
      employee_list
      job_position_list
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
export default async (input: number) =>
    listMutationImpl({
        path: `training-plan/training/list/company/${input}`,
    }).then(fillNullLists);
