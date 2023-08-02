import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {Dates, execWhen, isWeb, Permissions} from "utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import Popover from 'components/popovers/Popover';
import {
    Button,
    ClearableInput,
    Clickable,
    DateRangeInput,
    ProfilePic,
    SelectEmployeeInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import Submissions from './Submissions';

import ProfileDialog from 'views/plugins/plugin_hr_management/Employees/forms/ProfileDialog';
import EditClientDialog from 'views/plugins/plugin_general/Clients/EditDialog';

@observer
class ATab extends React.Component {

    @observable
    state = {
        lists: {
            times: ["Today", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year"]
        },
        selectedTime: "This Month",
        submitReportsType: null,
        submitReports: false
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
        this.onAddBusinessID = this.onAddBusinessID.bind(this);
        this.onSubmitDataOptions = this.onSubmitDataOptions.bind(this);
        this.onSubmitData = this.onSubmitData.bind(this);
        
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.renderTimeItem = this.renderTimeItem.bind(this);
    }
    
    componentDidMount() {
        execWhen(() => this.changeTimeBtn).then(changeTimeBtn => {
            $(changeTimeBtn.getDOMNode()).click();
        });
    }
    
    @computed get path() {
        return {path: this.props.path + 'list/by_employee', data: this.state.selectedTime};
    }
    
    onLoaded(list) {
        const {selectedTime} = this.state;
        if(!list) {
//            if(selectedTime === "Today") {
//                this.state.selectedTime = "Yesterday";
//            } else if(selectedTime === "Yesterday") {
//                this.state.selectedTime = "This Week";
//            } else if(selectedTime === "This Week") {
//                this.state.selectedTime = "Last Week";
//            } else if(selectedTime === "Last Week") {
//                this.state.selectedTime = "This Month";
//            } else if(selectedTime === "This Month") {
//                this.state.selectedTime = "Last Month";
//            } else if(selectedTime === "Last Month") {
//                this.state.selectedTime = "This Year";
//            } else {
//                return;
//            }
//            setTimeout(() => {
//                this.refs.root.refs.body.onLoadList();
//            }, 0);
        }
    }
    
    async onNew(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        const {id} = item._group;
        const val = await window.neonBinding.events.emit('plugin_sheq_assist/employees/find_by_id', id);
        this.refs.root.onNew(evt, elem, val);
    }
    
    async onViewProfile(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        const {id} = item._group;
        const val = await window.neonBinding.events.emit('plugin_sheq_assist/employees/find_by_id', id);
        const profileDialog = this.refs.root.getDialogByRef("profileDialog");
        profileDialog && profileDialog.open(val);
    }
    
    onViewStatus(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.statusDialog.open(item);
    }
    
    onAddBusinessID(evt, el) {
        const {onComplete} = el.props;
        const {selectedClient} = storage.selected;
        this.refs.editClientDialog.open(selectedClient).then(res => {
            onComplete();
        });
    }
    
    onSubmitDataOptions(e, el) {
        const {onSubmitDataOptions} = this.props;
        if(onSubmitDataOptions) {
            onSubmitDataOptions(e, el).then(value => {
                this.state.submitReportsType = value; 
                this.state.submitReports = true; 
            });
        } else {
            this.state.submitReports = false;    
        }
    }

    onSubmitData(date_range) {
        const onRun = () => {
            const {selectedClientCovidBusinessId: businessId} = storage.selected;
            if(!businessId) {
                if(storage.is.isConsultant) {
                    infoDialog.open(<React.Fragment>
                        <p>The selected company does not have <b>Business ID</b></p>
                        <p>Please <Clickable onComplete={onRun} onClick={this.onAddBusinessID}>
                                <a href="#">Add Business ID</a>
                            </Clickable>
                        </p>
                    </React.Fragment>);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>The company does not have <b>Business ID</b></p>
                        <p>Please add Business ID</p>
                    </React.Fragment>);
                }
                return;
            }
            date_range.business_id = businessId;
    //        progressDialog.open("Creating Return To Work Case Spreadsheet File. Please wait...");
            const {onCreateReportsOptions, apiSubmissionFnName} = this.props;
            const {submitReportsType} = this.state;
            date_range.type = submitReportsType;

            progressDialog.open();
            window.neonBinding.events.emit(this.props.path + 'export-excel', date_range).then(async res => {
                if(res === "EMPTY") {
                    infoDialog.open(<React.Fragment>
                        <p>There are no reports to generate from the date range selected</p>
                    </React.Fragment>);
                    progressDialog.close();
                    return;
                }
                if(submitReportsType === 'API') {
                    try {
                        const resSubmit = await Submissions[apiSubmissionFnName](businessId, res);
                        if(!resSubmit) {
                            infoDialog.open(<React.Fragment>
                                <p>An error occurred while submitting data. Please try again</p>
                            </React.Fragment>);
                        } else if(resSubmit === 'NOT_AUTHORISED') {
                            infoDialog.open(<React.Fragment>
                                <p>You are not authorised to performed the request</p>
                            </React.Fragment>);
                        } else if(resSubmit === 'LOGIN_FAILED') {
                            infoDialog.open(<React.Fragment>
                                <p>Login failed. Please try again</p>
                            </React.Fragment>);
                        } else if(resSubmit === 'LOGIN_ERR') {
                            infoDialog.open(<React.Fragment>
                                <p>An error occurred while logging in. Please try again</p>
                            </React.Fragment>);
                        } else if(resSubmit === 'LOGOUT_FAILED') {
                            infoDialog.open(<React.Fragment>
                                <p>Logout failed. Please try again</p>
                            </React.Fragment>);
                        } else if(resSubmit === 'LOGOUT_ERR') {
                            infoDialog.open(<React.Fragment>
                                <p>An error occurred while logging out. Please try again</p>
                            </React.Fragment>);
                        } else {
                            infoDialog.open(<React.Fragment>
                                <p>Records successfully submitted</p>
                            </React.Fragment>);
                        }
                        progressDialog.close();
                    } catch(err) {
                        console.error(err);
                        progressDialog.close();
                        infoDialog.open(<React.Fragment>
                            <p>An error occurred while submitting data. Please try again</p>
                        </React.Fragment>);
                    }
                } else {
                    progressDialog.close();
                    if(isWeb()) {
                        infoDialog.open(<React.Fragment>
                            <p>Reports successfully generated.</p>
                            <p><small>The file will be automatically downloaded</small></p>
                        </React.Fragment>);
                        saveFileAs(res, `COVID-Report_${Dates.formatDate(new Date())}.xlsx`);
                    } else {
                        infoDialog.open(<React.Fragment>
                            <p>Reports successfully generated.</p>
                            <p>Saved in the following folder:</p>
                            <p><small>{res.path}</small></p>
                            <p><small>The file will open after 3 seconds</small></p>
                        </React.Fragment>);
                    }
                }
            }).catch(err => {
                console.error(err);
                progressDialog.close();
            }).finally(() => {
                this.state.submitReports = false;
            });  
        };
        onRun();
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
            const {body, body: {state}} = this.refs.root.refs;
            state.dataLoaded = false;
            body.onLoadList().then(res => {
                console.log("dataStale", body.dataStale)
                if (body.dataStale)
                    return;
                
                if(res) {
                    if(res.isEmpty()) {
                        body.resultsEmpty();
                    }
                    state.list = res;
                    state.dataLoaded = true;
                    return res.isEmpty();
                } else {
                    body.resultsEmpty();
                    state.dataLoaded = true;
                    return true;
                }
            }).catch(e => {
                console.log(e)
                state.dataError = true;
                state.dataLoaded = true;
            });
        }, 0);
    }

    renderTimeItem(item, n) {
        const {selectedTime} = this.state;
        const className = item === selectedTime ? "active" : "";
        return <NavItem key={n} idx={n} onClick={this.onSelectTime} title={item} className={className}/>;
    }

    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        if(isEmployee) return null;
        
        const isReadonly = isEmployee || isContractorView;
        const {pageId} = this.props;
        const {permissions_other} = storage.loggedUser.user.data;
        const perm = (permissions_other || []).find(v => v.key === "COVID Reports");
        
        const timeOptionsBorderClass = pageId.startsWith("PositiveUnApprovedTab") ? "" : " border-radius-l-3";
        return <div className="left-buttons pull-left flex">
            <Button ref={ref => this.changeTimeBtn = ref} className={"btn btn-primary fixed-flex _888" + timeOptionsBorderClass} onClick={this.onChangeTime}>
                <ChangeTimeText state={this.state}/>
                <i className="fa fa-angle-down icon-right"/>
            </Button>
            {!isEmployee && (!isReadonly && Permissions.allowCreate(perm) && !pageId.startsWith("PositiveUnApprovedTab")) && <Button className="btn btn-primary border-radius-r-3" onClick={this.onSubmitDataOptions}>
                <i className="fa fa-chart-bar icon-left"/>Submit Data
            </Button>}
            {!isEmployee && (!isReadonly && Permissions.allowCreate(perm) && !pageId.startsWith("PositiveUnApprovedTab")) && <DateRangeReports state={this.state} onSubmit={this.onSubmitData}/>}
        </div>;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {renderPopoverOptions} = this.props;
        if(renderPopoverOptions) {
            return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
        }
        return <Options idx={idx} location="top" permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={this.onViewProfile} faIconLeft="eye" title="View Profile"/>
            <NavItem action="view" onClick={this.onViewStatus} faIconLeft="eye" title="View Details"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectEmployeeInput name="employee" placeholder="Employee..." required className="form-control" onChange={onChange}/>
            <DateRangeInput name="date_range" className="fixed-flex min-w-520 form-control" placeholder="" onChange={onChange}>
                <label className="min-w-95">Start Date</label>
                <label className="min-w-90">End Date</label>
            </DateRangeInput>
        </div>;
    }

    renderTHead() {
        return <THead />;
    }

    onNewItem(item) {
        const {employee} = item.data;
        const existingItemGroup = this.refs.root.list.find(({_group: group, list}) => {
            return group.id === employee.id;
        });
        
        if(existingItemGroup) {
            existingItemGroup.list.push(item);
            this.refs.root.list.replaceIf(existingItemGroup, v => v.id === existingItemGroup.id);
        } else {
            const {id, fname, lname} = employee;
            this.refs.root.list.pushFirst({_group: {id, fname, lname}, list: [item]});
        }
    }

    renderItem(n, onClick) {
        let item = this.refs.root.list[n];
//        console.log(item.list.map(v => v.data.project_id))
        const {_group: group, list} = item;
        return <TRow key={"item-" + n}>
            <div className="td padding-5">
                <ProfilePic profilePic="employees" id={group.id} readonly className="x50 hor-center margin-b-5"/>
                <h2 className="text-center margin-t-0 margin-b-0">{group.lname + " " + group.fname}</h2>
                <h3 className="text-center pull-left">{list.length}</h3>
                <Button idx={n} className="btn btn-primary fa fa-eye pull-right margin-t-5 margin-r-50" onClick={onClick}/>
                <Button idx={n} className="btn btn-primary fa fa-edit pull-right margin-t-5" onClick={this.onNew}/>
            </div>
        </TRow>;
    }
    
    render() {
        const {children, pageId, pageTitle, pageTitleSingular, NewDialog, EmployeeDialog} = this.props;
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
                <EmployeeDialog ref="statusDialog" />
                
                <Popover key="popover" ref="popover"/>
                <EditClientDialog ref="editClientDialog"/>
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
        this.props.state.submitReports = false;
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
        const {state: {submitReports}, onSubmit} = this.props;
        return submitReports && <div className="reports-date-range flex min-w-450">
            <ClearableInput name="date_from" type="date" placeholder="Date From..." className="form-control" onChange={this.form.onChange}/>
            <ClearableInput name="date_to" type="date" placeholder="Date To..." className="form-control" onChange={this.form.onChange}/>
            <Button className="btn btn-primary fixed-flex border-radius-l-3" text="Close" onClick={this.onClose}/>
            <Button className="btn btn-primary fixed-flex border-radius-r-3" text="Submit" onClick={this.onSubmit}/>
        </div>;
    }
}

export default ATab;
