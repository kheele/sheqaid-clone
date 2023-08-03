import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";

export default (
	{
		written_off = false, //
		date_range = {}, //
		site_id, project_id, client_id, company_id,
	}
) => {
	const id = site_id || project_id || client_id || company_id;
	let tbl;
	if (site_id) {
		tbl = "default_sites";
	} else if (project_id) {
		tbl = "default_projects";
	} else if (client_id) {
		tbl = "default_clients";
	} else {
		tbl = "default_companies";
	}

	const {start, end} = date_range;
	const monStart = start || new Date().addMonths(-12);
	const monEnd = end || new Date();

	const datesOnlyPrev = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

	const dateRangeOnlyPrevQueries = datesOnlyPrev.map(async date => {
		const {year, month, start, end} = date;
		return GQLClient
		.query({
			query: `
				query findByIdOrgAssetDashboardQuery_dateRangeOnlyPrev_${year}_${month} {
	        ${tbl}(
	          where: {
	            id: {_eq: ${id}}
	          }
	        ) {
						_${year}_${month}__prev_service_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {plan_list: {service_date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_calibration_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {calibration_list: {calibration_date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_monitoring_plan_fuel_usage_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, monitoring_plan_list: {fuel_usage_list: {date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_monitoring_plan_working_distance_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, monitoring_plan_list: {working_distance_or_time_list: {date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__prev_monitoring_plan_working_time_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, monitoring_plan_list: {working_distance_or_time_list: {date: {_gte: "${start}", _lte: "${end}"}}}}) {
							aggregate {
							  count
							}
						}
				  }
	      }
	    `,
		});
	});

	const dateRangeQueries = dates.map(async date => {
		const {year, month, start, end} = date;
		return GQLClient
		.query({
			query: `
				query findByIdOrgAssetDashboardQuery_dateRange_${year}_${month} {
	        ${tbl}(
	          where: {
	            id: {_eq: ${id}}
	          }
	        ) {
				    _${year}_${month}__next_calibration_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_gte: "${start}", _lte: "${end}"}}}) {
							aggregate {
							  count
							}
						}
						_${year}_${month}__doc_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_gte: "${start}", _lte: "${end}"}}}) {
							aggregate {
							  count
							}
						}
				  }
	      }
	    `,
		});
	});

	const mon = Dates.formatDateSQL(new Date().addMonths(1));
	const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
	const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

	//<editor-fold desc="ByEach">
	return Promise.all([
		GQLClient
		.query({
			query: `
      query findByIdOrgAssetDashboardQuery {
        ${tbl}(
          where: {
            id: {_eq: ${id}}
          }
        ) {
			    #
			    all_asset_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    removed_asset_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    condition_new_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "New"}}}) {
			      aggregate {
			        count
			      }
			    }
			    condition_good_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Good"}}}) {
			      aggregate {
			        count
			      }
			    }
			    condition_fair_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Fair"}}}) {
			      aggregate {
			        count
			      }
			    }
			    condition_poor_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Poor"}}}) {
			      aggregate {
			        count
			      }
			    }
			    condition_scrap_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_eq: "Scrap"}}}) {
			      aggregate {
			        count
			      }
			    }
			    condition_non_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, asset_detail: {condition: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    status_in_storage_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "In Storage"}}) {
			      aggregate {
			        count
			      }
			    }
			    status_checked_out_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "Checked Out"}}) {
			      aggregate {
			        count
			      }
			    }
			    status_loaned_out_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "Loaned Out"}}) {
			      aggregate {
			        count
			      }
			    }
			    status_out_for_repair_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_eq: "Out For Repair"}}) {
			      aggregate {
			        count
			      }
			    }
			    status_non_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, status: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    
          #
			    next_service_reason_for_service_due_date_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {plan_list: {reason_for_service: {_eq: "Due Date"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_service_reason_for_service_mechanical_failure_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {plan_list: {reason_for_service: {_eq: "Mechanical Failure"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_service_reason_for_service_wear_and_tear_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {plan_list: {reason_for_service: {_eq: "Wear And Tear"}}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_service_reason_for_service_non_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {plan_list: {reason_for_service: {_is_null: true}}}}) {
			      aggregate {
			        count
			      }
			    }
    
			    #
			    next_service_non_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {next_service_hrs_or_km: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_service_expired_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {expired_service_hrs_or_km: {_eq: true}}}) {
			     aggregate {
			       count
			     }
			    }
			    next_service_expired_25_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {percentage_left_service_hrs_or_km: {_gt: 0, _lte: 25}}}) {
			     aggregate {
			       count
			     }
			    }
			    next_service_expired_50_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {percentage_left_service_hrs_or_km: {_gt: 25, _lte: 50}}}) {
			     aggregate {
			       count
			     }
			    }
			    next_service_expired_75_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {percentage_left_service_hrs_or_km: {_gt: 50, _lte: 75}}}) {
			     aggregate {
			       count
			     }
			    }
			    next_service_expired_100_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_list: {percentage_left_service_hrs_or_km: {_gt: 75, _lte: 100}}}) {
			     aggregate {
			       count
			     }
			    }
          
			    #
			    next_calibration_date_non_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_calibration_expired_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_lte: "now()"}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_calibration_mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_gt: "now()", _lte: "${mon}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_calibration_2mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_gt: "${mon}", _lte: "${mon2}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_calibration_3mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_gt: "${mon2}", _lte: "${mon3}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    next_calibration_4mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, calibration_record_list: {next_calibration_date: {_gt: "${mon3}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    
    			#
			    doc_non_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_expired_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_lte: "now()"}}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_gt: "now()", _lte: "${mon}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_2mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_gt: "${mon}", _lte: "${mon2}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_3mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_gt: "${mon2}", _lte: "${mon3}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    doc_4mon_expiry_list_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, doc_list: {expiry: {_gt: "${mon3}"}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    maintenance_plan_cost_aggregate: asset_list_aggregate(where: {written_off: {_eq: false}, maintenance_plan_cost: {_is_null: false}}) {
      			nodes{
              maintenance_plan_cost
            }
			    }
			  }
      }
    `,
		}),
		...dateRangeOnlyPrevQueries,
		...dateRangeQueries,
	]).then(res => res.reduce((a1, a2) => [...a1, ...a2], []));
	//</editor-fold>
};