// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import MKBox from "components/MK/MKBox";
import TrainingPlanViewButtons from "components/Omni/TrainingPlanViewButtons";
import 'react-alice-carousel/lib/alice-carousel.css';

import {calculateRightPos, Dates, execWhen} from 'utils/Utils';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {
    ClearableInput,
    DateRangeInput,
    SelectEmployeeInput,
    SelectJobPositionInput, SelectTrainingCourseInput,
    SelectTrainingMatixInput, SelectYearInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTrainingPlanDialog from './forms/NewTrainingPlanDialog';
import EditTrainingPlanDialog from './forms/EditTrainingPlanDialog';
import ProfileTrainingPlanDialog from './forms/ProfileTrainingPlanDialog';

import style from "./TrainingPlanTab.lazy.css";
import TrainingPlanEmployeesButtons from "components/Omni/TrainingPlanEmployeesButtons";
import Popover from "components/popovers/Popover";
import {RenderCourse, RenderEmployee, RenderJobPosition, RenderYear} from "./RenderItems";
import TrainingPlanTargetViewButtons from "components/Omni/TrainingPlanTargetViewButtons";
import EmployeesDialog from "views/plugins/plugin_hr_management/Employees/dialogs/EmployeesDialog";

// </editor-fold>

@observer
class Index extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "TrainingPlanTab";
    @observable
    state = {
        lists: {
            completion_status: ['Not Started', 'Outstanding', 'In Progress', 'Completed'],
            result_status: ['Passed', 'Failed'].map(text => ({text, value: text, checked: false})),
        },
        view: 'Course',
        employee_view: 'active',
        target_view: null,
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onShowWarningMsg = this.onShowWarningMsg.bind(this);
        this.onViewTarget = this.onViewTarget.bind(this);
        this.setTargetView = this.setTargetView.bind(this);
        this.setView = this.setView.bind(this);
        this.setEmployees = this.setEmployees.bind(this);

        this.onViewEmployeeList = this.onViewEmployeeList.bind(this);
        this.onViewCourseList = this.onViewCourseList.bind(this);
        this.onViewJobPositionList = this.onViewJobPositionList.bind(this);

        this.onNewItem = this.onNewItem.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        this.setView(this.state.view, false);
        this.setEmployees(this.state.employee_view, false);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {state: {view, employee_view, target_view}} = this;

        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
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
        } = filterData || {};

        const listByLogged = sockets.of('trainings/plans').fn('listByLogged');

        return listByLogged({
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
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    //<editor-fold desc="onShowWarningMsg">
    onShowWarningMsg(evt) {
        let elem = window.$(evt.target);
        const idx = parseInt(elem.attr("idx"));
        if (this.openIdx === idx)
            return;

        const item = this.refs.root.list[idx];
        const {state: {view}} = this;

        let title, node;
        if (view === 'Employee') {
            const {
                fname, lname, job_position,
                list,
                training_cost,
                results_failed,
                results_passed,
                results_average,
                status_outstanding,
                status_completed,
                status_not_started,
                course_list_count,
                year_list
            } = item.data;

            const status = status_outstanding || status_completed || status_not_started;

            const results = results_failed || results_passed || results_average;

            title = `${lname + " " + fname}`;
            node = <div>
                {!status && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Statuses"/>}
                {!results && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Results"/>}
                {!training_cost && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Cost"/>}
                {!job_position && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Job Position"/>}
            </div>;
        } else if (view === 'Job Position') {
            const {
                name,
                list,
                training_cost,
                results_failed,
                results_passed,
                results_average,
                status_outstanding,
                status_completed,
                status_not_started,
                employee_list_count,
                course_list_count,
                year_list,
            } = item;
            title = name;

            const status = status_outstanding || status_completed || status_not_started;

            const results = results_failed || results_passed || results_average;

            node = <div>
                {!status && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Statuses"/>}
                {!results && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Results"/>}
                {!training_cost && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Cost"/>}
                {employee_list_count &&
                    <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Employee(s)"/>}
            </div>;
        } else if (view === 'Course') {
            const {
                name,
                list,
                training_cost,
                results_failed,
                results_passed,
                results_average,
                status_outstanding,
                status_completed,
                status_not_started,
                employee_list_count,
                job_position_list_count,
                year_list,
            } = item.data;

            const status = status_outstanding || status_completed || status_not_started;

            const results = results_failed || results_passed || results_average;

            title = name;
            node = <div>
                {!status && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Statuses"/>}
                {!results && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Results"/>}
                {!training_cost && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Cost"/>}
                {job_position_list_count &&
                    <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Job Position(s)"/>}
                {employee_list_count &&
                    <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Employee(s)"/>}
            </div>;
        } else if (view === 'Year') {
            const {
                year,
                list,
                training_cost,
                results_failed,
                results_passed,
                results_average,
                status_outstanding,
                status_completed,
                status_not_started,
                employee_list_count,
                job_position_list_count,
                course_list_count
            } = item;

            const status = status_outstanding || status_completed || status_not_started;

            const results = results_failed || results_passed || results_average;

            title = year;
            node = <div>
                {!status && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Statuses"/>}
                {!results && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Results"/>}
                {!training_cost && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Cost"/>}
                {job_position_list_count &&
                    <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Job Position(s)"/>}
                {employee_list_count &&
                    <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Employee(s)"/>}
            </div>;
        }

        const offset = elem.offset();
        const style = {left: "auto", right: calculateRightPos(elem[0], false) + 10, top: offset.top, width: 340};
        this.refs.popover.settings({
            style,
            isDialog: false,
            contentNode: <div>
                <p className="nav-item padding-0">
                    <b>{view} ({title})</b> details are incomplete.<br/>
                    <small className="hor-center text-center">
                        .......................................<br/>
                        Please complete the following actions.<br/>
                        Note: These actions are required.
                    </small>
                </p>
                <hr/>
                {node}
            </div>
        }).open();
    }

    //</editor-fold>

    //<editor-fold desc="setView">
    async setView(value, load = true) {
        let ref;
        if (this.trainingPlanViewButtonsRef) {
            ref = this.trainingPlanViewButtonsRef;
        } else {
            ref = await execWhen(() => this.trainingPlanViewButtonsRef);
        }

        ref.setView(value);
        this.state.view = value;

        this.setTargetView(null, null);

        if (load) {
            this.refs.root.load();
        }
    }

    //</editor-fold>

    //<editor-fold desc="setTargetView">
    async setTargetView(text, target_view) {
        let trainingPlanEmployeesButtonsRef;
        if (this.trainingPlanEmployeesButtonsRef) {
            trainingPlanEmployeesButtonsRef = this.trainingPlanEmployeesButtonsRef;
        } else {
            trainingPlanEmployeesButtonsRef = await execWhen(() => this.trainingPlanEmployeesButtonsRef);
        }

        let trainingPlanViewButtonsRef;
        if (this.trainingPlanViewButtonsRef) {
            trainingPlanViewButtonsRef = this.trainingPlanViewButtonsRef;
        } else {
            trainingPlanViewButtonsRef = await execWhen(() => this.trainingPlanViewButtonsRef);
        }

        let ref;
        if (this.trainingPlanTargetViewButtonsRef) {
            ref = this.trainingPlanTargetViewButtonsRef;
        } else {
            ref = await execWhen(() => this.trainingPlanTargetViewButtonsRef);
        }

        if (text === 'Cancel') {
            trainingPlanEmployeesButtonsRef.setTargetView(null);
            trainingPlanViewButtonsRef.setTargetView(null);
            ref.setView(null);
            this.state.target_view = null;
        } else {
            trainingPlanEmployeesButtonsRef.setTargetView(target_view);
            trainingPlanViewButtonsRef.setTargetView(target_view);
            ref.setView(target_view);
            this.state.target_view = target_view;
        }

        this.refs.root.load();
    }

    //</editor-fold>

    //<editor-fold desc="onViewTarget">
    onViewTarget(evt, el) {
        const {id, target, item} = el.props;
        // this.setTargetView(null, {id, target, item});
    }

    //</editor-fold>

    //<editor-fold desc="setEmployees">
    async setEmployees(value, load = true) {
        let ref;
        if (this.trainingPlanEmployeesButtonsRef) {
            ref = this.trainingPlanEmployeesButtonsRef;
        } else {
            ref = await execWhen(() => this.trainingPlanEmployeesButtonsRef);
        }

        ref.setView(value);
        this.state.employee_view = value;

        if (load) {
            this.refs.root.load();
        }
    }

    //</editor-fold>

    //<editor-fold desc="onViewEmployeeList">
    onViewEmployeeList(evt, el) {
        const {item, target} = el.props;
        // const {employee_list} = item;
        // this.refs.employeesDialog.open({list: employee_list, title: 'Employees (' + target + ')'});
    }

    //</editor-fold>

    //<editor-fold desc="onViewCourseList">
    onViewCourseList(evt, el) {
        const {item, target} = el.props;
        // const {employee_list} = item;
        // this.refs.employeesDialog.open({list: employee_list, title: 'Employees (' + target + ')'});
    }

    //</editor-fold>

    //<editor-fold desc="onViewCourseList">
    onViewJobPositionList(evt, el) {
        const {item, target} = el.props;
        // const {employee_list} = item;
        // this.refs.employeesDialog.open({list: employee_list, title: 'Employees (' + target + ')'});
    }

    //</editor-fold>

    //<editor-fold desc="onNewItem">
    onNewItem(res) {
        this.refs.root.load();
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        return <div className="left-buttons pull-left">
            {this.props.onRenderCompetenciesBtb()}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {
            state: {view, target_view}
        } = this;

        if (view === 'Year' || view === 'Course' || view === 'Job Position' || view === 'Employee') {
            return <Options idx={idx} permissionModKey={this.props.permissionKey}>
                <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            </Options>;
        }
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        //     completion_status,//
        //     result_status,//
        //     result,
        //     date_range,
        //     course_id,//
        //     training_id,//
        //     trainer_id,//
        //     job_position_id,//
        //     employee_id,//
        //     year,//
        return <div className="col-lg-12 controls grid-5 grid-gap-5 -margin-b-35">
            <SelectTrainingCourseInput name="course" placeholder="Course..." className="form-control"
                                       onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
                                    onChange={onChange}/>
            <SelectTrainingMatixInput name="training" placeholder="Training Matrix..." className="form-control"
                                      onChange={onChange}/>
            <SelectEmployeeInput name="trainer" placeholder="Trainer..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control"
                                 onChange={onChange}/>

            <ClearableInput name="completion_status" type="select" placeholder="Completion Status"
                            className="form-control"
                            onChange={onChange} values={this.state.lists.completion_status} returnValue/>
            <ClearableInput name="result_status" type="radio" placeholder="Result Status"
                            className="form-control"
                            onChange={onChange} values={this.state.lists.result_status} returnValue/>
            <SelectYearInput name="year" className="form-control" start={new Date().getFullYear() + 10} onChange={onChange}/>
            <DateRangeInput name="date_range" className="form-control" placeholder="Date" onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    @computed get renderTHead() {
        const {isViewEmployee, isViewJobPosition, isViewCourse, isViewYear, state: {view, target_view}} = this;
        const {id, target} = target_view || {};

        if (isViewEmployee) {
            return <THead>
                {target !== 'employee' && <div className="td">Employee</div>}
                <div className="td">Job Position</div>
                <div className="td">Courses</div>
                <div className="td fixed-flex min-w-250">Years</div>
                <div className="td fixed-flex min-w-320">Status</div>
                <div className="td fixed-flex min-w-220">Results</div>
                {/*<div className="td fixed-flex min-w-140">Total Cost</div>*/}
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else if (isViewJobPosition) {
            return <THead>
                {target !== 'job_position' && <div className="td">Job Position</div>}
                <div className="td">Courses</div>
                <div className="td fixed-flex min-w-120">Employees</div>
                <div className="td fixed-flex min-w-250">Years</div>
                <div className="td fixed-flex min-w-320">Status</div>
                <div className="td fixed-flex min-w-220">Results</div>
                <div className="td fixed-flex min-w-140">Total Cost</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else if (isViewCourse) {
            return <THead>
                {target !== 'course' && <div className="td">Course</div>}
                <div className="td">Job Positions</div>
                <div className="td fixed-flex min-w-120">Employees</div>
                <div className="td fixed-flex min-w-250">Years</div>
                <div className="td fixed-flex min-w-320">Status</div>
                <div className="td fixed-flex min-w-220">Results</div>
                <div className="td fixed-flex min-w-140">Total Cost</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else if (isViewYear) {
            return <THead>
                {target !== 'year' && <div className="td fixed-flex min-w-120">Year</div>}
                <div className="td">Courses</div>
                <div className="td">Job Positions</div>
                <div className="td fixed-flex min-w-120">Employees</div>
                <div className="td fixed-flex min-w-320">Status</div>
                <div className="td fixed-flex min-w-220">Results</div>
                <div className="td fixed-flex min-w-140">Total Cost</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(idx, onClick) {
        const {
            isViewEmployee,
            isViewJobPosition,
            isViewCourse,
            isViewYear,
            onViewTarget,
            onViewEmployeeList,
            onViewCourseList,
            onViewJobPositionList,
            onShowWarningMsg,
            state: {view, target_view}
        } = this;
        const {id, target} = target_view || {};

        const item = this.refs.root.list[idx];
        // console.log(view, target, id, item);

        const props = {
            key: item.id,
            item,
            view,
            target_view,
            idx,
            onViewTarget,
            onShowWarningMsg,
            onClick,
        };
        if (isViewEmployee) {
            return <RenderEmployee {...props} onViewCourseList={onViewCourseList}/>
        } else if (isViewJobPosition) {
            return <RenderJobPosition {...props} onViewCourseList={onViewCourseList} onViewEmployeeList={onViewEmployeeList}/>
        } else if (isViewCourse) {
            return <RenderCourse {...props} onViewJobPositionList={onViewJobPositionList} onViewEmployeeList={onViewEmployeeList}/>
        } else if (isViewYear) {
            return <RenderYear {...props} onViewJobPositionList={onViewJobPositionList} onViewCourseList={onViewCourseList} onViewEmployeeList={onViewEmployeeList}/>
        }
        return null;
    }

    // </editor-fold>

    //<editor-fold desc="isView funs">
    @computed get isViewEmployee() {
        const {state: {view, target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'employee' || view === 'Employee';
    }

    @computed get isViewJobPosition() {
        const {state: {view, target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'job_position' || view === 'Job Position';
    }

    @computed get isViewCourse() {
        const {state: {view, target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'course' || view === 'Course';
    }

    @computed get isViewYear() {
        const {state: {view, target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'year' || view === 'Year';
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {state, state: {view, employee_view, target_view}} = this;
        return <>
            <MKBox width="100%" display="flex" alignItems="center" justifyContent="center" margin='10px 0 15px'>
                <TrainingPlanEmployeesButtons ref={ref => {
                    this.trainingPlanEmployeesButtonsRef = ref;
                }} value={employee_view} target_view={target_view} onChange={this.setEmployees}/>
                <TrainingPlanViewButtons ref={ref => {
                    this.trainingPlanViewButtonsRef = ref;
                }} value={view} target_view={target_view} onChange={this.setView}/>
                <TrainingPlanTargetViewButtons ref={ref => {
                    this.trainingPlanTargetViewButtonsRef = ref;
                }} value={target_view} onChange={this.setTargetView}/>
            </MKBox>
            <APageListReadWrite
                hasBackBtn={false}
                ref="root"
                page={this}
                createBtnTitle="Create"
                pageId={this.pageKey + "-tab"}
                pageTitle="Training Plan"
                pageTitleSingular="training plan"
                onLoadList={this.onLoadList}
                noAnimation={true}
                renderLeftButtons={this.renderLeftButtons}
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                renderTHead={this.renderTHead}
                renderItem={this.renderItem}>
                <ConfirmDialog ref="removeDialog"/>

                <NewTrainingPlanDialog ref="newDialog"/>
                <EditTrainingPlanDialog ref="editDialog"/>
                <ProfileTrainingPlanDialog ref="profileDialog" state={state}/>

                <EmployeesDialog ref="employeesDialog"/>

                <Popover ref="popover"/>
            </APageListReadWrite>
        </>;
    }

    // </editor-fold>
}

export default Index;
