// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import findEmployeesByJobPosition from "./findEmployeesByJobPosition";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollectJobPositions">
class ValidateAndCollectJobPositions {

    static valid(newJobPositionListTableForm) {
        if (!newJobPositionListTableForm.isValid('job_position_list')) {
            infoDialog.open('At least 1 Job Position is required');
            return;
        }

        const job_position_list = newJobPositionListTableForm.get('job_position_list');
        for (let n = 0; n < job_position_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newTrainingCourseListTableWrapper,
                    newTrainingYearListTableWrapper,
                    select_employees,
                },
                job_position: {id},
            } = job_position_list[n];

            if (!select_employees.hasValue) {
                infoDialog.open(<div className="text-left">
                    One of these options:<br/>
                    1. Course(s);<br/>
                    1. Year(s)]<br/>
                    is required
                </div>);
                return;
            }

            if (select_employees.value === 'Courses') {
                const {form, form: {formData}} = newTrainingCourseListTableWrapper;
                if (!form.isValid(`course_or_module_list__${id}`)) {
                    infoDialog.open('At least 1 Course is required');
                    return;
                }
                const course_or_module_list = form.get(`course_or_module_list__${id}`);
                for (let n = 0; n < course_or_module_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newJobPositionListTableWrapper,
                            newTrainingYearListTableWrapper,
                        },
                        course_or_module: {id},
                    } = course_or_module_list[n];

                    if (!newTrainingYearListTableWrapper) {
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

                    if (!newTrainingCourseListTableWrapper) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }

                    const {form, form: {formData}} = newTrainingCourseListTableWrapper;

                    if (!form.isValid(`course_or_module_list__${year}`)) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }
                }
            }
        }

        return true;
    }

    static async collect(data, newJobPositionListTableForm) {
        data.plan_list = [];
        const {plan_list} = data;

        const job_position_list = newJobPositionListTableForm.get('job_position_list');
        for (let n = 0; n < job_position_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newTrainingCourseListTableWrapper,
                    newTrainingYearListTableWrapper,
                    select_employees,
                },
                job_position: {id: job_position_id, data: {name: job_position_name}},
            } = job_position_list[n];

            let employee_list = await findEmployeesByJobPosition(job_position_id);
            if (employee_list_exception && !employee_list_exception.list.isEmpty()) {
                employee_list = employee_list.filter(({id}) => employee_list_exception.list.noneMatch(({id: _id}) => id === _id));
            }

            for (let i = 0; i < employee_list.length; i++) {
                const {id: employee_id, data: {fname, lname}} = employee_list[n];
                const employee = {id: employee_id, fname, lname};

                if (select_employees.value === 'Courses') {
                    const {form, form: {formData}} = newTrainingCourseListTableWrapper;
                    const course_or_module_list = form.get(`course_or_module_list__${job_position_id}`);
                    for (let n = 0; n < course_or_module_list.length; n++) {
                        const {
                            ctrl_refs: {
                                newJobPositionListTableWrapper,
                                newTrainingYearListTableWrapper: {
                                    form, form: {formData}
                                },
                            },
                            course_or_module: {id: course_or_module_id, data: {name: course_or_module_name}},
                        } = course_or_module_list[n];

                        const training_year_list = form.get(`training_year_list__${course_or_module_id}`).map(({year}) => year);
                        training_year_list.forEach(year => {
                            const values = {};

                            values.status = 'Not Started';
                            values.employee = employee;
                            values.course_or_module = {id: course_or_module_id, name: course_or_module_name};
                            values.job_position = {id: job_position_id, name: job_position_name};
                            values.year = year;

                            data.plan_list.push(values);
                        });
                    }
                } else if (select_employees.value === 'Years') {
                    const {form, form: {formData}} = newTrainingYearListTableWrapper;
                    const training_year_list = form.get(`training_year_list__${job_position_id}`);
                    for (let n = 0; n < training_year_list.length; n++) {
                        const {
                            ctrl_refs: {
                                newJobPositionListTableWrapper,
                                newTrainingCourseListTableWrapper: {
                                    form, form: {formData}
                                },
                            },
                            year,
                        } = training_year_list[n];

                        const course_or_module_list = form.get(`course_or_module_list__${year}`).map(({course_or_module}) => course_or_module);
                        course_or_module_list.forEach((
                            {
                                id: course_or_module_id,
                                data: {name: course_or_module_name}
                            }
                        ) => {
                            const values = {};

                            values.status = 'Not Started';
                            values.employee = employee;
                            values.course_or_module = {id: course_or_module_id, name: course_or_module_name};
                            values.job_position = {id: job_position_id, name: job_position_name};
                            values.year = year;

                            data.plan_list.push(values);
                        });
                    }
                }
            }
        }
    }

}

// </editor-fold>

export default ValidateAndCollectJobPositions;