// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import findEmployeesByJobPosition from "./findEmployeesByJobPosition";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollectYears">
class ValidateAndCollectYears {

    static valid(newTrainingYearListTableForm) {
        if (!newTrainingYearListTableForm.isValid('training_year_list')) {
            infoDialog.open('At least 1 Year is required');
            return;
        }

        const year_list = newTrainingYearListTableForm.get('training_year_list');
        for (let n = 0; n < year_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newJobPositionListTableWrapper,
                    newTrainingCourseListTableWrapper,
                    select_employees,
                },
                year,
            } = year_list[n];

            if (!select_employees.hasValue) {
                infoDialog.open(<div className="text-left">
                    One of these options:<br/>
                    1. Job Position(s);<br/>
                    1. Course(s)]<br/>
                    is required
                </div>);
                return;
            }

            if (select_employees.value === 'JobPositions') {
                const {form, form: {formData}} = newJobPositionListTableWrapper;
                if (!form.isValid(`job_position_list__${year}`)) {
                    infoDialog.open('At least 1 Job Position is required');
                    return;
                }
                const job_position_list = form.get(`job_position_list__${year}`);
                for (let n = 0; n < job_position_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newTrainingCourseListTableWrapper,
                            newTrainingYearListTableWrapper,
                        },
                        job_position: {id},
                    } = job_position_list[n];

                    if(!newTrainingCourseListTableWrapper) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }

                    const {form, form: {formData}} = newTrainingCourseListTableWrapper;

                    if (!form.isValid(`course_or_module_list__${id}`)) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }
                }
            } else if (select_employees.value === 'Courses') {
                const {form, form: {formData}} = newTrainingCourseListTableWrapper;
                if (!form.isValid(`course_or_module_list__${year}`)) {
                    infoDialog.open('At least 1 Course is required');
                    return;
                }
                const course_or_module_list = form.get(`course_or_module_list__${year}`);
                for (let n = 0; n < course_or_module_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newJobPositionListTableWrapper,
                            newTrainingYearListTableWrapper,
                        },
                        course_or_module: {id},
                    } = course_or_module_list[n];

                    if(!newJobPositionListTableWrapper) {
                        infoDialog.open('At least 1 Job Position is required');
                        return;
                    }

                    const {form, form: {formData}} = newJobPositionListTableWrapper;

                    if (!form.isValid(`job_position_list__${id}`)) {
                        infoDialog.open('At least 1 Job Position is required');
                        return;
                    }
                }
            }
        }

        return true;
    }

    static async collect(data, newTrainingYearListTableForm) {
        data.plan_list = [];
        const {plan_list} = data;

        const year_list = newTrainingYearListTableForm.get('training_year_list');
        for (let n = 0; n < year_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newJobPositionListTableWrapper,
                    newTrainingCourseListTableWrapper,
                    select_employees,
                },
                year,
            } = year_list[n];

            if (select_employees.value === 'JobPositions') {
                const {form, form: {formData}} = newJobPositionListTableWrapper;
                const job_position_list = form.get(`job_position_list__${year}`);
                for (let n = 0; n < job_position_list.length; n++) {
                    const {
                        ctrl_refs: {
                            employee_list_exception,
                            newTrainingCourseListTableWrapper: {
                                form, form: {formData}
                            },
                            newTrainingYearListTableWrapper,
                        },
                        job_position: {id: job_position_id, data: {name: job_position_name}},
                    } = job_position_list[n];

                    let employee_list = await findEmployeesByJobPosition(job_position_id);
                    if(employee_list_exception && !employee_list_exception.list.isEmpty()) {
                        employee_list = employee_list.filter(({id}) => employee_list_exception.list.noneMatch(({id: _id}) => id === _id));
                    }

                    const course_or_module_list = form.get(`course_or_module_list__${job_position_id}`).map(({course_or_module}) => course_or_module);
                    course_or_module_list.forEach(({id: course_or_module_id, data: {name: course_or_module_name}}) => {
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
            } else if (select_employees.value === 'Courses') {
                const {form, form: {formData}} = newTrainingCourseListTableWrapper;
                const course_or_module_list = form.get(`course_or_module_list__${year}`);
                for (let n = 0; n < course_or_module_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newJobPositionListTableWrapper: {
                                form, form: {formData}
                            },
                            newTrainingYearListTableWrapper,
                        },
                        course_or_module: {id: course_or_module_id, name: course_or_module_name},
                    } = course_or_module_list[n];

                    const job_position_list = form.get(`job_position_list__${course_or_module_id}`);
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

export default ValidateAndCollectYears;