/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractor} from "mutations/types.d.ts";
import checkByUsernameUser from "../User/checkByUsernameUser";
import updateEmployee from "../Employee/updateEmployee";
import crudUtils from "../CRUDUtils/CRUDUtils";
import checkByUsernameContractor from "./checkByUsernameContractor";
import findByContractorEmailClient from "../Client/findByContractorEmailClient";
import findByUsernameContractor from "./findByUsernameContractor";
import updateContractor from "./updateContractor";
import updateClient from "../Client/updateClient";
import findByLinkedCompanyIdUsernameContractor from "./findByLinkedCompanyIdUsernameContractor";
import findByIdContractor from "./findByIdContractor";

// 2
const mutation = graphql`
  mutation insertContractorMutation($object: default_contractors_insert_input!) {
    insert_default_contractors_one(
      object: $object
    ) {
      id
      created_at,
      name
      username
      inc_contractor_pack
      contractor_user_list_aggregate{
        aggregate{
          count
        }
      }
      employee_list_aggregate{
        aggregate{
          count
        }
      }
      questionnaire_list_aggregate:contractor_questionnaire_list_aggregate{
        aggregate{
          count
        }
      }
      questionnaire_active_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_neq: "CompleteAccepted"}}){
        aggregate{
          count
        }
      }
      questionnaire_complete_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_eq: "CompleteAccepted"}}){
        aggregate{
          count
        }
      }
      questionnaire_compliance_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_eq: "CompleteAccepted"}}){
        nodes {
          id
          question_list_aggregate {
            aggregate {
              sum {
                score
                maxScore
              }
              min {
                score
              }
              max {
                score
              }
              avg {
                score
              }
            }
          }
        }
      }
      
      incident_list_aggregate{
        aggregate{
          count
        }
      }
      
      site_pending_list:site_list(where: {status: {_eq: "Pending"}}){
        id
        status
        contractor{
          id
          name
          username
        }
        site {
          id
          name
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
        }
      }
      site_accepted_list:site_list(where: {status: {_eq: "Accepted"}}){
        id
        status
        contractor{
          id
          name
          username
        }
        site {
          id
          name
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
        }
      }
      site_declined_list:site_list(where: {status: {_eq: "Declined"}}){
        id
        status
        contractor{
          id
          name
          username
        }
        site {
          id
          name
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
        }
      }
      site_cancelled_list:site_list(where: {status: {_eq: "Cancelled"}}){
        id
        status
        contractor{
          id
          name
          username
        }
        site {
          id
          name
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
        }
      }
      site_removed_list:site_list(where: {status: {_eq: "Removed"}}){
        id
        status
        contractor{
          id
          name
          username
        }
        site {
          id
          name
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
        }
      }
      site_list{
        id
        status
        contractor{
          id
          name
          username
        }
        site {
          id
          name
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
    }
  }
`;

// 3
export default async (input: EntityContractor) => {
  const {
    name,
    username,
    inc_contractor_pack,
    client_id,
    project_id,
    site_list,
  } = input;

  // const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
  // const {selectedClient, selectedProject, selectedSite} = storage.selected;
  // const {isConsultant, isNoProjects} = storage.is;

  const existingCompany = await findByContractorEmailClient(username);
  const linked_company_id = existingCompany && existingCompany.id;

  let savedItem;

  if(linked_company_id) {
    //existing client by matched username
    const existingContractor = await findByLinkedCompanyIdUsernameContractor(linked_company_id);
    if (existingContractor) {
      //existing client by matched username ALREADY linked
      //send confirmation to contractor to setup/accept
      savedItem = await updateContractor({id: existingContractor.id, site_list});
    } else {
      //existing client by matched username NOT linked
      const existingContractor = await findByUsernameContractor(username);
      if (existingContractor) {
        //existing contractor by matched username
        //send confirmation to contractor to setup/accept
        savedItem = await updateContractor({id: existingContractor.id, site_list, linked_company_id});
        if (savedItem) {
          await updateClient({id: linked_company_id, linked_contractor_id: savedItem.id});
        }
      } else {
        // input.company_id = sess_company_id;
        // if (sess_my_client_id) {
        //   input.client_id = sess_my_client_id;
        // } else if (isConsultant) {
        //   if(client_id || selectedClient) {
        //     input.client_id = client_id || selectedClient.id;
        //   }
        // }
        crudUtils.injectCreate(input, true);
        input.linked_company_id = linked_company_id;
        savedItem = await createMutationImpl({mutation, input});
        if (savedItem) {
          await updateClient({id: linked_company_id, linked_contractor_id: savedItem.id});
        }
      }
    }
  } else {
    //NO existing client by matched username
    const existingContractor = await findByUsernameContractor(username);
    if (existingContractor) {
      //existing contractor by matched username
      //send confirmation to contractor to setup/accept
      savedItem = await updateContractor({id: existingContractor.id, site_list});
    } else {
      //NO existing contractor by matched username
      // input.company_id = sess_company_id;
      // if (sess_my_client_id) {
      //   input.client_id = sess_my_client_id;
      // } else if (isConsultant) {
      //   if(client_id || selectedClient) {
      //     input.client_id = client_id || selectedClient.id;
      //   }
      // }
      crudUtils.injectCreate(input, true);
      savedItem = await createMutationImpl({mutation, input});
    }
  }

  if(savedItem) {
    return await findByIdContractor(savedItem.id);
  }
};
