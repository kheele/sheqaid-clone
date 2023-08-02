import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";

//<editor-fold desc="contractor_questionnaire_question_list_fragment">
const contractor_questionnaire_question_list_fragment = (deep = 3) => {
	if(deep === 0) {
		return `id`;
	}
	return `
    id
    maxScore
    score
    question_list{
        ${contractor_questionnaire_question_list_fragment(deep - 1)}
    }
`;
};
//</editor-fold>

export default (
	{
		removed = false,
		//
		date_range = {},
		//
		site_id, project_id, client_id, company_id,
		contractor_id, contractor_site_id,
	}
) => {
	let where = 'group: {_eq: "Contractors"},', whereSite = '';

	if(contractor_site_id) {
		where += whereSite = `site:{id: {_eq: ${contractor_site_id}}}`;
	}

	if(!storage.is.isContractor) {
		const id = site_id || project_id || client_id || company_id;
		// if (site_id) {
		// 	where = whereSite = `site:{id: {_eq: ${id}}}`;
		// } else if (project_id) {
		// 	where = `project:{id: {_eq: ${id}}}`;
		// 	whereSite = `site:{project:{id: {_eq: ${id}}}}`;
		// } else if (client_id) {
		// 	where = `client:{id: {_eq: ${id}}}`;
		// 	whereSite = `site:{project:{client:{id: {_eq: ${id}}}}}`;
		// } else {
		// 	where = `company:{id: {_eq: ${id}}}`;
		// 	whereSite = `site:{project:{client:{company:{id: {_eq: ${id}}}}}}`;
		// }
	}

	const {start, end} = date_range;
	const monStart = start || new Date().addMonths(-12);
	const monEnd = end || new Date().addMonths(6);

	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dateRangeQueries = dates.map(date => {
		const {year, month, start, end} = date;
		return `
			_${year}_${month}__expiry_document_list_aggregate: default_contractor_questionnaires_ques_aggregate(
				where: {
					questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}},
					questionType: {_eq: "Document"},
					expiry: {_gte: "${start}", _lte: "${end}"}
				}
			) {
				aggregate {
				  count
				} 
			}
		`;
	}).join('\n');

	const mon = Dates.formatDateSQL(new Date().addMonths(1));
	const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
	const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		multi_queries: true,
		count: true,
		variables: {mon, mon2, mon3},
		query: `
      query findByIdOrgContractorsMainDashboardQuery($mon: date, $mon2: date, $mon3: date) {
        #
        all_site_list_aggregate: default_sites_aggregate(where: {contractor_list: {contractor_id:{_eq: ${contractor_id}},${whereSite}}}) {
			    aggregate {
			      count
			    }
			  }
			  all_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  all_documents_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, questionType: {_eq: "Document"}}) {
			    aggregate {
			      count
			    }
			  }
			  all_expired_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gte: "now()"}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  list_no_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_is_null: true}}) {
			    aggregate {
			      count
			    }
			  }
			  list_mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: "now()", _lte: $mon}}) {
			    aggregate {
			      count
			    }
			  }
			  list_2mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: $mon, _lte: $mon2}}) {
			    aggregate {
			      count
			    }
			  }
			  list_3mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: $mon2, _lte: $mon3}}) {
			    aggregate {
			      count
			    }
			  }
			  list_4mon_expiry_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {questionnaire: {contractor_id:{_eq: ${contractor_id}},${where}}, expiry: {_gt: $mon3}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  active_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_neq: "CompleteAccepted"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completed_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteAccepted"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completion_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteRequested"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  declined_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {status: {_eq: "CompleteDeclined"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  questionnaire_list: default_contractor_questionnaires(where: {status: {_neq: "CompleteAccepted"}, contractor_id:{_eq: ${contractor_id}},${where}}) {
			    question_list {
			      ${contractor_questionnaire_question_list_fragment(3)}
			    }
			  }
			  
			  #
			  ${dateRangeQueries}
      }
    `,
	}).then(res => [res]);
	//</editor-fold>
};