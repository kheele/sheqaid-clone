/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobPosition, EntitySector} from "mutations/types.d.ts";
import updateMutationImpl from "../../updateMutationImpl";

// 2
const mutation = graphql`
  mutation insertSectorMutation($object: default_sectors_insert_input!) {
    insert_default_sectors_one(
      object: $object
    ) {
      id
      created_at
      name
      desc
      sector_owner
      training_course_list_aggregate{
        aggregate{
          count
        }
      }
      company_list_aggregate{
        aggregate{
          count
        }
      }
      client_list_aggregate{
        aggregate{
          count
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
    }
  }
`;

// 3
export default async (input: EntitySector) => {
    const {selectedClient, selectedProject, selectedSite} = storage.selected;
    const {isConsultant, isContractor, isNoProjects} = storage.is;

    const {
        name,
    } = input;

    input.sector_owner = "Private";

    const {company, user} = storage.loggedUser;
//
    if(isContractor) {
        input.contractor_user_id = user.id;
    } else {
        input.user_id = user.id;
    }
//
    if(isContractor) {
        const {loggedContractor} = storage;
        input.contractor_id = loggedContractor && loggedContractor.id;
        input.company_id = 38;//TODO: THIS IS A HACK. THE COMPANY WITH THIS ID WAS CREATED ONLY TO ASSIGN CONTRACTORS DATA TO THE COMPANY. BECAUSE PGSQL THROWS NON-NULL ERROR.
        return;
    }

    input.company_id = company.id;

    if (selectedClient) {
        input.client_id = selectedClient.id;
    }
    
    return await createMutationImpl({mutation, input});
};
