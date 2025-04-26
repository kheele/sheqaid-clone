import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from "utils/Utils";
import APageListReadWrite from "../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {Button, ClearableInput, SelectUserInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import style from "./Main.lazy.css";
import {listAuditLogs} from "mutations/listByLogged";

@observer
class Main extends React.Component {
    static key = 'AuditTrail';

    pageKey = "AuditTrail";

    @observable
    state = {
        lists: {
            times: ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year"],
            actions: ["Created", "Updated", "Removed", "Uploaded", "Printed"],
            tbl: [
                {label: "Company", value: "plugin_sheq_assist_clients", checked: false},
                {label: "Project", value: "plugin_sheq_assist_projects", checked: false},
                {label: "Site", value: "plugin_sheq_assist_sites", checked: false},
                {label: "User", value: "default_users", checked: false},
                {label: "Contractor", value: "plugin_sheq_assist_contractors", checked: false},
                {label: "Employee", value: "plugin_sheq_assist_employees", checked: false},
                {
                    label: "Baseline Risk Assessment",
                    value: "plugin_sheq_assist_09_risk_assessment_baseline",
                    checked: false
                },
                {
                    label: "Task Base Risk Assessment",
                    value: "plugin_sheq_assist_09_risk_assessment_task_base",
                    checked: false
                },
            ]
        },
        selectedTime: "Today",
        printReports: false
    };

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);

        this.onViewStatus = this.onViewStatus.bind(this);
        this.onExportToSpreadsheet = this.onExportToSpreadsheet.bind(this);
        this.onExportToSpreadsheetDateRange = this.onExportToSpreadsheetDateRange.bind(this);

        this.onChangeTime = this.onChangeTime.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.renderTimeItem = this.renderTimeItem.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            date_from,
            date_to,
            //
            action,
            tbl,
            //
            user_id,
            contractor_user_id,
            supervisor_id,
            employee_id,
            // logged_user_access_type,
        } = filterData || {};

        return listAuditLogs({
            date_from,
            date_to,
            //
            action,
            tbl,
            //
            user_id,
            contractor_user_id,
            supervisor_id,
            employee_id,
            // logged_user_access_type,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    onViewStatus(e, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.statusDialog.open(item);
    }

    onExportToSpreadsheet(date_range) {
//        progressDialog.open("Creating Return To Work Case Spreadsheet File. Please wait...");
        const {onCreateReportsOptions} = this.props;
        const {printReportsType} = this.state;
        if (onCreateReportsOptions && printReportsType) {
            date_range.type = printReportsType;
        }
        workers.emit(this.props.path + 'export-excel', date_range).then(res => {
            if (res === "EMPTY") {
                infoDialog.open(<React.Fragment>
                    <p>There are no reports to generate from the date range you selected</p>
                </React.Fragment>);
            } else {
                infoDialog.open(<React.Fragment>
                    <p>Reports successfully generated.</p>
                    <p><small>The file will be automatically downloaded</small></p>
                </React.Fragment>);
                saveFileAs(res, `Audit-Trail-Report_${Dates.formatDate(new Date())}.xlsx`);
            }
        }).finally(() => {
            this.state.printReports = false;
            progressDialog.close();
        });
    }

    onExportToSpreadsheetDateRange(e, el) {
        this.state.printReports = true;
    }

    //8106066862084, lname: Makolane, fname: Shadrack - Donkerhoek
    //
    //9101065262088, lname: Mothibedi, fname: Motsaka - Savanna <
    //9903215747086, lname: Sekalo, fname: Mmatlou - Savanna <
    //8901096347084, lname: Moriri, fname: Rex - Savanna <
    //9011286042088, lname: Mashumu, fname: Mosebu - Savanna <

    //Pretoria East = Savanna & Monthly = Overhead
    onChangeTime(e, el) {
        const {lists: {times: list}} = this.state;

        const jqElem = $(el.getDOMNode());
        const {left} = jqElem.offset();
        this.refs.popover.settings({
            style: {left, top: 60, width: 'auto', minWidth: 200},
            isDialog: true,
            contentNode: <div className="ATabPopoveContent">
                <p className="padding-t-10 text-center">--- Select ---</p>
                <hr className="margin-t-0 margin-b-0"/>
                {list.map(this.renderTimeItem)}
            </div>
        }).open();
    }

    onSelectTime(e, elem) {
        const {title} = elem.props;
        this.state.selectedTime = title;
        setTimeout(() => {
            this.refs.root.refs.body.onLoadList();
        }, 0);
    }

    renderTimeItem(item, n) {
        const {selectedTime} = this.state;
        const className = item === selectedTime ? "active" : "";
        return <NavItem key={n} idx={n} onClick={this.onSelectTime} title={item} className={className}/>;
    }

    renderLeftButtons() {
        return null; /*<div className="left-buttons pull-left flex">
            <Button className="btn btn-primary fixed-flex _888 border-radius-l-3" onClick={this.onChangeTime}>
                <ChangeTimeText state={this.state}/>
                <i className="fa fa-angle-down icon-right"/>
            </Button>
            <Button className="btn btn-primary border-radius-r-3" onClick={this.onExportToSpreadsheetDateRange}>
                <i className="fa fa-chart-bar icon-left"/>Create Reports (Spreadsheet)
            </Button>
            <DateRangeReports state={this.state} onSubmit={this.onExportToSpreadsheet}/>
        </div>;*/
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove}) {
        return <div>
            <NavItem key={"item-view-" + idx} onClick={onView} faIconLeft="eye" title="View Profile"/>
            <NavItem idx={idx} onClick={this.onViewStatus} faIconLeft="eye" title="View Details"/>
        </div>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="date_from" type="date" placeholder="Date From..."
                            className="form-control min-w-190 fixed-flex" onChange={onChange}/>
            <ClearableInput name="date_to" type="date" placeholder="Date To..."
                            className="form-control min-w-190 fixed-flex" onChange={onChange}/>
            <SelectUserInput name="user" className="form-control" onChange={onChange}/>
            <ClearableInput name="action" type="select" placeholder="Action..."
                            className="form-control min-w-190 fixed-flex" onChange={onChange}
                            values={this.state.lists.actions} returnValue/>
            <ClearableInput name="tbl" type="select" placeholder="Category..." className="form-control"
                            onChange={onChange} values={this.state.lists.tbl} returnValue/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-140">Date Created</div>
            <div className="td fixed-flex min-w-140">Time Created</div>
            <div className="td fixed-flex min-w-360">Administrator / User</div>
            <div className="td fixed-flex min-w-300">Action</div>
            <div className="td">Log</div>
            {/*<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>*/}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-0"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        let item = this.refs.root.list[n];
        const {id, data: {tbl, record_name, company_id, user, record, action, created_at}} = item;

        return <TRow key={"item-" + n} className="w-full min-h-40">
            <div className="td fixed-flex min-w-140">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-140">{Dates.formatTime(created_at)}</div>
            <div className="td fixed-flex min-w-360">{user.full_name}</div>
            <div className="td fixed-flex min-w-300">{action.toTitleCase()}</div>
            <div className="td">
                <b className="margin-r-5">{action.toTitleCase()}</b> {record_name.singular + (record.id ? (" (" + record.id + ")") : "")}
            </div>
            {/*<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">*/}
            {/*    <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>*/}
            {/*</div>*/}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-0"/>
        </TRow>;
    }

    render() {
        return <APageListReadWrite
            ref="root"
            page={this}
            hasCreate={() => false}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Audit Log"
            pageTitleSingular="audit log"
            onLoadList={this.onLoadList}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>

        </APageListReadWrite>;
    }
}

@observer
class ChangeTimeText extends React.Component {

    render() {
        const {state: {selectedTime}} = this.props;
        return selectedTime;
    }
}

@observer
class DateRangeReports extends React.Component {

    constructor() {
        super();

        this.onClose = this.onClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.form = new Form();
    }

    onClose() {
        this.props.state.printReports = false;
    }

    onSubmit() {
        const {form} = this;

        if (!form.isValid('date_from')) {
            infoDialog.open('Date From is required');
            return;
        }
        if (!form.isValid('date_to')) {
            infoDialog.open('Date To is required');
            return;
        }

        const {
            date_from, date_to
        } = form.data;
        const data = {
            date_from: date_from.getTime(),
            date_to: date_to.getTime()
        };

        console.log(data)

        this.props.onSubmit(data);
    }

    render() {
        const {state: {printReports}, onSubmit} = this.props;
        return printReports && <div className="reports-date-range flex">
            <ClearableInput name="date_from" type="date" placeholder="Date From..." className="form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="date_to" type="date" placeholder="Date To..." className="form-control"
                            onChange={this.form.onChange}/>
            <Button className="btn btn-primary fixed-flex border-radius-l-3" text="Close" onClick={this.onClose}/>
            <Button className="btn btn-primary fixed-flex border-radius-r-3" text="Submit" onClick={this.onSubmit}/>
        </div>;
    }
}

export default Main;
