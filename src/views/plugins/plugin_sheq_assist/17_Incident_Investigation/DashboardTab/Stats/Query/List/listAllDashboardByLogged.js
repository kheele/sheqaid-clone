import GQLClient from "graphql/GQLClient";
import {Dates} from "utils/Dates";

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
	let tbl;
	if(site_id) {
		tbl = "default_sites";
	} else if(project_id) {
		tbl = "default_projects";
	} else if(client_id) {
		tbl = "default_clients";
	} else {
		tbl = "default_companies";
	}

	const {start, end} = date_range;
	const monStart = start || new Date().addMonths(-12);
	const monEnd = end || new Date();

	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	const dateRangeQueries = dates.map(date => {
		const {year, month, start, end} = date;
		return `
			_${year}_${month}__all_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}}) {
				aggregate {
				  count
				} 
			}
			_${year}_${month}__person_injured_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
				aggregate {
				  count
				} 
			}
			_${year}_${month}__group_lti_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, group: {_eq: "Reportable (LTI)"}}) {
			  aggregate {
				  count
				} 
			} 
			_${year}_${month}__firstaid_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "First Aid"}}}}) {
			  aggregate {
			    count
			  }
			}  
			_${year}_${month}__nearmiss_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "Near miss"}}}}) {
			  aggregate {
			    count
			  }
			} 
			_${year}_${month}__fatality_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, sub_category_list: {sub_category: {name: {_eq: "Fatality"}}}}) {
			  aggregate {
				  count
				} 
			} 
			_${year}_${month}__vehicle_incident_list_aggregate: incident_list_aggregate(where: {incident_date: {_gte: "${start}", _lte: "${end}"}, removed: {_eq: false}, is_vehicle_incident: {_eq: true}}) {
			  aggregate {
				  count
				} 
			} 
		`;
	}).join('\n');

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query findByIdOrgIncidentsDashboardQuery {
        ${tbl}(
          where: {
            id: {_eq: ${id}}
          }
        ) {
			    #
			    all_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    all_quick_incident_list_aggregate: quick_incident_list_aggregate(where: {removed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    all_investigation_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, investigation_id: {_is_null: false}}) {
			      aggregate {
			        count
			      }
			    }
			    all_non_conformance_list_aggregate: non_conformance_list_aggregate(where: {removed: {_eq: false}, source: {_eq: "Incident Investigation"}}) {
			      aggregate {
			        count
			      }
			    }
			    # all_corrective_action_list_aggregate: corrective_actions(where: {removed: {_eq: false}, investigation_id: {_is_null: false}}) {
			    #   aggregate {
			    #     count
			    #   }
			    # }
			    
			    #
			    risk_rating_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "N/A"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_low_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "Low"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_medium_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "Medium"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_high_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "High"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_rating_extreme_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, severity: {risk_rating: {_eq: "Extreme"}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    status_open_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, status_closed: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    } 
			    status_closed_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, status_closed: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }  
			    #
			    group_lti_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, group: {_eq: "Reportable (LTI)"}}) {
			      aggregate {
			        count
			      }
			    } 
			    group_nlti_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, group: {_eq: "Non-Reportable (NLTI)"}}) {
			      aggregate {
			        count
			      }
			    } 
			    firstaid_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "First Aid"}}}}) {
			      aggregate {
			        count
			      }
			    } 
			    nearmiss_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, sub_category_list: {sub_category:{name: {_eq: "Near miss"}}}}) {
			      aggregate {
			        count
			      }
			    }   
			    group_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, group: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }  
			    #
			    vehicle_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    } 
			    non_vehicle_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, is_vehicle_incident: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }   
			    #
			    person_injured_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, _or: [{person_injured_other_id: {_is_null: false}}, {person_injured_id: {_is_null: false}}]}) {
			      aggregate {
			        count
			      }
			    } 
			    non_person_injured_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, _and: [{person_injured_other_id: {_is_null: true}}, {person_injured_id: {_is_null: true}}]}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    time_shift_day_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Day"}}) {
			      aggregate {
			        count
			      }
			    } 
			    time_shift_night_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_eq: "Night"}}) {
			      aggregate {
			        count
			      }
			    }
			    time_shift_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, time_shift: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    incident_time_morning_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, incident_time: {_lt: "12:00"}}) {
			      aggregate {
			        count
			      }
			    } 
			    incident_time_afternoon_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, incident_time: {_gte: "12:00"}}) {
			      aggregate {
			        count
			      }
			    }
			    incident_time_non_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, incident_time: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    #
			    fatality_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, sub_category_list: {sub_category: {name: {_eq: "Fatality"}}}}) {
			      aggregate {
			        count
			      }
			    } 
			    non_fatality_incident_list_aggregate: incident_list_aggregate(where: {removed: {_eq: false}, _or: [{sub_category_list_aggregate: {count: {predicate: {_eq: 0}}}}, {sub_category_list: {sub_category: {name: {_neq: "Fatality"}}}}]}) {
			      aggregate {
			        count
			      }
			    } 
			    ${dateRangeQueries}
			  }
      }
    `,
	});//.then(fillNullLists);
	//</editor-fold>
};