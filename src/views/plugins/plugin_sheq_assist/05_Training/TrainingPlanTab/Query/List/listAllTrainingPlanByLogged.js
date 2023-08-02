import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {employee_personal_details_fragment, orgs_fragment, orgs_id_fragment} from "graphql/Fragments";
import {training_plan_details_fragment} from "../Fragments";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import findByIdJobPosition from "mutations/all/JobPosition/findByIdJobPosition";
import findByIdTrainingCourse from "mutations/all/TrainingCourse/findByIdTrainingCourse";
import WebWorker from "web-worker/WebWorker";
import {toJS} from "mobx";

export default (
	{
		offset = 0,
		limit = 50,
		//
		completion_status,
		result_status,
		result,
		date_range,
		course_id,
		training_id,
		trainer_id,
		job_position_id,
		employee_id,
		year,
		//
		view = 'Course',
		employee_view = 'active',
		target_view,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		completion_status,
		result_status,
		result,
		date_range,
		course_id,
		training_id,
		trainer_id,
		job_position_id,
		employee_id,
		year,
		//
		view,
		employee_view,
		target_view,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	const {id, target} = target_view || {};

	const fillNullLists = async (list) => {
		const worker = new WebWorker(() => {
			Events.on("process", async (_, {view, target, list}) => {
				return Promise.all(list.map(async v => {
					!v.list && (v.list = []);
					!v.status_not_started && (v.status_not_started = 0);
					!v.status_outstanding && (v.status_outstanding = 0);
					!v.status_in_progress && (v.status_in_progress = 0);
					!v.status_completed && (v.status_completed = 0);

					if (view === 'Employee' || target === 'employee') {
						!v.attendance_list && (v.attendance_list = []);
						!v.course_list && (v.course_list = []);
						!v.year_list && (v.year_list = []);
						!v.training_list && (v.training_list = []);

						v.group = await Events.emit("findByIdEmployee", v.group);
						return v;
					} else if (view === 'Job Position' || target === 'job_position') {
						!v.attendance_list && (v.attendance_list = []);
						!v.course_list && (v.course_list = []);
						!v.employee_list && (v.employee_list = []);
						!v.year_list && (v.year_list = []);
						!v.training_list && (v.training_list = []);

						v.group = await Events.emit("findByIdJobPosition", v.group);
						return v;
					} else if (view === 'Course' || target === 'course') {
						!v.attendance_list && (v.attendance_list = []);
						!v.year_list && (v.year_list = []);
						!v.employee_list && (v.employee_list = []);
						!v.job_position_list && (v.job_position_list = []);
						!v.training_list && (v.training_list = []);

						v.group = await Events.emit("findByIdTrainingCourse", v.group);
						return v;
					} else if (view === 'Year' || target === 'year') {
						!v.attendance_list && (v.attendance_list = []);
						!v.course_list && (v.course_list = []);
						!v.employee_list && (v.employee_list = []);
						!v.job_position_list && (v.job_position_list = []);
						!v.training_list && (v.training_list = []);

						return v;
					}
				}));
			});
		});
		worker.on("findByIdEmployee", findByIdEmployee);
		worker.on("findByIdJobPosition", findByIdJobPosition);
		worker.on("findByIdTrainingCourse", findByIdTrainingCourse);
		list = await worker.emit("process", {view, target, list: toJS(list)});
		worker.terminate();
		return list;
	};

	if (target === 'employee') {
		return GQLClient
		.query({
			query: `
                    query listOneGroupByEmployeePlanByLoggedQuery {
                        hr_employees(
                            where: { 
                                id: {_eq: ${id}}, 
                            },
                        ) {
                                id
                                lname
                                fname
                                profile_pic
                                job_position{
                                  id
                                  name
                                }
                            course_list_count: training_plan_list_aggregate {
                              aggregate {
                                count(distinct: true, columns: course_id)
                              }
                            }
                            year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
                              year
                            }
                            completion_status_not_started_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Not Started"}}) {
                              aggregate {
                                count
                              }
                            }
                            completion_status_outstanding_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Outstanding"}}) {
                              aggregate {
                                count
                              }
                            }
                            completion_status_in_progress_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "In Progress"}}) {
                              aggregate {
                                count
                              }
                            }
                            completion_status_completed_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}}) {
                              aggregate {
                                count
                              }
                            }
                            results_passed_list_count: training_plan_list_aggregate(where: {result: {_gte: 50}}) {
                              aggregate {
                                count
                              }
                            }
                            results_failed_list_count: training_plan_list_aggregate(where: {result: {_lt: 50}}) {
                              aggregate {
                                count
                              }
                            }
                            results_status_passed_list_count: training_plan_list_aggregate(where: {result_status: {_eq: "Passed"}}) {
                              aggregate {
                                count
                              }
                            }
                            results_status_failed_list_count: training_plan_list_aggregate(where: {result_status: {_eq: "Failed"}}) {
                              aggregate {
                                count
                              }
                            }
                            results_average_list_count: training_plan_list_aggregate {
                              aggregate {
                                avg {
                                  result
                                }
                              }
                            }
                            ${orgs_id_fragment}
                        }
                    }
                `,
		});//.then(fillNullLists);
	} else if (target === 'job_position') {
		return GQLClient
		.query({
			query: `
                    query listOneGroupByJobPositionPlanByLoggedQuery {
                        sheq_training_plans_per_job_position(
                            where: {
                                group: {_eq: ${id}}, 
                            }
                        ) {
                            group
                            attendance_list
                            course_list
                            year_list
                            training_list
                            employee_list
                            ${training_plan_details_fragment}
                            ${orgs_id_fragment}
                        }
                    }
                `,
		}).then(fillNullLists);
	} else if (target === 'course') {
		return GQLClient
		.query({
			query: `
                    query listOneGroupByCoursePlanByLoggedQuery {
                        sheq_training_courses(
                            where: {
                                id: {_eq: ${id}}
                            }
                        ) {
                            id
                                name
                                job_position_list_count: job_position_list_aggregate {
                                  aggregate {
                                    count
                                  }
                                }
                                training_cost: training_matrix_list_aggregate {
                                  aggregate {
                                    sum {
                                      cost
                                    }
                                  }
                                }
                                employee_list_count: training_plan_list_aggregate {
                                  aggregate {
                                    count(distinct: true, columns: employee_id)
                                  }
                                }
                                training_list_count: training_matrix_list_aggregate {
                                  aggregate {
                                    count
                                  }
                                }
                                year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
                                  year
                                }
                                completion_status_not_started_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Not Started"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_outstanding_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Outstanding"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_in_progress_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "In Progress"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_completed_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Completed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_passed_list_count: training_plan_list_aggregate(where:{result:{_gte: 50}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_failed_list_count: training_plan_list_aggregate(where:{result:{_lt: 50}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_status_passed_list_count: training_plan_list_aggregate(where:{result_status:{_eq: "Passed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_status_failed_list_count: training_plan_list_aggregate(where:{result_status:{_eq: "Failed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_average_list_count: training_plan_list_aggregate {
                                  aggregate {
                                    avg{
                                      result
                                    }
                                  }
                                }
                                
                            ${orgs_id_fragment}
                        }
                    }
                `,
		});//.then(fillNullLists);
	} else if (target === 'year') {
		return GQLClient
		.query({
			query: `
                    query listOneGroupByYearPlanByLoggedQuery {
                        sheq_training_plans_per_year(
                            where: {
                                group: {_eq: ${id}}
                            }
                        ) {
                            group
                            attendance_list
                            course_list
                            training_list
                            employee_list
                            job_position_list
                            ${training_plan_details_fragment}
                            ${orgs_id_fragment}
                        }
                    }
                `,
		}).then(fillNullLists);
	} else {
		if (view === 'Employee') {
			//<editor-fold desc="ByGroup">
			return GQLClient
			.query({
				query: `
                        query listAllGroupByEmployeePlanByLoggedQuery {
                            hr_employees(
                                where: {
                                    ${filter}
                                },  
                                order_by: [{lname: asc_nulls_last}, {fname: asc_nulls_last}],
                                offset: ${offset},
                                limit: ${limit}
                            ) {
                                id
                                lname
                                fname
                                profile_pic
                                job_position{
                                  id
                                  name
                                }
                                course_list_count: training_plan_list_aggregate {
                                  aggregate {
                                    count(distinct: true, columns: course_id)
                                  }
                                }
                                year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
                                  year
                                }
                                completion_status_not_started_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Not Started"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_outstanding_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Outstanding"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_in_progress_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "In Progress"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_completed_list_count: training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_passed_list_count: training_plan_list_aggregate(where: {result: {_gte: 50}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_failed_list_count: training_plan_list_aggregate(where: {result: {_lt: 50}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_status_passed_list_count: training_plan_list_aggregate(where: {result_status: {_eq: "Passed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_status_failed_list_count: training_plan_list_aggregate(where: {result_status: {_eq: "Failed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_average_list_count: training_plan_list_aggregate {
                                  aggregate {
                                    avg {
                                      result
                                    }
                                  }
                                }
                                ${orgs_id_fragment}
                            }
                        }
                    `,
			});//.then(fillNullLists);
			//</editor-fold>
		} else if (view === 'Job Position') {
			//<editor-fold desc="ByGroup">
			return GQLClient
			.query({
				query: `
                        query listAllGroupByJobPositionPlanByLoggedQuery {
                            sheq_training_plans_per_job_position(
                                where: {
            ${filter}
                                },  
                                #order_by: [{group: {name: asc_nulls_last}}],
                                offset: ${offset},
                                limit: ${limit}
                            ) {
                                group
                                attendance_list
                                course_list
                                year_list
                                training_list
                                employee_list
                                ${training_plan_details_fragment}
                                ${orgs_id_fragment}
                            }
                        }
                    `,
			}).then(fillNullLists);
			//</editor-fold>
		} else if (view === 'Course') {
			//<editor-fold desc="ByGroup">
			return GQLClient
			.query({
				query: `
                        query listAllGroupByCoursePlanByLoggedQuery {
                            sheq_training_courses(
                                where: {
            ${filter}
                                },  
                                order_by: [{name: asc_nulls_last}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}],
                                offset: ${offset},
                                limit: ${limit}
                            ) {
                                id
                                name
                                job_position_list_count: job_position_list_aggregate {
                                  aggregate {
                                    count
                                  }
                                }
                                training_cost: training_matrix_list_aggregate {
                                  aggregate {
                                    sum {
                                      cost
                                    }
                                  }
                                }
                                employee_list_count: training_plan_list_aggregate {
                                  aggregate {
                                    count(distinct: true, columns: employee_id)
                                  }
                                }
                                training_list_count: training_matrix_list_aggregate {
                                  aggregate {
                                    count
                                  }
                                }
                                year_list: training_plan_list(distinct_on: year, order_by: {year: asc}) {
                                  year
                                }
                                completion_status_not_started_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Not Started"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_outstanding_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Outstanding"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_in_progress_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "In Progress"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                completion_status_completed_list_count: training_plan_list_aggregate(where:{completion_status:{_eq: "Completed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_passed_list_count: training_plan_list_aggregate(where:{result:{_gte: 50}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_failed_list_count: training_plan_list_aggregate(where:{result:{_lt: 50}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_status_passed_list_count: training_plan_list_aggregate(where:{result_status:{_eq: "Passed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_status_failed_list_count: training_plan_list_aggregate(where:{result_status:{_eq: "Failed"}}) {
                                  aggregate {
                                    count
                                  }
                                }
                                results_average_list_count: training_plan_list_aggregate {
                                  aggregate {
                                    avg{
                                      result
                                    }
                                  }
                                }
                                
                                ${orgs_id_fragment}
                            }
                        }
                    `,
			});//.then(fillNullLists);
			//</editor-fold>
		} else if (view === 'Year') {
			//<editor-fold desc="ByGroup">
			return GQLClient
			.query({
				query: `
                        query listAllGroupByYearPlanByLoggedQuery {
                            sheq_training_plans_per_year(
                                where: {
            ${filter}
                                },  
                                order_by: [{group: asc_nulls_last}],
                                offset: ${offset},
                                limit: ${limit}
                            ) {
                                group
                                attendance_list
                                course_list
                                training_list
                                job_position_list
                                employee_list
                                ${training_plan_details_fragment}
                                ${orgs_id_fragment}
                            }
                        }
                    `,
			}).then(fillNullLists);
			//</editor-fold>
		} else {
			//<editor-fold desc="ByEach">
			return GQLClient
			.query({
				query: `
                    query listAllTrainingPlanByLoggedQuery {
                        sheq_training_plans__employee_training(
                            where: {
                                ${filter},
                            },  
                            offset: ${offset},
                            limit: ${limit}
                        ) {
                            id
                            created_at
                            completion_status
                            result_status
                            result
                            
                            year
                            
                            employee{
                                ${employee_personal_details_fragment}
                            }
                            course {
                                id
                                name
                            }
                            # job_position {
                            #     id
                            #     name
                            # }
                            training {
                                id
                                course {
                                    id
                                    name
                                }
                            }
                            ${orgs_fragment}
                        }
                    }
                `,
			});
			//</editor-fold>
		}
	}
};