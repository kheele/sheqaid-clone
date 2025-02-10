//<editor-fold desc="training_plan_stats_top_counter_fragment">
export const training_plan_stats_top_counter_fragment = ({range_start, range_end}) => {
	let where_training_matrix_list_aggregate = ``;
	let where_training_plan_list_aggregate = ``;
	if (range_start) {
		where_training_matrix_list_aggregate += `date_range_start: {_gte: "${range_start}"}`;
		where_training_plan_list_aggregate += `date_range_start: {_gte: "${range_start}"}`;
	}
	if (range_end) {
		if (range_start) {
			where_training_matrix_list_aggregate = `, `;
		}
		if (range_start) {
			where_training_plan_list_aggregate = `, `;
		}

		where_training_matrix_list_aggregate += `date_range_end: {_lte: "${range_end}"}`;

		where_training_plan_list_aggregate += `date_range_end: {_lte: "${range_end}"}`;
		where_training_plan_list_aggregate = `training: {${where_training_plan_list_aggregate}}`;
	}
	if (!where_training_matrix_list_aggregate.isEmpty()) {
		where_training_matrix_list_aggregate = `(where: {${where_training_matrix_list_aggregate}})`;
	}
	if (!where_training_plan_list_aggregate.isEmpty()) {
		where_training_plan_list_aggregate = `, ${where_training_plan_list_aggregate}`;
	}

	return `
        #id
        
        training_course_list_aggregate{
            aggregate{
                count
            }
        }
        participant_list_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}${where_training_plan_list_aggregate}}) {
            aggregate {
                count(distinct: true, columns: employee_id)
            }
        }
        cost_list_aggregate:training_matrix_list_aggregate${where_training_matrix_list_aggregate}{
            aggregate {
                sum {
                    cost
                }
            }
        }
        training_list_aggregate:training_matrix_list_aggregate${where_training_matrix_list_aggregate}{
            aggregate{
                count
            }
        }
        institution_list_aggregate:training_matrix_list_aggregate${where_training_matrix_list_aggregate}{
            aggregate {
                count(distinct: true, columns: institution_conducting_training)
            }
        }
        trainer_internal_list_aggregate:training_matrix_list_aggregate${where_training_matrix_list_aggregate}{
            aggregate {
                count(distinct: true, columns: trainer_id)
            }
        }
        trainer_external_list_aggregate:training_matrix_list_aggregate${where_training_matrix_list_aggregate}{
            aggregate {
                count(distinct: true, columns: trainer_external_id)
            }
        }
    `;
};
//</editor-fold>

//<editor-fold desc="training_plan_stats_top_doughnut_chart_fragment">
export const training_plan_stats_top_doughnut_chart_fragment = ({range_start, range_end}) => {
	let where_training_matrix_list_aggregate = ``;
	let where_training_plan_list_aggregate = ``;
	let where_training_plan_list_aggregate_2 = ``;
	if (range_start) {
		where_training_matrix_list_aggregate += `date_range_start: {_gte: "${range_start}"}`;
		where_training_plan_list_aggregate += `date_range_start: {_gte: "${range_start}"}`;
	}
	if (range_end) {
		if (range_start) {
			where_training_matrix_list_aggregate = `, `;
		}
		if (range_start) {
			where_training_plan_list_aggregate = `, `;
		}

		where_training_matrix_list_aggregate += `date_range_end: {_lte: "${range_end}"}`;

		where_training_plan_list_aggregate += `date_range_end: {_lte: "${range_end}"}`;
		where_training_plan_list_aggregate = `training: {${where_training_plan_list_aggregate}}`;
	}
	if (!where_training_matrix_list_aggregate.isEmpty()) {
		where_training_matrix_list_aggregate = `, ${where_training_matrix_list_aggregate}`;
	}
	if (!where_training_plan_list_aggregate.isEmpty()) {
		where_training_plan_list_aggregate_2 = `(where: {${where_training_plan_list_aggregate}})`;
		where_training_plan_list_aggregate = `, ${where_training_plan_list_aggregate}`;
	}

	return `
        #id
        
        #TODO: fix date range
        status_not_started_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "Not Started"}}){
            aggregate {
                count
            }
        }
        #TODO: fix date range
        status_outstanding_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "Outstanding"}}){
            aggregate{
                count
            }
        }
        status_in_progress_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "In Progress"}${where_training_plan_list_aggregate}}){
            aggregate {
                count
            }
        }
        status_completed_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}${where_training_plan_list_aggregate}}){
            aggregate{
                count
            }
        }
        
        #
        results_passed_aggregate:training_plan_list_aggregate(where: {result_status: {_eq: "Passed"}${where_training_plan_list_aggregate}}){
            aggregate {
                count
            }
        }
        results_failed_aggregate:training_plan_list_aggregate(where: {result_status: {_eq: "Failed"}${where_training_plan_list_aggregate}}){
            aggregate {
                count
            }
        }
        
        #
        results_average_aggregate:training_plan_list_aggregate${where_training_plan_list_aggregate_2}{
            aggregate {
                avg{
                  result
                }
            }
        }
        
        #
        employee_gender_male_aggregate:training_plan_list_aggregate(distinct_on: [employee_id], where: {employee: {sex: {_eq: "Male"}}${where_training_plan_list_aggregate}}){
            aggregate {
                count
            }
        }
        employee_gender_female_aggregate:training_plan_list_aggregate(distinct_on: [employee_id], where: {employee: {sex: {_eq: "Female"}}${where_training_plan_list_aggregate}}){
            aggregate {
                count
            }
        }
        
        #
        training_provider_requirement_accredited_aggregate:training_matrix_list_aggregate(where: {provider_requirement: {_eq: "Accredited"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        training_provider_requirement_non_accredited_aggregate:training_matrix_list_aggregate(where: {provider_requirement: {_eq: "Non-Accredited"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        
        #
        training_requirement_compulsory_aggregate:training_matrix_list_aggregate(where: {requirement: {_eq: "Compulsory"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        training_requirement_optional_aggregate:training_matrix_list_aggregate(where: {requirement: {_eq: "Optional"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        
        #
        legal_requirement_yes_aggregate:training_matrix_list_aggregate(where: {requirement_legal: {_eq: "Yes"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        legal_requirement_no_aggregate:training_matrix_list_aggregate(where: {requirement_legal: {_eq: "No"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        
        #
        training_provider_external_aggregate:training_matrix_list_aggregate(where: {trainer_external_id: {_is_null: false}${where_training_matrix_list_aggregate}}){
            aggregate {
                count(distinct: true, columns: trainer_external_id)
            }
        }
        training_provider_internal_aggregate:training_matrix_list_aggregate(where: {trainer_id: {_is_null: false}${where_training_matrix_list_aggregate}}){
            aggregate {
                count(distinct: true, columns: trainer_id)
            }
        }
        
        #
        competency_evaluation_on_day_of_evaluation_aggregate:training_matrix_list_aggregate(where: {competency_evaluation: {_eq: "OnDayOfEvaluation"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
        competency_evaluation_last_day_of_evaluation_aggregate:training_matrix_list_aggregate(where: {competency_evaluation: {_eq: "LastDayOfEvaluation"}${where_training_matrix_list_aggregate}}){
            aggregate {
                count
            }
        }
    `;
};
//</editor-fold>

//<editor-fold desc="training_plan_stats_frequency_vertical_bar_chart_fragment">
export const training_plan_stats_frequency_vertical_bar_chart_fragment = ({range_start, range_end}) => {
	return `
        #id
        
        #TODO: fix date range
        status_not_started_aggregate:training_matrix_list_aggregate(where: {completion_status: {_eq: "Not Started"}}){
            aggregate {
                sum {
                  cost
                }
            }
        }
        #TODO: fix date range
        status_outstanding_aggregate:training_matrix_list_aggregate(where: {completion_status: {_eq: "Outstanding"}}){
            aggregate{
                sum {
                  cost
                }
            }
        }
	`;
};
// ${dates.map((date, n) => (`
//         overall_cost_${n+1}: training_matrix_list_aggregate(where: {
//     date_range_start: {_gte: "${date.start}"}, date_range_end: {_lte: "${date.end}"}
// }) {
//     aggregate {
//         sum {
//             cost
//         }
//     }
// }
// `))}
//</editor-fold>