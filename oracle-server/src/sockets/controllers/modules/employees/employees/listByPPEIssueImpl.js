const {orgs_fragment, employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons-ppe-issue');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		id,
		incContractors = false,
		employee_list,
		team_list,
		department_list,
		job_position_list,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		id,
		//
		incContractors,
		employee_list,
		team_list,
		department_list,
		job_position_list,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	// return listGraphQL({
	// 	query: `
	// 		query listAllEmployeesByLoggedQuery {
	// 			proxy_employee__ppe_type(
	// 			  where: {
	// 					employee: {
	// 						removed: {_eq: ${removed}},
	// 						${filter}
	// 					}
	// 			  },
	//         order_by: {employee: {lname: asc}},
	// 				offset: ${offset},
	// 				${limit > 0 ? `limit: ${limit}` : ''}
	// 			) {
  //         employee{
  //           ${employee_personal_details_fragment}
  //           ${incContractors ? `
	//           contractor {
	//             id
	//             name
	//           }` : ''}
	//           ${orgs_fragment}
  //         }
  //         ppe_type{
  //           id
  //           name
  //           is_issued
  //           ppe_item_list{
  //             id
  //           }
  //         }
	// 			}
	// 		}
	// 	`,
	// 	operationName: "listAllEmployeesByLoggedQuery",
	// });
	
	return listGraphQL({
		query: `
			query listAllEmployeesByLoggedQuery {
				hr_employees(
				  where: {
						removed: {_eq: false},
						${filter}
				  },
	        order_by: {lname: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
          ${employee_personal_details_fragment}
          
          ppe_type_list(where: {ppe_type: {removed: {_eq: false}}}){
            id
            created_at
            ppe_type{
              id
              name
              profile_pic
              unit
              duration_type
              duration_value
              notes
              #ppe_item_list{
		            #id
		            #ppe_item{id created_at ppe_condition assignment_status date_assigned is_issued}
		          #}
            }
            is_issued
          }
          #ppe_item_list{
            #id
            #ppe_item{id created_at ppe_condition assignment_status date_assigned is_issued}
          #}
          
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
				}
			}
		`,
		operationName: "listAllEmployeesByLoggedQuery",
	});
}
//</editor-fold>
