/* eslint-disable camelcase */

import findOneMutationImpl from "mutations/findOneMutationImpl";
import {employee_personal_details_fragment, personal_details_other_fragment} from "../../../graphql/Fragments";

const findByIdProxy = async ({id, name, returnAttrs, tbl,}) => {
  return findOneMutationImpl({
    query: `
			query ${name}($id: bigint) {
	        ${tbl}(where: {id: {_eq: $id}}) {
	            ${returnAttrs}
	        }
	    }
		`,
    variables: {id},
  });
};

export const findByIdProxyIncidentActivity = async (id) => {
  return findByIdProxy({
    id,
    name: 'findByIdProxyIncidentActivity',
    tbl: `proxy_incident__activity`,
    returnAttrs: `
      id
      incident{
        id
      }
      activity{
        id
        name
        sector{
          id
          name
        }
      }
    `,
  });
};

export const findByIdProxyIncidentCategory = async ({incident_id, category_id}) => {
  return findOneMutationImpl({
    query: `
			query findByIdProxyIncidentCategory($incident_id: bigint, $category_id: bigint) {
	      proxy_incident__category(where: {incident_id: {_eq: $incident_id}, category_id: {_eq: $category_id}}) {
	        incident_id
          incident{
            id
          }
          category_id
          category{
            id
            name
          }
	      }
	    }
		`,
    variables: {incident_id, category_id},
  });
};

export const findByIdProxyIncidentDistribution = async (id) => {
  return findByIdProxy({
    id,
    name: 'findByIdProxyIncidentDistribution',
    tbl: `proxy_incident__distribution`,
    returnAttrs: `
      id
      incident{
        id
      }
      employee{
        ${employee_personal_details_fragment}
      }
      other_person{
        ${personal_details_other_fragment}
      }
    `,
  });
};

export const findByIdProxyIncidentInjuryList = async ({incident_id, injury_id}) => {
  return findOneMutationImpl({
    query: `
			query findByIdProxyIncidentInjuryList($incident_id: bigint, $injury_id: bigint) {
	      proxy_incident__injury(where: {incident_id: {_eq: $incident_id}, injury_id: {_eq: $injury_id}}) {
	        incident_id
          incident{
            id
          }
          injury_id
          injury{
            id
            name
            type
          }
	      }
	    }
		`,
    variables: {incident_id, injury_id},
  });
};

export const findByIdProxyIncidentInvestigator = async (id) => {
  return findByIdProxy({
    id,
    name: 'findByIdProxyIncidentInvestigator',
    tbl: `proxy_incident__investigator`,
    returnAttrs: `
      id
      investigation{
        id
      }
      investigator{
        ${employee_personal_details_fragment}
      }
      investigator_other{
        ${personal_details_other_fragment}
      }
    `,
  });
};

export const findByIdProxyIncidentPersonInvolved = async (id) => {
  return findByIdProxy({
    id,
    name: 'findByIdProxyIncidentPersonInvolved',
    tbl: `proxy_incident__person_involved`,
    returnAttrs: `
      id
      incident{
        id
      }
      person_involved{
        ${employee_personal_details_fragment}
      }
      person_involved_other{
        ${personal_details_other_fragment}
      }
    `,
  });
};

export const findByIdProxyIncidentSector = async (id) => {
  return findByIdProxy({
    id,
    name: 'findByIdProxyIncidentSector',
    tbl: `proxy_sector__incident`,
    returnAttrs: `
      id
      incident{
        id
      }
      sector{
        id
        name
      }
    `,
  });
};

export const findByIdProxyIncidentSubCategory = async ({incident_id, sub_category_id}) => {
  return findOneMutationImpl({
    query: `
			query findByIdProxyIncidentSubCategory($incident_id: bigint, $sub_category_id: bigint) {
	      proxy_incident__sub_category(where: {incident_id: {_eq: $incident_id}, sub_category_id: {_eq: $sub_category_id}}) {
	        incident_id
          incident{
            id
          }
          sub_category_id
          sub_category{
            id
            name
            category{
              id
              name
            }
          }
	      }
	    }
		`,
    variables: {incident_id, sub_category_id},
  });
};

export const findByIdProxyIncidentWitness = async (id) => {
  return findByIdProxy({
    id,
    name: 'findByIdProxyIncidentWitness',
    tbl: `proxy_incident__witness`,
    returnAttrs: `
      id
      incident{
        id
      }
      witness{
        ${employee_personal_details_fragment}
      }
      witness_other{
        ${personal_details_other_fragment}
      }
    `,
  });
};