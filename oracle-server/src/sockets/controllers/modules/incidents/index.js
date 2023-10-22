require('./incidents-quick');

const listImpl = require('./listImpl');

eventManager.on("incidents/listTodayByLogged", async (socket, data) => {
    const {today} = data;

    data.client_filter = `schedule_date: {_eq: "${today}"},`;
    return listImpl(socket, data);
});

eventManager.on("incidents/listUnansweredByLogged", async (socket, data) => {
    const {today} = data;

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
    ].join(',\n');

    return listImpl(socket, data);
});

eventManager.on("incidents/listUpcomingByLogged", async (socket, data) => {
    const {today} = data;

    data.client_filter = `schedule_date: {_gt: "${today}"},`;
    return listImpl(socket, data);
});

eventManager.on("incidents/listCompletedByLogged", async (socket, data) => {
    data.client_filter = `status: {_eq: "CompleteAccepted"},`;
    return listImpl(socket, data);
});

eventManager.on("incidents/listActiveByLogged", async (socket, data) => {

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
    ].join(',\n');

    return listImpl(socket, data);
});
