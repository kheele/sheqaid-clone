// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import SelectEmployeeWrapper from "./SelectEmployeeWrapper";
import NewJobPositionListTableWrapper from "./NewJobPositionListTableWrapper";
import NewTrainingCourseListTableWrapper from "./NewTrainingCourseListTableWrapper";
import NewTrainingYearListTableWrapper from "./NewTrainingYearListTableWrapper";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectOrTableWrapper">
@observer
class SelectOrTableWrapper extends React.Component {

    values = {};

    get selectEmployeeWrapper() {
        return this.refs.selectEmployeeWrapper;
    }

    get newJobPositionListTableWrapper() {
        return this.refs.newJobPositionListTableWrapper;
    }

    get newTrainingCourseListTableWrapper() {
        return this.refs.newTrainingCourseListTableWrapper;
    }

    get newTrainingYearListTableWrapper() {
        return this.refs.newTrainingYearListTableWrapper;
    }

    render() {
        const {state, onChange} = this.props;
        return <React.Fragment>
            <SelectEmployeeWrapper ref="selectEmployeeWrapper" root="Employee" isTop values={this.values} action="1Employee" state={state} onChange={onChange}/>
            <NewJobPositionListTableWrapper ref="newJobPositionListTableWrapper" root="JobPosition" isTop values={this.values} action="JobPositions" state={state} onChange={onChange}/>
            <NewTrainingCourseListTableWrapper ref="newTrainingCourseListTableWrapper" root="TrainingCourse" isTop values={this.values} action="Courses" state={state} excludeEmployeeList onChange={onChange}/>
            <NewTrainingYearListTableWrapper ref="newTrainingYearListTableWrapper" root="TrainingYear" isTop values={this.values} action="Years" state={state} excludeEmployeeList onChange={onChange}/>
        </React.Fragment>;     
    }
}
// </editor-fold>

export default SelectOrTableWrapper;