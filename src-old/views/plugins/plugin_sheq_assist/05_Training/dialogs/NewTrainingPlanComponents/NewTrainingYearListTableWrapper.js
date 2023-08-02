// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {
    ActionsButton, Button,
    ClearableInput,
} from 'components/inputs';
import {
    NewEmployeeListTable,
    NewTrainingYearListTable
} from 'components/FormTableComponents';

import NewJobPositionListTableWrapper from "./NewJobPositionListTableWrapper";
import NewTrainingCourseListTableWrapper from "./NewTrainingCourseListTableWrapper";
import ASelectWrapper from "./ASelectWrapper";
import ANewListTable from "../../../../../../components/FormTableComponents/ANewListTable";
import {THead, TRow} from "../../../../../../components/tables";
import style from "components/FormTableComponents/ANewListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewTrainingYearListTableWrapper">
@observer
class NewTrainingYearListTableWrapper extends ASelectWrapper {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            select_employees: [
                {text: "Job Position(s)", value: "JobPositions", checked: false},
                {text: "Course(s)", value: "Courses", checked: false}
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
        const {excludeJobPositionList, excludeCourseList} = this.props;
        if (excludeCourseList && !excludeJobPositionList) {
            this.state.select_employees = "JobPositions";
        } else if (!excludeCourseList && excludeJobPositionList) {
            this.state.select_employees = "Courses";
        }
    }

    @computed get showSelectEmployees() {
        const {excludeJobPositionList, excludeCourseList} = this.props;
        console.log('NewTrainingYearListTableWrapper', excludeJobPositionList, excludeCourseList)
        return !excludeJobPositionList && !excludeCourseList;
    }

    renderTable(item, n) {
        const {
            state,
            showSelectEmployees,
            props: {root, excludeEmployeeList, excludeJobPositionList, excludeCourseList, onChange}
        } = this;

        let id;
        if(root === 'TrainingYear') {
            id = item.year || item;
        }

        return <React.Fragment>
            {!excludeEmployeeList && <label className="margin-0 margin-t-10 pull-left font-size-13">
                Employee(s) To Exclude
                <ActionsButton idx={n} className="btn btn-primary fixed-flex w-40 margin-0 margin-l-10" icon="edit"
                               onClick={this.onOpenEmployeeListTable}/>
            </label>}
            {!excludeEmployeeList && <NewEmployeeListTable
                ref={ref => item.ctrl_refs.employee_list_exception = ref}
                name={"employee_list_exception-" + n}
                disableOtherPerson
                closeable
                rendered={false}
                onChange={this.form.onChange}
            />}

            {showSelectEmployees && <ClearableInput
                ref={ref => item.ctrl_refs.select_employees = ref}
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
                ref={ref => item.ctrl_refs.newJobPositionListTableWrapper = ref}
                root={root}
                parentName="Years"
                item={item}
                id={id}
                unrendered={!!excludeJobPositionList}
                action="JobPositions"
                state={state}
                excludeTrainingYearList
                excludeCourseList={excludeCourseList}
                onChange={this.form.onChange}
            />
            <NewTrainingCourseListTableWrapper
                ref={ref => item.ctrl_refs.newTrainingCourseListTableWrapper = ref}
                root={root}
                parentName="Years"
                item={item}
                id={id}
                unrendered={!!excludeCourseList}
                action="Courses"
                state={state}
                excludeEmployeeList
                excludeTrainingYearList
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

        let name = `training_year_list`;
        if (item) {
            if (parentName === "JobPositions") {
                name += `__${(item.job_position || item).id}`;
            } else if (parentName === "Courses") {
                name += `__${(item.course_or_module || item).id}`;
            }
        }

        return <div className="row ASelectWrapper">
            {!showButton && <label className="margin-t-10 margin-b-0 padding-b-0">Training Year List</label>}
            {showButton && <label className="margin-0 margin-t-10 pull-left font-size-13">
                Training Year List
                <ActionsButton className="btn btn-primary fixed-flex w-40 margin-0 margin-l-10" icon="edit"
                               onClick={this.onClick}/>
            </label>}
            <ListTable ref="newTrainingYearListTable" name={name} onChange={this.form.onChange} renderTable={this.renderTable}
                                      rendered={!showButton} disableRowHover/>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewTrainingYearListTable";
    title = "Training Years";
    style = style;

    componentWillMount() {
        super.componentWillMount();

        this.selfState.lists = {
            years: Array.range(new Date().getFullYear() - 20, new Date().getFullYear() + 10).reverse()
        };
    }

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && item.year) {
            const {year} = item;

            if(!item.ctrl_refs) {
                item.ctrl_refs = {};
            }

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{year}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={n} className={"tr-readonly margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full padding-10">
                <div className="td flex padding-0 margin-0">
                    <ClearableInput ref={this.onSetRef} name="year" type="select" placeholder="Year" required
                                    className="no-border-radius-r form-control" onChange={this.onChange} values={this.selfState.lists.years} returnValue/>
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
            <div className="td">Training Year</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default NewTrainingYearListTableWrapper;