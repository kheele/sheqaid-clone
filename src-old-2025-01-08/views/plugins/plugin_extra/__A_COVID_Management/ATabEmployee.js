import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {Dates, Permissions} from "utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import Popover from 'components/popovers/Popover';
import {Button, ClearableInput, ProfilePic} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ProfileDialog from 'views/plugins/plugin_hr_management/Employees/forms/ProfileDialog';

@observer
class ATabEmployee extends React.Component {

    @observable
    state = {
        lists: {
            times: ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year"]
        },
        selectedTime: "Today",
        printReportsType: null,
        printReports: false
    };

    constructor(props) {
        super(props);

        this.onLoaded = this.onLoaded.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);

        this.onNewItem = this.onNewItem.bind(this);

        this.onNew = this.onNew.bind(this);
        this.onViewProfile = this.onViewProfile.bind(this);
        this.onViewStatus = this.onViewStatus.bind(this);
        this.onExportToSpreadsheet = this.onExportToSpreadsheet.bind(this);
        this.onExportToSpreadsheetDateRange = this.onExportToSpreadsheetDateRange.bind(this);

        this.onChangeTime = this.onChangeTime.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.renderTimeItem = this.renderTimeItem.bind(this);
    }

    @computed get path() {
        return {path: this.props.path + 'list/by_employee', data: this.state.selectedTime};
    }

    onLoaded(list) {
        const {selectedTime} = this.state;
        if (!list) {
            if (selectedTime === "Today") {
                this.state.selectedTime = "Yesterday";
            } else if (selectedTime === "Yesterday") {
                this.state.selectedTime = "This Week";
            } else if (selectedTime === "This Week") {
                this.state.selectedTime = "Last Week";
            } else if (selectedTime === "Last Week") {
                this.state.selectedTime = "This Month";
            } else if (selectedTime === "This Month") {
                this.state.selectedTime = "Last Month";
            } else if (selectedTime === "Last Month") {
                this.state.selectedTime = "This Year";
            } else {
                return;
            }
            setTimeout(() => {
                this.refs.root.refs.body.onLoadList();
            }, 0);
        }
    }

    async onNew(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        const {id} = item._group;
        const val = await window.neonBinding.events.emit('plugin_sheq_assist/employees/find_by_id', id);
        let {
            data: {
                created_at,
                fname,
                lname,
                optional_info,
                client,
                project,
                site,
                client_id,
                project_id,
                site_id
            }
        } = val;

        if (optional_info && optional_info.department) {
            const res = await window.neonBinding.events.emit('plugin_sheq_assist/employees/departments/find_by_id', optional_info.department.id);
            optional_info.department = res;
        }
        if (optional_info && optional_info.job_position) {
            const res = await window.neonBinding.events.emit('plugin_sheq_assist/employees/job-positions/find_by_id', optional_info.job_position.id);
            optional_info.job_position = res;
        }

        let res = await window.neonBinding.events.emit('plugin_sheq_assist/clients/find_by_id', client ? client.id : client_id);
        val.data.client = res;
        res = await window.neonBinding.events.emit('plugin_sheq_assist/projects/find_by_id', project ? project.id : project_id);
        val.data.project = res;
        res = await window.neonBinding.events.emit('plugin_sheq_assist/sites/find_by_id', site ? site.id : site_id);
        val.data.site = res;

        this.refs.root.onNew(evt, elem, val);
    }

    async onViewProfile(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        const {id} = item._group;
        const val = await window.neonBinding.events.emit('plugin_sheq_assist/employees/find_by_id', id);
        let {
            data: {
                created_at,
                fname,
                lname,
                optional_info,
                client,
                project,
                site,
                client_id,
                project_id,
                site_id
            }
        } = val;

        if (optional_info && optional_info.department) {
            const res = await window.neonBinding.events.emit('plugin_sheq_assist/employees/departments/find_by_id', optional_info.department.id);
            optional_info.department = res;
        }
        if (optional_info && optional_info.job_position) {
            const res = await window.neonBinding.events.emit('plugin_sheq_assist/employees/job-positions/find_by_id', optional_info.job_position.id);
            optional_info.job_position = res;
        }

        let res = await window.neonBinding.events.emit('plugin_sheq_assist/clients/find_by_id', client ? client.id : client_id);
        val.data.client = res;
        res = await window.neonBinding.events.emit('plugin_sheq_assist/projects/find_by_id', project ? project.id : project_id);
        val.data.project = res;
        res = await window.neonBinding.events.emit('plugin_sheq_assist/sites/find_by_id', site ? site.id : site_id);
        val.data.site = res;

        const profileDialog = this.refs.root.getDialogByRef("profileDialog");
        profileDialog && profileDialog.open(val);
    }

    onViewStatus(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
//        this.refs.statusDialog.open(item);
    }

    onExportToSpreadsheet(date_range) {
//        progressDialog.open("Creating Return To Work Case Spreadsheet File. Please wait...");
        const {onCreateReportsOptions} = this.props;
        const {printReportsType} = this.state;
        if (onCreateReportsOptions && printReportsType) {
            date_range.type = printReportsType;
        }
        window.neonBinding.events.emit(this.props.path + 'export-excel', date_range).then(res => {
            if (res === "EMPTY") {
                infoDialog.open(<React.Fragment>
                    <p>There are no reports to generate from the date range you selected</p>
                </React.Fragment>);
            } else {
                infoDialog.open(<React.Fragment>
                    <p>Reports successfully generated.</p>
                    <p><small>The file will be automatically downloaded</small></p>
                </React.Fragment>);
                saveFileAs(res, `Employee-COVID-Report_${Dates.formatDate(new Date())}.xlsx`);
            }
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            this.state.printReports = false;
            progressDialog.close();
        });
    }

    onExportToSpreadsheetDateRange(e, el) {
        const {onCreateReportsOptions} = this.props;
        if (onCreateReportsOptions) {
            onCreateReportsOptions(e, el).then(value => {
                this.state.printReportsType = value;
                this.state.printReports = true;
            });
        } else {
            this.state.printReports = true;
        }
    }

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
        const {permissions_other} = storage.loggedUser.user.data;
        const perm = (permissions_other || []).find(v => v.key === "COVID Reports");

        return <div className="left-buttons pull-left flex">
            <Button className="btn btn-primary fixed-flex _888 border-radius-l-3" onClick={this.onChangeTime}>
                <ChangeTimeText state={this.state}/>
                <i className="fa fa-angle-down icon-right"/>
            </Button>
            {Permissions.allowCreate(perm) &&
                <Button className="btn btn-primary border-radius-r-3" onClick={this.onExportToSpreadsheetDateRange}>
                    <i className="fa fa-chart-bar icon-left"/>Create Reports (Spreadsheet)
                </Button>}
            {Permissions.allowCreate(perm) &&
                <DateRangeReports state={this.state} onSubmit={this.onExportToSpreadsheet}/>}
        </div>;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {renderPopoverOptions} = this.props;
        if (renderPopoverOptions) {
            return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
        }
        return <Options idx={idx} location="top" permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={this.onViewProfile} faIconLeft="eye" title="View Profile"/>
            <NavItem action="view" onClick={this.onViewStatus} faIconLeft="eye" title="View Details"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="employee" type="text" placeholder="Employee" className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead/>;
    }

    onNewItem(item) {
        const {employee} = item.data;
        const existingItemGroup = this.refs.root.list.find(({_group: group, list}) => {
            return group.id === employee.id;
        });

        if (existingItemGroup) {
            existingItemGroup.list.push(item);
            this.refs.root.list.replaceIf(existingItemGroup, v => v.id === existingItemGroup.id);
        } else {
            const {id, fname, lname} = employee;
            this.refs.root.list.pushFirst({_group: {id, fname, lname}, list: [item]});
        }
    }

    renderItem(n, onClick) {
        let item = this.refs.root.list[n];
//        console.log(item)
        const {_group: group, list} = item;
        return <TRow key={"item-" + n}>
            <div className="td padding-5">
                <ProfilePic profilePic="employees" id={group.id} readonly className="x50 hor-center margin-b-5"/>
                <h2 className="text-center margin-t-0 margin-b-0">{group.lname + " " + group.fname}</h2>
                <h3 className="text-center pull-left">{list.length}</h3>
                <Button idx={n} className="btn btn-primary fa fa-eye pull-right margin-t-5 margin-r-50"
                        onClick={onClick}/>
                <Button idx={n} className="btn btn-primary fa fa-edit pull-right margin-t-5" onClick={this.onNew}/>
            </div>
        </TRow>;
    }

    render() {
        const {children, pageId, pageTitle, pageTitleSingular, NewDialog} = this.props;
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={pageId}
            pageTitle={pageTitle}
            pageTitleSingular={pageTitleSingular}
            path={this.path}
            noAnimation={true}
            onLoaded={this.onLoaded}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            {NewDialog && <NewDialog ref="newDialog" path={this.path}/>}

            <ProfileDialog ref="profileDialog" path={this.path}/>

            <Popover key="popover" ref="popover"/>
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

export default ATabEmployee;
