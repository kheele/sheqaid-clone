import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {
	incident_investigation_cause_analysis_immediate_fragment, incident_investigation_cause_analysis_root_fragment
} from "../../../InvestigationsTab/Query/Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		// status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		// status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listAllIncidentsByLoggedQuery {
        sheq_incident_investigation(
          where: {
            removed: {_eq: ${removed}},
            ${filter},
            investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{id:{_is_null: false}}}}}}
          },
	        order_by: {incident_date: desc, incident_time: desc, group: asc, short_desc: asc},
	        offset: ${offset},
	        limit: ${limit}
        ) {   
            id
        	group
            incident_date
            short_desc
            location
            exact_location
            #
            category_list{
				category{
				  id
				  name
				}
			}
            sub_category_list{
				sub_category{
				  id
				  name
				  category{
					id
					name
				  }
				}
			}
            sector_list{
				id
				sector{
				  id
				  name
				}
			}
            activity_list{
            	id
				activity{
				  id
				  name
				  sector{
					id
					name
				  }
				}
            }   
			investigation{
			  id
			  cause_analysis{
				id
				immediate_analysis{
				  ${incident_investigation_cause_analysis_immediate_fragment}
				}
				root_analysis{
				  ${incident_investigation_cause_analysis_root_fragment}
				}
			  }
			}
            ${orgs_fragment}
        }
      }
    `,
	});//.then(fillNullLists);
	//</editor-fold>
};