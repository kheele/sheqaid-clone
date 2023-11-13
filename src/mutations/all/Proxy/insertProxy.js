/* eslint-disable camelcase */

import {
  findByIdProxyIncidentActivity,
  findByIdProxyIncidentCategory,
  findByIdProxyIncidentDistribution,
  findByIdProxyIncidentInjuryList,
  findByIdProxyIncidentInvestigator,
  findByIdProxyIncidentPersonInvolved,
  findByIdProxyIncidentSector,
  findByIdProxyIncidentSubCategory,
  findByIdProxyIncidentWitness,
} from './findByIdProxy';
import {convertMobx} from "utils/UtilsFuns";
import GQLClient from "graphql/GQLClient";

const insertProxy = async ({input, name, tbl, findById}) => {
  const {
  } = input;

  return GQLClient.mutation({
    mutation: `
			mutation ${name}($object: ${tbl}_insert_input!) {
	        insert_${tbl}_one(object: $object) {
	            id
	        }
	    }
		`,
    variables: {
      object: await convertMobx(input),
    },
  }).then(res => res && findById(res.id));
};

export const insertProxyIncidentActivity = async (input) => {
  return insertProxy({
    input,
    name: 'insertProxyIncidentActivity',
    findById: findByIdProxyIncidentActivity,
    tbl: `proxy_incident__activity`,
  });
};

export const insertProxyIncidentCategory = async (input) => {
  const {
  } = input;

  return GQLClient.mutation({
    mutation: `
			mutation insertProxyIncidentCategory($object: proxy_incident__category_insert_input!) {
	        insert_proxy_incident__category_one(object: $object) {
	            incident_id
							category_id
	        }
	    }
		`,
    variables: {
      object: await convertMobx(input),
    },
  }).then(res => res && findByIdProxyIncidentCategory(res));
};

export const insertProxyIncidentDistribution = async (input) => {
  return insertProxy({
    input,
    name: 'insertProxyIncidentDistribution',
    findById: findByIdProxyIncidentDistribution,
    tbl: `proxy_incident__distribution`,
  });
};

export const insertProxyIncidentInjuryList = async (input) => {
  const {
  } = input;

  return GQLClient.mutation({
    mutation: `
			mutation insertProxyIncidentInjuryList($object: proxy_incident__injury_insert_input!) {
	        insert_proxy_incident__injury_one(object: $object) {
	            incident_id
							injury_id
	        }
	    }
		`,
    variables: {
      object: await convertMobx(input),
    },
  }).then(res => res && findByIdProxyIncidentInjuryList(res));
};

export const insertProxyIncidentInvestigator = async (input) => {
  return insertProxy({
    input,
    name: 'insertProxyIncidentInvestigator',
    findById: findByIdProxyIncidentInvestigator,
    tbl: `proxy_incident__investigator`,
  });
};

export const insertProxyIncidentPersonInvolved = async (input) => {
  return insertProxy({
    input,
    name: 'insertProxyIncidentPersonInvolved',
    findById: findByIdProxyIncidentPersonInvolved,
    tbl: `proxy_incident__person_involved`,
  });
};

export const insertProxyIncidentSector = async (input) => {
  return insertProxy({
    input,
    name: 'insertProxyIncidentSector',
    findById: findByIdProxyIncidentSector,
    tbl: `proxy_sector__incident`,
  });
};

export const insertProxyIncidentSubCategory = async (input) => {
  const {
  } = input;

  return GQLClient.mutation({
    mutation: `
			mutation insertProxyIncidentSubCategory($object: proxy_incident__sub_category_insert_input!) {
	        insert_proxy_incident__sub_category_one(object: $object) {
	            incident_id
							sub_category_id
	        }
	    }
		`,
    variables: {
      object: await convertMobx(input),
    },
  }).then(res => res && findByIdProxyIncidentSubCategory(res));
};

export const insertProxyIncidentWitness = async (input) => {
  return insertProxy({
    input,
    name: 'insertProxyIncidentWitness',
    findById: findByIdProxyIncidentWitness,
    tbl: `proxy_incident__witness`,
  });
};