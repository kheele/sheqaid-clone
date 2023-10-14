import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {incident_investigation_details_fragment} from "../Fragments";

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

    const fillNullLists = (list) => list.map(v => {
        // !v.data.page_title_list && (v.data.page_title_list = []);
        // !v.data.question_list && (v.data.question_list = []);
        return v;
    });

    //<editor-fold desc="ByEach">
    return GQLClient
        .query({
            query: `
      query listAllIncidentInvestigationByLoggedQuery {
        sheq_incident_investigation(
          where: {
            removed: {_eq: ${removed}},
            ${filter},
            investigation_id: {_is_null: false},
          },
	        order_by: {incident_date: desc, incident_time: desc, group: asc, short_desc: asc},
	        offset: ${offset},
	        limit: ${limit}
        ) {
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
            	${incident_investigation_details_fragment}
            }
            ${orgs_fragment}
        }
      }
    `,
        });//.then(fillNullLists);
    //</editor-fold>
};