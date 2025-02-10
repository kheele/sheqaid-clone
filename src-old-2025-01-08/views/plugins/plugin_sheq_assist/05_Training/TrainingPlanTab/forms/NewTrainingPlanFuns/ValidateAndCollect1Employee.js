// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollect1Employee">
class ValidateAndCollect1Employee {

    static collect(data, selectEmployeeWrapper) {
        const {
            form: selectEmployeeForm, innerRefs: {newTrainingCourseListTableWrapper, newTrainingYearListTableWrapper,}
        } = selectEmployeeWrapper;
        
        if (!selectEmployeeForm.isValid('employee')) {
            infoDialog.open('Please Select An Employee');
            return;
        }

        const {employee} = selectEmployeeForm.data;

        if (!selectEmployeeForm.isValid('select_employees')) {
            infoDialog.open(<div className="text-left">
                One of these options:<br/>
                1. Course(s);<br/>
                2. Year(s)]<br/>
                is required
            </div>);
            return;
        }

        data.employee_plan_list = [];

        if (selectEmployeeForm.get('select_employees') === 'Courses') {
            const {refs: {newTrainingCourseListTable: {list: course_list}}} = newTrainingCourseListTableWrapper;

            if (course_list.isEmpty()) {
                infoDialog.open('At least 1 Course is required');
                return;
            }

            for (let n = 0; n < course_list.length; n++) {
                const {
                    ctrl_refs: {newTrainingYearListTableWrapper,}, course,
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
                    process({data, employee, course, year,});
                });
            }
        } else if (selectEmployeeForm.get('select_employees') === 'Years') {
            const {refs: {newTrainingYearListTable: {list: training_year_list}}} = newTrainingYearListTableWrapper;

            if (training_year_list.isEmpty()) {
                infoDialog.open('At least 1 Year is required');
                return;
            }

            for (let n = 0; n < training_year_list.length; n++) {
                const {ctrl_refs: {newTrainingCourseListTableWrapper,}, year,} = training_year_list[n];

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
                    process({data, employee, course, year,});
                });
            }
        }

        return true;
    }

}

// </editor-fold>

function process({data, employee, course, year,}) {
    const values = {};

    values.completion_status = 'Not Started';
    values.employee_id = employee.id;
    values.course_id = course.id;
    values.year = year;

    data.employee_plan_list.push(values);
}

export default ValidateAndCollect1Employee;
