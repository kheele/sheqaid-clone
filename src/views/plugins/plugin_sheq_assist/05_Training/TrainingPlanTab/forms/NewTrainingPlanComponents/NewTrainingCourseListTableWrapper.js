// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {
    ActionsButton, Button,
    ClearableInput, SelectTrainingCourseInput,
} from '../../../../../../../components/inputs';
import {
    NewEmployeeListTable,
    NewTrainingCourseListTable,
} from '../../../../../../../components/FormTableComponents';

import NewJobPositionListTableWrapper from "./NewJobPositionListTableWrapper";
import NewTrainingYearListTableWrapper from "./NewTrainingYearListTableWrapper";
import ASelectWrapper from "./ASelectWrapper";
import ANewListTable from "../../../../../../../components/FormTableComponents/ANewListTable";
import {THead, TRow} from "../../../../../../../components/tables";
import style from "../../../../../../../components/FormTableComponents/ANewListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewTrainingCourseListTableWrapper">
@observer
class NewTrainingCourseListTableWrapper extends ASelectWrapper {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            select_employees: [
                {text: "Job Position(s)", value: "JobPositions", checked: false},
                {text: "Year(s)", value: "Years", checked: false}
            ]
        },
        select_employees: null,
        select_employees_with_id: {},
    };

    // </editor-fold>

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {item, excludeJobPositionList, excludeTrainingYearList} = this.props;
        if (excludeTrainingYearList && !excludeJobPositionList) {
            this.state.select_employees = "JobPositions";
        } else if (!excludeTrainingYearList && excludeJobPositionList) {
            this.state.select_employees = "Years";
        }

        // if(item) {
        //     item.ctrl_refs.newTrainingCourseListTableWrapper = this.$self;
        // }
    }

    @computed get showSelectEmployees() {
        const {excludeJobPositionList, excludeTrainingYearList} = this.props;
        console.log('NewTrainingCourseListTableWrapper', excludeJobPositionList, excludeTrainingYearList)
        return !excludeJobPositionList && !excludeTrainingYearList;
    }

    renderTable(item, n) {
        const {
            state,
            showSelectEmployees,
            props: {root, excludeEmployeeList, excludeJobPositionList, excludeTrainingYearList, onChange}
        } = this;

        let id;
        if(root === 'TrainingCourse') {
            id = (item.course_or_module || item).id;
        }

        console.log('renderTable', item)

        return <React.Fragment>
            {!excludeEmployeeList && <label className="margin-0 margin-t-10 pull-left font-size-13">
                Employee(s) To Exclude
                <ActionsButton idx={n} className="btn btn-primary fixed-flex w-40 margin-0 margin-l-10" icon="edit"
                               onClick={this.onOpenEmployeeListTable}/>
            </label>}
            {!excludeEmployeeList && <NewEmployeeListTable
                ref={ref => {item.ctrl_refs.employee_list_exception = ref}}
                name={"employee_list_exception-" + n}
                disableOtherPerson
                closeable
                rendered={false}
                onChange={this.form.onChange}
            />}

            {showSelectEmployees && <ClearableInput
                ref={ref => {item.ctrl_refs.select_employees = ref}}
                name={'select_employees'}
                type="radio"
                placeholder="Select Per"
                required
                className="col-lg-12 margin-t-10 margin-b-10 form-control"
                onChange={this.form.onChange}
                values={this.state.lists.select_employees}
                id={id}
            />}
            <NewJobPositionListTableWrapper
                ref={ref => {item.ctrl_refs.newJobPositionListTableWrapper = ref}}
                root={root}
                parentName="Courses"
                item={item}
                id={id}
                unrendered={!!excludeJobPositionList}
                action="JobPositions"
                state={state}
                excludeCourseList
                excludeTrainingYearList={excludeTrainingYearList}
                onChange={this.form.onChange}
            />
            <NewTrainingYearListTableWrapper
                ref={ref => {item.ctrl_refs.newTrainingYearListTableWrapper = ref}}
                root={root}
                parentName="Courses"
                item={item}
                id={id}
                unrendered={!!excludeTrainingYearList}
                action="Years"
                state={state}
                excludeEmployeeList
                excludeCourseList
                excludeJobPositionList={excludeJobPositionList}
                onChange={this.form.onChange}
            />
        </React.Fragment>;
    }

    render() {
        const {
            state: {select_employees},
            // onChange,
            showButton,
            unrendered,
            root,
            isTop,
            parentName,
            item,
        } = this.props;
        if (!this.isSelected || unrendered) return null;

        let name = `course_or_module_list`;
        if (item) {
            if (parentName === "Years") {
                name += `__${item.year || item}`;
            } else if (parentName === "JobPositions") {
                name += `__${(item.job_position || item).id}`;
            }
        }

        return <div className="row ASelectWrapper">
            {!showButton && <label className="margin-t-10 margin-b-0 padding-b-0">Course List</label>}
            {showButton && <label className="margin-0 margin-t-10 pull-left font-size-13">
                Course List
                <ActionsButton className="btn btn-primary fixed-flex w-40 margin-0 margin-l-10" icon="edit"
                               onClick={this.onClick}/>
            </label>}
            <ListTable ref="newTrainingCourseListTable" name={name} onChange={this.form.onChange} renderTable={this.renderTable}
                                        rendered={!showButton} disableRowHover/>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewCourseListTable";
    title = "Courses / Modules";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.course_or_module || item.id)) {
            const {
                id, data: {
                    created_at, name, job_position_list, frequency, sector_list, provider, client, project, site
                }
            } = item.course_or_module || item;

            if(!item.ctrl_refs) {
                item.ctrl_refs = {};
            }

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{name}</div>
                <div className="td">{job_position_list.map(({id, job_position: {name}}) => <span
                    className="block-inline">{name}</span>)}</div>
                <div className="td fixed-flex min-w-90">{frequency}</div>
                <div className="td fixed-flex min-w-90">{provider}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={id} className={"tr-readonly margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full padding-10">
                <div className="td flex padding-0 margin-0">
                    <SelectTrainingCourseInput ref={this.onSetRef} name="course_or_module"
                                               placeholder="Add Course..."
                                               className="no-border-radius-r form-control" onChange={this.onChange}
                                               add={false}/>
                    <Button idx={n} action="save"
                            className="btn btn-primary fixed-flex w-40 margin-0 no-border-radius-l" onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Course</div>
            <div className="td">Job Position(s)</div>
            <div className="td fixed-flex min-w-90">Frequency</div>
            <div className="td fixed-flex min-w-90">Provider</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }

}

// </editor-fold>

export default NewTrainingCourseListTableWrapper;
