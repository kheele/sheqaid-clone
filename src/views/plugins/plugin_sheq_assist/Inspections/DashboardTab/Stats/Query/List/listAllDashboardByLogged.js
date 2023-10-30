import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";

//<editor-fold desc="contractor_questionnaire_question_list_fragment">
const contractor_questionnaire_question_list_fragment = (deep = 3) => {
	if (deep === 0) {
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
	}
) => {
	const id = site_id || project_id || client_id || company_id;
	let where = '';
	if (site_id) {
		where = `site:{id: {_eq: ${id}}}`;
	} else if (project_id) {
		where = `project:{id: {_eq: ${id}}}`;
	} else if (client_id) {
		where = `client:{id: {_eq: ${id}}}`;
	} else {
		where = `company:{id: {_eq: ${id}}}`;
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
					questionnaire: {${where}},
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
		// variables: {mon, mon2, mon3},
		query: `
      query findByIdOrgInspectionsDashboardQuery {
        #
			  all_template_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  all_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  all_non_compliant_questionnaire_list_aggregate: default_contractor_questionnaires_ques_aggregate(where: {is_deviation: {_eq: true}}) {
			  	aggregate {
					count
				}
			  }
			  all_asset_list_aggregate: assets_aggregate(where: {inspection_and_template_list:{is_template:{_eq: false}}}) {
				  aggregate {
					count
				  }
			  }
			  
			  #
			  list_interval_unclassified_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_is_null: true}}) {
			    aggregate {
			      count
			    }
			  }
			  list_interval_daily_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_eq: "Daily"}}) {
			    aggregate {
			      count
			    }
			  }
			  list_interval_weekly_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_eq: "Weekly"}}) {
			    aggregate {
			      count
			    }
			  }
			  list_interval_monthly_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_eq: "Monthly"}}) {
			    aggregate {
			      count
			    }
			  }
			  list_interval_quarterly_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_eq: "Quarterly"}}) {
			    aggregate {
			      count
			    }
			  }
			  list_interval_biannually_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_eq: "Bi-Annually"}}) {
			    aggregate {
			      count
			    }
			  }
			  list_interval_annually_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, ${where}, interval: {_eq: "Annually"}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  active_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, status: {_neq: "CompleteAccepted"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completed_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, status: {_eq: "CompleteAccepted"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  completion_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, status: {_eq: "CompleteRequested"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  declined_requests_questionnaire_list_aggregate: default_contractor_questionnaires_aggregate(where: {group: {_eq: "Inspections"}, status: {_eq: "CompleteDeclined"}, ${where}}) {
			    aggregate {
			      count
			    }
			  }
			  
			  #
			  questionnaire_list: default_contractor_questionnaires(where: {group: {_eq: "Inspections"}, status: {_neq: "CompleteAccepted"}, ${where}}) {
			    question_list {
			      ${contractor_questionnaire_question_list_fragment(3)}
			    }
			  }
			  
      }
    `,
	}).then(res => [res]);
	//</editor-fold>
};