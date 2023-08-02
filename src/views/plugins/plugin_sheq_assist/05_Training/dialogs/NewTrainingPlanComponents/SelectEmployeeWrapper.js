// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {
    ClearableInput,
    SelectEmployeeInput,
} from 'components/inputs';
import NewTrainingCourseListTableWrapper from "./NewTrainingCourseListTableWrapper";
import NewTrainingYearListTableWrapper from "./NewTrainingYearListTableWrapper";
import ASelectWrapper from "./ASelectWrapper";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectEmployeeWrapper">
@observer
class SelectEmployeeWrapper extends ASelectWrapper {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            select_employees: [
                {text: "Course(s)", value: "Courses", checked: false},
                {text: "Year(s)", value: "Years", checked: false}
            ]
        },
        select_employees: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
    }
    // </editor-fold>

    onChangeEmployee(el, val) {
        const {props:{onChange, values}} = this;
        if(val) {
            values.employee = val;
        } else {
            delete values.employee;
        }
        onChange(values, "employee", this);
    }

    render() {
        const {state, props:{onChange, root, values}} = this;
        if(!this.isSelected) return null;
        return <div className="row ASelectWrapper">
            <SelectEmployeeInput name="employee" placeholder="Select Employee..." required className="form-control margin-t-10 margin-b-10" onChange={this.form.onChange}/>
            <ClearableInput name="select_employees" type="radio" placeholder="Select Per" required className="margin-t-10 margin-b-10 form-control" onChange={this.form.onChange} values={this.state.lists.select_employees}/>
            <NewTrainingCourseListTableWrapper
                ref={ref => {this.innerRefs.newTrainingCourseListTableWrapper = ref}}
                name="course_or_module_list"
                values={values}
                root={root}
                parentName="Employee"
                action="Courses"
                state={state}
                excludeEmployeeList
                excludeJobPositionList
                onChange={this.form.onChange}
            />
            <NewTrainingYearListTableWrapper
                ref={ref => {this.innerRefs.newTrainingYearListTableWrapper = ref}}
                name="training_year_list"
                values={values}
                root={root}
                parentName="Employee"
                action="Years"
                state={state}
                excludeEmployeeList
                excludeJobPositionList
                onChange={this.form.onChange}
            />
        </div>;
    }
}
// </editor-fold>

export default SelectEmployeeWrapper;