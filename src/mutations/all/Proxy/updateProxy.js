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
import GQLClient from "graphql/GQLClient";
import {convertMobx} from "utils/UtilsFuns";

const updateProxy = async ({attrs, name, tbl, findById}) => {
	const {
		id,
	} = attrs;

	const item = await findById(id);
	if (!item) return;

	return GQLClient.mutation({
		mutation: `
			mutation ${name}($id: ${tbl}_pk_columns_input!, $_set: ${tbl}_set_input!) {
	        update_${tbl}_by_pk(pk_columns: $id, _set: $_set) {
	            id
	        }
	    }
		`,
		variables: {
			id: { id },
			_set: convertMobx(attrs),
		},
	}).then(res => res && findById(id));
};

export const updateProxyIncidentActivity = async (attrs) => {
	return updateProxy({
		attrs, 
		name: 'updateProxyIncidentActivity', 
		findById: findByIdProxyIncidentActivity, 
		tbl: `proxy_incident__activity`,
	});
};

export const updateProxyIncidentCategory = async (attrs) => {
	const {
		incident_id,
		category_id,
		new_category_id,
	} = attrs;

	delete attrs.incident_id;
	delete attrs.category_id;

	const id = {
		incident_id,
		category_id,
	};

	const item = await findByIdProxyIncidentCategory(id);
	if (!item) return;

	attrs.category_id = new_category_id;

	return GQLClient.mutation({
		mutation: `
			mutation updateProxyIncidentCategory($id: proxy_incident__category_pk_columns_input!, $_set: proxy_incident__category_set_input!) {
	        update_proxy_incident__category_by_pk(pk_columns: $id, _set: $_set) {
	            incident_id
							category_id
	        }
	    }
		`,
		variables: {
			id: { id },
			_set: convertMobx(attrs),
		},
	}).then(res => res && findByIdProxyIncidentCategory(res));
};

export const updateProxyIncidentDistribution = async (attrs) => {
	return updateProxy({
		attrs, 
		name: 'updateProxyIncidentDistribution',
		findById: findByIdProxyIncidentDistribution,
		tbl: `proxy_incident__distribution`,
	});
};

export const updateProxyIncidentInjuryList = async (attrs) => {
	const {
		incident_id,
		injury_id,
		new_injury_id,
	} = attrs;

	delete attrs.incident_id;
	delete attrs.injury_id;

	const id = {
		incident_id,
		injury_id,
	};

	const item = await findByIdProxyIncidentInjuryList(id);
	if (!item) return;

	attrs.injury_id = new_injury_id;

	return GQLClient.mutation({
		mutation: `
			mutation updateProxyIncidentInjuryList($id: proxy_incident__injury_pk_columns_input!, $_set: proxy_incident__injury_set_input!) {
	        update_proxy_incident__injury_by_pk(pk_columns: $id, _set: $_set) {
	            incident_id
							injury_id
	        }
	    }
		`,
		variables: {
			id: { id },
			_set: convertMobx(attrs),
		},
	}).then(res => res && findByIdProxyIncidentInjuryList(res));
};

export const updateProxyIncidentInvestigator = async (attrs) => {
	return updateProxy({
		attrs, 
		name: 'updateProxyIncidentInvestigator',
		findById: findByIdProxyIncidentInvestigator,
		tbl: `proxy_incident__investigator`,
	});
};

export const updateProxyIncidentPersonInvolved = async (attrs) => {
	return updateProxy({
		attrs, 
		name: 'updateProxyIncidentPersonInvolved',
		findById: findByIdProxyIncidentPersonInvolved,
		tbl: `proxy_incident__person_involved`,
	});
};

export const updateProxyIncidentSector = async (attrs) => {
	return updateProxy({
		attrs, 
		name: 'updateProxyIncidentSector',
		findById: findByIdProxyIncidentSector,
		tbl: `proxy_sector__incident`,
	});
};

export const updateProxyIncidentSubCategory = async (attrs) => {
	const {
		incident_id,
		sub_category_id,
		new_sub_category_id,
	} = attrs;

	delete attrs.incident_id;
	delete attrs.sub_category_id;

	const id = {
		incident_id,
		sub_category_id,
	};

	const item = await findByIdProxyIncidentSubCategory(id);
	if (!item) return;

	attrs.sub_category_id = new_sub_category_id;

	return GQLClient.mutation({
		mutation: `
			mutation updateProxyIncidentSubCategory($id: proxy_incident__sub_category_pk_columns_input!, $_set: proxy_incident__sub_category_set_input!) {
	        update_proxy_incident__sub_category_by_pk(pk_columns: $id, _set: $_set) {
	            incident_id
							sub_category_id
	        }
	    }
		`,
		variables: {
			id: { id },
			_set: convertMobx(attrs),
		},
	}).then(res => res && findByIdProxyIncidentSubCategory(res));
};

export const updateProxyIncidentWitness = async (attrs) => {
	return updateProxy({
		attrs,
		name: 'updateProxyIncidentWitness',
		findById: findByIdProxyIncidentWitness,
		tbl: `proxy_incident__witness`,
	});
};