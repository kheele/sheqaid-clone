// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollectJobPositions">
class ValidateAndCollectJobPositions {

    static collect(data, newJobPositionListTableWrapper) {
        const {refs: {newJobPositionListTable: {list: job_position_list}}} = newJobPositionListTableWrapper;

        if (job_position_list.isEmpty()) {
            infoDialog.open('At least 1 Job Position is required');
            return;
        }

        data.job_position_plan_list = [];

        for (let n = 0; n < job_position_list.length; n++) {
            const {
                ctrl_refs: {
                    employee_list_exception,
                    newTrainingCourseListTableWrapper,
                    newTrainingYearListTableWrapper,
                    select_employees,
                },
                job_position,
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
                const {refs: {newTrainingCourseListTable: {list: course_list}}} = newTrainingCourseListTableWrapper;

                if (course_list.isEmpty()) {
                    infoDialog.open('At least 1 Course is required');
                    return;
                }

                for (let n = 0; n < course_list.length; n++) {
                    const {
                        ctrl_refs: {newTrainingYearListTableWrapper},
                        course
                    } = course_list[n];

                    if (!newTrainingYearListTableWrapper) {
                        infoDialog.open('At least 1 Year is required');
                        return;
                    }
                    const {refs: {newTrainingYearListTable: {list: training_year_list}}} = newTrainingYearListTableWrapper;

                    if (training_year_list.isEmpty()) {
                        infoDialog.open('At least 1 Year is required');
                        return;
                    }

                    training_year_list.forEach(({year}) => {
                        process({data, job_position, course, year, employee_list_exception,});
                    });
                }
            } else if (select_employees.value === 'Years') {
                const {refs: {newTrainingYearListTable: {list: training_year_list}}} = newTrainingYearListTableWrapper;

                if (training_year_list.isEmpty()) {
                    infoDialog.open('At least 1 Year is required');
                    return;
                }

                for (let n = 0; n < training_year_list.length; n++) {
                    const {ctrl_refs: {newTrainingCourseListTableWrapper}, year,} = training_year_list[n];

                    if (!newTrainingCourseListTableWrapper) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }
                    const {refs: {newTrainingCourseListTable: {list: course_list}}} = newTrainingCourseListTableWrapper;

                    if (course_list.isEmpty()) {
                        infoDialog.open('At least 1 Course is required');
                        return;
                    }

                    course_list.forEach(({course}) => {
                        process({data, job_position, course, year, employee_list_exception,});
                    });
                }
            }
        }

        return true;
    }

}

// </editor-fold>

function process({data, job_position, course, year, employee_list_exception}) {
    const values = {};

    values.course_id = course.id;
    values.job_position_id = job_position.id;
    values.year = year;
    values.employee_blacklist = employee_list_exception ? employee_list_exception.list : [];

    data.job_position_plan_list.push(values);
}

export default ValidateAndCollectJobPositions;
