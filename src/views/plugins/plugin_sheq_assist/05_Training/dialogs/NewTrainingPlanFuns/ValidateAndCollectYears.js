// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import listAllActiveEmployeeByJobPosition
    from "mutations/all/EmployeeActive/listAllActiveEmployeeByJobPosition";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollectYears">
class ValidateAndCollectYears {

    static collect(data, newTrainingYearListTableWrapper) {
        const {refs: {newTrainingYearListTable: {list: training_year_list}}} = newTrainingYearListTableWrapper;

        if (training_year_list.isEmpty()) {
            infoDialog.open('At least 1 Year is required');
            return;
        }

        data.year_plan_list = [];

        for (let n = 0; n < training_year_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newJobPositionListTableWrapper,
                    newTrainingCourseListTableWrapper,
                    select_employees,
                },
                year,
            } = training_year_list[n];

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
                const {refs: {newJobPositionListTable: {list: job_position_list}}} = newJobPositionListTableWrapper;

                if (job_position_list.isEmpty()) {
                    infoDialog.open('At least 1 Job Position is required');
                    return;
                }

                for (let n = 0; n < job_position_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newTrainingCourseListTableWrapper,
                        },
                        job_position: {id: job_position_id},
                    } = job_position_list[n];

                    if (!newTrainingCourseListTableWrapper) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }

                    const {refs: {newTrainingCourseListTable: {list: course_or_module_list}}} = newTrainingCourseListTableWrapper;

                    if (course_or_module_list.isEmpty()) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }
                    course_or_module_list.forEach(({id: course_or_module_id}) => {
                        process({data, job_position_id, course_or_module_id, year, employee_list_exception});
                    });
                }
            } else if (select_employees.value === 'Courses') {
                const {refs: {newTrainingCourseListTable: {list: course_or_module_list}}} = newTrainingCourseListTableWrapper;
                if (course_or_module_list.isEmpty()) {
                    infoDialog.open('At least 1 Course is required');
                    return;
                }

                for (let n = 0; n < course_or_module_list.length; n++) {
                    const {
                        ctrl_refs: {
                            newJobPositionListTableWrapper
                        },
                        course_or_module: {id: course_or_module_id},
                    } = course_or_module_list[n];

                    if (!newJobPositionListTableWrapper) {
                        infoDialog.open('At least 1 Job Position is required');
                        return;
                    }

                    const {refs: {newJobPositionListTable: {list: job_position_list}}} = newJobPositionListTableWrapper;

                    if (job_position_list.isEmpty()) {
                        infoDialog.open('At least 1 Job Position is required');
                        return;
                    }

                    job_position_list.map(({employee_list_exception, job_position: {id: job_position_id}}) => {
                        process({data, job_position_id, course_or_module_id, year, employee_list_exception});
                    });
                }
            }
        }

        return true;
    }

}

// </editor-fold>

function process({data, job_position_id, course_or_module_id, year, employee_list_exception,}) {
    const values = {};

    values.course_id = course_or_module_id;
    values.job_position_id = job_position_id;
    values.year = year;
    values.employee_blacklist = employee_list_exception ? employee_list_exception.list : [];

    data.year_plan_list.push(values);
}

export default ValidateAndCollectYears;