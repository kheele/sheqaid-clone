// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import findEmployeesByJobPosition from "./findEmployeesByJobPosition";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollectCourses">
class ValidateAndCollectCourses {

    static valid(newTrainingCourseListTableForm) {
        if (!newTrainingCourseListTableForm.isValid('course_or_module_list')) {
            infoDialog.open('At least 1 Course is required');
            return;
        }
        const course_or_module_list = newTrainingCourseListTableForm.get('course_or_module_list');
        for (let n = 0; n < course_or_module_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newJobPositionListTableWrapper,
                    newTrainingYearListTableWrapper,
                    select_employees,
                },
                course_or_module: {id},
            } = course_or_module_list[n];

            if (!select_employees.hasValue) {
                infoDialog.open(<div className="text-left">
                    One of these options:<br/>
                    1. Job Position(s);<br/>
                    1. Year(s)]<br/>
                    is required
                </div>);
                return;
            }

            if (select_employees.value === 'JobPositions') {
                const {form, form: {formData}} = newJobPositionListTableWrapper;
                if (!form.isValid(`job_position_list__${id}`)) {
                    infoDialog.open('At least 1 Job Position is required');
                    return;
                }
                const job_position_list = form.get(`job_position_list__${id}`);
                for (let n = 0; n < job_position_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newTrainingCourseListTableWrapper,
                            newTrainingYearListTableWrapper,
                        },
                        job_position: {id},
                    } = job_position_list[n];

                    if(!newTrainingYearListTableWrapper) {
                        infoDialog.open('At least 1 Year is required');
                        return;
                    }

                    const {form, form: {formData}} = newTrainingYearListTableWrapper;

                    if (!form.isValid(`training_year_list__${id}`)) {
                        infoDialog.open('At least 1 Year is required');
                        return;
                    }
                }
            } else if (select_employees.value === 'Years') {
                const {form, form: {formData}} = newTrainingYearListTableWrapper;
                if (!form.isValid(`training_year_list__${id}`)) {
                    infoDialog.open('At least 1 Year is required');
                    return;
                }
                const training_year_list = form.get(`training_year_list__${id}`);
                for (let n = 0; n < training_year_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newJobPositionListTableWrapper,
                            newTrainingCourseListTableWrapper,
                        },
                        year,
                    } = training_year_list[n];

                    if(!newJobPositionListTableWrapper) {
                        infoDialog.open('At least 1 Job Position is required');
                        return;
                    }

                    const {form, form: {formData}} = newJobPositionListTableWrapper;

                    if (!form.isValid(`job_position_list__${year}`)) {
                        infoDialog.open('At least 1 Job Position is required');
                        return;
                    }
                }
            }
        }

        return true;
    }

    static async collect(data, newTrainingCourseListTableForm) {
        data.plan_list = [];
        const {plan_list} = data;

        const course_or_module_list = newTrainingCourseListTableForm.get('course_or_module_list');
        for (let n = 0; n < course_or_module_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newJobPositionListTableWrapper,
                    newTrainingYearListTableWrapper,
                    select_employees,
                },
                course_or_module: {id: course_or_module_id, data: {name: course_or_module_name}},
            } = course_or_module_list[n];

            if (select_employees.value === 'JobPositions') {
                const {form, form: {formData}} = newJobPositionListTableWrapper;
                const job_position_list = form.get(`job_position_list__${course_or_module_id}`);
                for (let n = 0; n < job_position_list.length; n++) {
                    const {
                        ctrl_refs: {
                            employee_list_exception,
                            newTrainingCourseListTableWrapper,
                            newTrainingYearListTableWrapper: {
                                form, form: {formData}
                            },
                        },
                        job_position: {id: job_position_id, data: {name: job_position_name}},
                    } = job_position_list[n];

                    let employee_list = await findEmployeesByJobPosition(job_position_id);
                    if(employee_list_exception && !employee_list_exception.list.isEmpty()) {
                        employee_list = employee_list.filter(({id}) => employee_list_exception.list.noneMatch(({id: _id}) => id === _id));
                    }

                    const training_year_list = form.get(`training_year_list__${job_position_id}`).map(({year}) => year);
                    training_year_list.forEach(year => {
                        employee_list.forEach(({id: employee_id, data: {fname, lname}}) => {
                            const values = {};

                            values.status = 'Not Started';
                            values.employee = {id: employee_id, fname, lname};
                            values.course_or_module = {id: course_or_module_id, name: course_or_module_name};
                            values.job_position = {id: job_position_id, name: job_position_name};
                            values.year = year;

                            data.plan_list.push(values);
                        });
                    });
                }
            } else if (select_employees.value === 'Years') {
                const {form, form: {formData}} = newTrainingYearListTableWrapper;
                const training_year_list = form.get(`training_year_list__${course_or_module_id}`);

                for (let n = 0; n < training_year_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newJobPositionListTableWrapper: {
                                form, form: {formData}
                            },
                            newTrainingCourseListTableWrapper,
                        },
                        year,
                    } = training_year_list[n];

                    const job_position_list = form.get(`job_position_list__${year}`);
                    await Promise.all(job_position_list.map(async (
                        {
                            employee_list_exception,
                            job_position: {
                                id: job_position_id,
                                data: {name: job_position_name}
                            }
                        }
                    ) => {
                        let employee_list = await findEmployeesByJobPosition(job_position_id);
                        if(employee_list_exception && !employee_list_exception.list.isEmpty()) {
                            employee_list = employee_list.filter(({id}) => employee_list_exception.list.noneMatch(({id: _id}) => id === _id));
                        }

                        employee_list.forEach(({id: employee_id, data: {fname, lname}}) => {
                            const values = {};

                            values.status = 'Not Started';
                            values.employee = {id: employee_id, fname, lname};
                            values.course_or_module = {id: course_or_module_id, name: course_or_module_name};
                            values.job_position = {id: job_position_id, name: job_position_name};
                            values.year = year;

                            data.plan_list.push(values);
                        });
                    }));
                }
            }
        }
    }
}

// </editor-fold>

export default ValidateAndCollectCourses;