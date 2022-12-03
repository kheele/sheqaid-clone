// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ValidateAndCollect1Employee">
class ValidateAndCollect1Employee {

    static valid(selectEmployeeWrapper) {
        const {
            form: selectEmployeeForm,
            innerRefs: {
                newTrainingCourseListTableWrapper,
                newTrainingYearListTableWrapper,
            }
        } = selectEmployeeWrapper;
        // console.log('valid(selectEmployeeForm)', selectEmployeeForm)
        if (!selectEmployeeForm.isValid('employee')) {
            infoDialog.open('Please Select An Employee');
            return;
        }
        if (!selectEmployeeForm.isValid('select_employees')) {
            infoDialog.open(<div className="text-left">
                One of these options:<br/>
                1. Course(s);<br/>
                2. Year(s)]<br/>
                is required
            </div>);
            return;
        }

        if (selectEmployeeForm.get('select_employees') === 'Courses') {
            const {form, form: {formData}} = newTrainingCourseListTableWrapper;
            // console.log('newTrainingCourseListTableWrapper.form', form)
            if (!form.isValid('course_or_module_list')) {
                infoDialog.open('At least 1 Course is required');
                return;
            }
            const course_or_module_list = form.get('course_or_module_list');
            for (let n = 0; n < course_or_module_list.length; n++) {
                const {
                    ctrl_refs: {
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
        } else if (selectEmployeeForm.get('select_employees') === 'Years') {
            const {form, form: {formData}} = newTrainingYearListTableWrapper;
            // console.log('newTrainingYearListTableWrapper.form', form)
            if (!form.isValid('training_year_list')) {
                infoDialog.open('At least 1 Year is required');
                return;
            }
            const training_year_list = form.get('training_year_list');
            for (let n = 0; n < training_year_list.length; n++) {
                const {
                    ctrl_refs: {
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

        return true;
    }

    static async collect(data, selectEmployeeWrapper) {
        const {
            form: selectEmployeeForm,
            innerRefs: {
                newTrainingCourseListTableWrapper,
                newTrainingYearListTableWrapper,
            }
        } = selectEmployeeWrapper;
        const {
            formData,
            formData: {
                employee,
                select_employees,
                //
                training_year_list,
            }
        } = selectEmployeeForm;

        data.plan_list = [];
        const {plan_list} = data;
        if (select_employees === 'Courses') {
            const {form, form: {formData}} = newTrainingCourseListTableWrapper;
            const course_or_module_list = form.get('course_or_module_list');

            for (let n = 0; n < course_or_module_list.length; n++) {
                const {
                    ctrl_refs: {
                        newTrainingYearListTableWrapper,
                    },
                    course_or_module: {id, data: {name}},
                } = course_or_module_list[n];

                const {form, form: {formData}} = newTrainingYearListTableWrapper;

                const training_year_list = form.get(`training_year_list__${id}`).map(({year}) => parseInt(year));
                training_year_list.forEach(year => {
                    const values = {};

                    values.status = 'Not Started';
                    values.employee = employee;
                    values.course_or_module = {id, name};
                    values.year = year;

                    data.plan_list.push(values);
                });
            }
        } else if (select_employees === 'Years') {
            const {form, form: {formData}} = newTrainingYearListTableWrapper;
            const training_year_list = form.get('training_year_list');

            for (let n = 0; n < training_year_list.length; n++) {
                const {
                    ctrl_refs: {
                        newTrainingCourseListTableWrapper,
                    },
                    year,
                } = training_year_list[n];

                const {form, form: {formData}} = newTrainingCourseListTableWrapper;

                const course_or_module_list = form.get(`course_or_module_list__${year}`).
                map(({course_or_module}) => course_or_module);
                course_or_module_list.forEach(({id: course_or_module_id, data: {name: course_or_module_name}}) => {
                    const values = {};

                    values.status = 'Not Started';
                    values.employee = employee;
                    values.course_or_module = {id: course_or_module_id, name: course_or_module_name};
                    values.year = year;

                    data.plan_list.push(values);
                });
            }
        }

        // console.log('selectEmployeeWrapper', formData)
    }
}
// </editor-fold>

export default ValidateAndCollect1Employee;