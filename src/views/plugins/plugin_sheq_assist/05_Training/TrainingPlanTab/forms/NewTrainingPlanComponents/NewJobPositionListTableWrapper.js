// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {
    ActionsButton, Button,
    ClearableInput, SelectJobPositionInput,
} from '../../../../../../../components/inputs';

import {
    NewEmployeeListTable,
    NewJobPositionListTable,
} from '../../../../../../../components/FormTableComponents';
import NewTrainingCourseListTableWrapper from "./NewTrainingCourseListTableWrapper";
import NewTrainingYearListTableWrapper from "./NewTrainingYearListTableWrapper";
import ASelectWrapper from "./ASelectWrapper";
import ANewListTable from "../../../../../../../components/FormTableComponents/ANewListTable";
import {THead, TRow} from "../../../../../../../components/tables";
import style from "../../../../../../../components/FormTableComponents/ANewListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewJobPositionListTableWrapper">
@observer
class NewJobPositionListTableWrapper extends ASelectWrapper {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            select_employees: [
                {text: "Course(s)", value: "Courses", checked: false},
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
        const {item, excludeCourseList, excludeTrainingYearList} = this.props;
        if (excludeTrainingYearList && !excludeCourseList) {
            this.state.select_employees = "Courses";
        } else if (!excludeTrainingYearList && excludeCourseList) {
            this.state.select_employees = "Years";
        }

        // if(item) {
        //     item.ctrl_refs.newJobPositionListTableWrapper = this.$self;
        //     alert(`componentDidMount: ${item.ctrl_refs.newJobPositionListTableWrapper}, item.ctrl_refs.newJobPositionListTableWrapper`)
        // }
    }

    @computed get showSelectEmployees() {
        const {excludeCourseList, excludeTrainingYearList} = this.props;
        // console.log('NewJobPositionListTableWrapper', excludeCourseList, excludeTrainingYearList)
        return !excludeCourseList && !excludeTrainingYearList;
    }

    renderTable(item, n) {
        const {
            state,
            showSelectEmployees,
            props: {root, isTop, excludeEmployeeList, excludeCourseList, excludeTrainingYearList, onChange}
        } = this;

        let id;
        if(root === 'JobPosition') {
            id = (item.job_position || item).id;
        }

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
            <NewTrainingCourseListTableWrapper
                ref={ref => {item.ctrl_refs.newTrainingCourseListTableWrapper = ref;
                    console.log(`NewTrainingCourseListTableWrapper:`, ref)}}
                root={root}
                parentName="JobPositions"
                item={item}
                id={id}
                unrendered={!!excludeCourseList}
                action="Courses"
                state={state}
                excludeEmployeeList
                excludeJobPositionList
                excludeTrainingYearList={excludeTrainingYearList}
                onChange={this.form.onChange}
            />
            <NewTrainingYearListTableWrapper
                ref={ref => {item.ctrl_refs.newTrainingYearListTableWrapper = ref;
                    console.log(`NewTrainingYearListTableWrapper:`, ref)}}
                root={root}
                parentName="JobPositions"
                item={item}
                id={id}
                unrendered={!!excludeTrainingYearList}
                action="Years"
                state={state}
                excludeEmployeeList
                excludeJobPositionList
                excludeCourseList={excludeCourseList}
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

        let name = `job_position_list`;
        if (item) {
            if(parentName === "Years") {
                name += `__${item.year || item}`;
            } else if (parentName === "Courses") {
                name += `__${(item.course_or_module || item).id}`;
            }
        }

        return <div className="row ASelectWrapper">
            {!showButton && <label className="margin-t-10 margin-b-0 padding-b-0">Job Position List</label>}
            {showButton && <label className="margin-0 margin-t-10 pull-left font-size-13">
                Job Position List
                <ActionsButton className="btn btn-primary fixed-flex w-40 margin-0 margin-l-10" icon="edit"
                               onClick={this.onClick}/>
            </label>}
            <ListTable ref="newJobPositionListTable" name={name} onChange={this.form.onChange} renderTable={this.renderTable}
                                     rendered={!showButton} disableRowHover/>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewJobPositionListTable";
    title = "Job Positions";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.job_position || item.id)) {
            console.log('renderItem', item)
            const {
                id, data: {
                    created_at, job_category, name, desc, doc, client
                }
            } = item.job_position || item;

            if(!item.ctrl_refs) {
                item.ctrl_refs = {};
            }

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{name || 'N/A'}</div>
                <div className="td">{job_category ? job_category.name : 'N/A'}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full padding-10">
                <div className="td flex padding-0 margin-0">
                    <SelectJobPositionInput ref={this.onSetRef} name="job_position" placeholder="Add Job Position..."
                                            required className="no-border-radius-r form-control"
                                            onChange={this.onChange}/>
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
            <div className="td">Job Title</div>
            <div className="td">Job Category</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default NewJobPositionListTableWrapper;
