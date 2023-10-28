require('./templates');

const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');

eventManager.on("inspections/findById", findByIdImpl);

eventManager.on("inspections/listTodayByLogged", async (socket, data) => {
    const {asset_id, today} = data;

    data.client_filter = [`schedule_date: {_eq: "${today}"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listUnansweredByLogged", async (socket, data) => {
    const {asset_id, today} = data;

    const unansweredFilter = (level = 3) => {
        return `
			_and:[
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_eq: 0}
					  filter:{
						answer: {_is_null: false}
					  }
					}
				  }
				},
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_eq: 0}
					  filter:{
						answer_employee_id: {_is_null: false}
					  }
					}
				  }
				},
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_eq: 0}
					  filter:{
						answer_asset_id: {_is_null: false}
					  }
					}
				  }
				},
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_eq: 0}
					  filter:{
						options: {answer: {_is_null: false}}
					  }
					}
				  }
				}
				${level > 1 ? `,
				{
          		  question_list_aggregate: {
            	    count: {
              		  predicate: {_eq: 0}
					  filter:{
						question_list: {
						  ${unansweredFilter(level - 1)},
						}
					  }
					}
 			      }
                }` : ""
        }
			]
		`;
    };

    data.client_filter = [
        `schedule_date: {_lt: "${today}"}`,
        unansweredFilter(3)
    ];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listUpcomingByLogged", async (socket, data) => {
    const {asset_id, today} = data;

    data.client_filter = [`schedule_date: {_gt: "${today}"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listCompletedByLogged", async (socket, data) => {
    const {asset_id} = data;
    data.client_filter = [`status: {_eq: "CompleteAccepted"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listActiveByLogged", async (socket, data) => {
    const {asset_id} = data;

    const answeredFilter = (level = 3) => {
        return `
		_and: [
			{_or:[
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_gt: 0}
					  filter:{
						answer: {_is_null: false}
					  }
					}
				  }
				},
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_gt: 0}
					  filter:{
						answer_employee_id: {_is_null: false}
					  }
					}
				  }
				},
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_gt: 0}
					  filter:{
						answer_asset_id: {_is_null: false}
					  }
					}
				  }
				},
				{
				  question_list_aggregate: {
					count: {
					  predicate: {_gt: 0}
					  filter:{
						options: {answer: {_is_null: false}}
					  }
					}
				  }
				}
				${level > 1 ? `,
				{
          		  question_list_aggregate: {
            	    count: {
              		  predicate: {_gt: 0}
					  filter:{
						question_list: {
						  ${answeredFilter(level - 1)},
						}
					  }
					}
 			      }
                }` : ""
        }
			]}
		]
		`;
    };

    data.client_filter = [
        `status: {_neq: "CompleteAccepted"}`,
        answeredFilter(3)
    ];

    if(asset_id) {
        data.client_filter.push(`,\nasset_id: {_eq: ${asset_id}}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});
