import React from "react";

import {onAsyncSelectLoadImpl} from 'utils/AsyncSelect';
import {
	onSelectLoadAssetActionCategories,
	onSelectLoadAssetManufacturers,
	onSelectLoadAssetModels,
	onSelectLoadAssetLocations,
	onSelectLoadAssetToolkits,
	onSelectLoadAssetVendors,
} from './assets';
import GQLClient from "../../../graphql/GQLClient";

// <editor-fold defaultstate="collapsed" desc="AsyncSelectLoad. Click on the + sign on the left to edit the code.">
function onAsyncSelectLoadFlashReportEmployersOrContractors(value) {
	return onAsyncSelectLoadImpl("plugin_sheq_assist/17_Incident_Investigation/flash-reports/list/search_employer_or_contractor_by_name", value, value => {
		return {label: value, value};
	});
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectLoad. Click on the + sign on the left to edit the code.">
function onSelectLoadTrainingFrequencies() {
	return GQLClient
		.query({
			query: `
      query listAllTrainingMatrixFrequenciesQuery {
        sheq_training_matrices(
          where: {
            training_frequency:{_is_null: false}
          },
          distinct_on: training_frequency,
	        order_by: {training_frequency: asc},
        ) {
          training_frequency
        }
      }
    `,
		}).then(res => res.map(v => v.training_frequency).map(value => {
			return {label: value, value};
		}));
}

function onSelectLoadSWPCategories() {
	return GQLClient
		.query({
			query: `
      query listAllSWPCategoriesQuery {
        hira_swp(
          where: {
            category:{_is_null: false}
          },
          distinct_on: category,
	        order_by: {category: asc},
        ) {
          category
        }
      }
    `,
		}).then(res => res.map(v => v.category).map(value => {
			return {label: value, value};
		}));
}

function onSelectLoadSWPLocations() {
	return GQLClient
		.query({
			query: `
      query listAllSWPLocationsQuery {
        hira_swp(
          where: {
            location:{_is_null: false}
          },
          distinct_on: location,
	        order_by: {location: asc},
        ) {
          location
        }
      }
    `,
		}).then(res => res.map(v => v.location).map(value => {
			return {label: value, value};
		}));
}

function onSelectLoadSOPLocations() {
	return GQLClient
		.query({
			query: `
      query listAllSOPLocationsQuery {
        hira_sop(
          where: {
            location:{_is_null: false}
          },
          distinct_on: location,
	        order_by: {location: asc},
        ) {
          location
        }
      }
    `,
		}).then(res => res.map(v => v.location).map(value => {
			return {label: value, value};
		}));
}

function onSelectLoadAuditElements() {
	return GQLClient
		.query({
			query: `
      query listAllAuditElementsQuery {
        sheq_compliance_audits(
          where: {
            element:{_is_null: false}
          },
          distinct_on: element,
	        order_by: {element: asc},
        ) {
          element
        }
      }
    `,
		}).then(res => res.map(v => v.element).map(value => {
			return {label: value, value};
		}));
}

function onSelectLoadAuditSubElements() {
	return GQLClient
		.query({
			query: `
      query listAllAuditSubElementsQuery {
        sheq_compliance_audits(
          where: {
            sub_element:{_is_null: false}
          },
          distinct_on: sub_element,
	        order_by: {sub_element: asc},
        ) {
          sub_element
        }
      }
    `,
		}).then(res => res.map(v => v.sub_element).map(value => {
			return {label: value, value};
		}));
}

// </editor-fold>

function getRiskRatingConsequenceList() {
	return ['1) Low', '2) Moderate', '3) High', '4) Very High', '5) Extreme'].map((text, n) => {
		return {text, value: n + 1, checked: false};
	});
}

function getRiskRatingLikelihoodList() {
	return ["1) Rare", "2) Unlikely", "3) Possible", "4) Likely", "5) Almost Certain"].map((text, n) => {
		return {text, value: n + 1, checked: false};
	});
}

function getRiskRatingFrequencyList() {
	return ["1) Rare", "2) Infrequent", "3) Frequent", "4) High Frequent", "5) Continuous"].map((text, n) => {
		return {text, value: n + 1, checked: false};
	});
}

export {
// <editor-fold defaultstate="collapsed" desc="AsyncSelectLoad. Click on the + sign on the left to edit the code.">
	onAsyncSelectLoadFlashReportEmployersOrContractors,
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc="SelectLoad. Click on the + sign on the left to edit the code.">
	onSelectLoadAssetActionCategories,
	onSelectLoadAssetManufacturers,
	onSelectLoadAssetModels,
	onSelectLoadAssetLocations,
	onSelectLoadAssetToolkits,
	onSelectLoadAssetVendors,
	onSelectLoadTrainingFrequencies,

	onSelectLoadSWPCategories,
	onSelectLoadSWPLocations,
	onSelectLoadSOPLocations,
	onSelectLoadAuditElements,
	onSelectLoadAuditSubElements,
// </editor-fold>
	getRiskRatingConsequenceList, getRiskRatingLikelihoodList, getRiskRatingFrequencyList
};
