// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import Form from '../../../../utils/Form';

import {Dates, isWeb, Permissions} from "../../../../utils/Utils";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import Popover from '../../../../components/popovers/Popover';
import {TabledTopPanel} from '../../../../components/tables';
import {Button, ClearableInput, Clickable} from '../../../../components/inputs';
import Calendar from '../../../../components/calendar';

import Submissions from './Submissions';

import ProfileDialog from '../../plugin_hr_management/Employees/ProfileDialog';
import EditClientDialog from '../../plugin_general/Clients/EditDialog';

// </editor-fold>

@observer
class ATab extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        submitReportsType: null,
        submitReports: false,

        list: [],
        selectedYear: null,
        selectedMonth: null,
        selectedDate: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNew = this.onNew.bind(this);

        this.onMonthAction = this.onMonthAction.bind(this);
        this.onViewMonthOptions = this.onViewMonthOptions.bind(this);

        this.onAddBusinessID = this.onAddBusinessID.bind(this);
        this.onSubmitDataOptions = this.onSubmitDataOptions.bind(this);
        this.onSubmitData = this.onSubmitData.bind(this);

        this.onLoadList = this.onLoadList.bind(this);
        this.onOpenListDialog = this.onOpenListDialog.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onChangeByDate = this.onChangeByDate.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.renderYearItem = this.renderYearItem.bind(this);
        this.renderMonthItem = this.renderMonthItem.bind(this);
        this.renderDay = this.renderDay.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderRightButtons = this.renderRightButtons.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const d = new Date();
        const selectedYear = d.getFullYear();
        const selectedMonth = Dates.getMonthsStr(d);
        const selectedDate = d.getDate();
        extendObservable(this.state, {selectedYear, selectedMonth, selectedDate});
        this.onLoadList();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNew">
    onNew(e, elem) {
        this.refs.newDialog.open().then(item => {
//            this.state.list.pushFirst(item);
        });
    }

    // </editor-fold>

    onMonthAction(evt, el) {
        const {action, month} = el.props;
        let {selectedYear, selectedMonth, list} = this.state;

        const onRun = (action, month, selectedYear, list) => {
            if (list.isEmpty()) {
                return infoDialog.open(`No records found for ${month} ${selectedYear} Data`);
            }

            const items = [];
            list.forEach(({_group, list}) => {
                items.push(...list);
            });
            this.onOpenListDialog(<h3
                className="margin-0 margin-b-15 padding-10 bg-white">{action} {month} {selectedYear} Data</h3>, action, items);
        };

        if (month === selectedMonth) {
            onRun(action, month, selectedYear, list);
        } else {
            progressDialog.open(`Loading ${month} ${selectedYear} records...`);
            selectedMonth = Dates.getMonthsNum(month);
            neonBinding.events.emit(this.props.path + 'list/by_employee', selectedYear, selectedMonth).then(res => {
                onRun(action, month, selectedYear, res);
            }).finally(() => {
                setTimeout(() => progressDialog.close());
            });
        }
    }

    onViewMonthOptions(evt, btn) {
        const {selectedYear} = this.state;
        const {value: month} = btn.props;
        const jqElem = $(btn.getDOMNode());
        const {left, top} = jqElem.offset();

        popover.settings({
            style: {left: left, top: top + jqElem.height() + 15, width: 'auto', minWidth: 140},
            contentNode: <div>
                <p className="padding-t-10 text-center">--- {month} {selectedYear} Options ---</p>
                <hr className="margin-t-0 margin-b-0"/>
                <NavItem key={1} action="Submit" month={month} onClick={this.onMonthAction} title={`Submit Data`}/>
                <NavItem key={2} action="View" month={month} onClick={this.onMonthAction} title={`View Data`}/>
                <NavItem key={3} action="Print" month={month} onClick={this.onMonthAction} title={`Print Data`}/>
            </div>
        }).open();
    }

    // <editor-fold defaultstate="collapsed" desc="onAddBusinessID">
    onAddBusinessID(evt, el) {
        const {onComplete} = el.props;
        const {selectedClient} = storage.selected;
        this.refs.editClientDialog.open(selectedClient).then(res => {
            onComplete();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitDataOptions">
    onSubmitDataOptions(e, el, list) {
        const {onSubmitDataOptions} = this.props;
        if (onSubmitDataOptions) {
            onSubmitDataOptions(e, el).then(value => {
                this.state.submitReportsType = value;
                if (list) {
                    this.onSubmitData({list: list.slice().map(v => toJS(v))});
                } else {
                    this.state.submitReports = true;
                }
            });
        } else {
            this.state.submitReports = false;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmitData">
    onSubmitData(date_range) {
        const onRun = () => {
            const {selectedClientCovidBusinessId: businessId} = storage.selected;
            if (!businessId) {
                if (storage.is.isConsultant) {
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
                if (res === "EMPTY") {
                    infoDialog.open(<React.Fragment>
                        <p>There are no reports to generate from the date range selected</p>
                    </React.Fragment>);
                    progressDialog.close();
                    return;
                }
                if (submitReportsType === 'API') {
                    try {
                        const resSubmit = await Submissions[apiSubmissionFnName](businessId, res);
                        if (!resSubmit) {
                            infoDialog.open(<React.Fragment>
                                <p>An error occurred while submitting data. Please try again</p>
                            </React.Fragment>);
                        } else if (resSubmit === 'NOT_AUTHORISED') {
                            infoDialog.open(<React.Fragment>
                                <p>You are not authorised to performed the request</p>
                            </React.Fragment>);
                        } else if (resSubmit === 'LOGIN_FAILED') {
                            infoDialog.open(<React.Fragment>
                                <p>Login failed. Please try again</p>
                            </React.Fragment>);
                        } else if (resSubmit === 'LOGIN_ERR') {
                            infoDialog.open(<React.Fragment>
                                <p>An error occurred while logging in. Please try again</p>
                            </React.Fragment>);
                        } else if (resSubmit === 'LOGOUT_FAILED') {
                            infoDialog.open(<React.Fragment>
                                <p>Logout failed. Please try again</p>
                            </React.Fragment>);
                        } else if (resSubmit === 'LOGOUT_ERR') {
                            infoDialog.open(<React.Fragment>
                                <p>An error occurred while logging out. Please try again</p>
                            </React.Fragment>);
                        } else if (resSubmit === 'FAILED_API_UPDATE') {
                            infoDialog.open(<React.Fragment>
                                <p>Records successfully submitted</p>
                                <p>However, some records failed to update the submittion status.</p>
                            </React.Fragment>);
                        } else {
                            infoDialog.open(<React.Fragment>
                                <p>Records successfully submitted</p>
                            </React.Fragment>);
                        }
                        progressDialog.close();
                    } catch (err) {
                        console.error(err);
                        progressDialog.close();
                        infoDialog.open(<React.Fragment>
                            <p>An error occurred while submitting data. Please try again</p>
                        </React.Fragment>);
                    }
                } else {
                    progressDialog.close();
                    if (isWeb()) {
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

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    onLoadList() {
        let {selectedDate, selectedYear, selectedMonth} = this.state;
        progressDialog.open(`Loading ${selectedMonth} ${selectedYear} records...`);
        selectedMonth = Dates.getMonthsNum(selectedMonth);
        neonBinding.events.emit(this.props.path + 'list/by_employee', selectedYear, selectedMonth).then(res => {
            this.state.list = res;
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    onOpenListDialog(title, action, list) {
        const {listDialog} = this.refs;
        listDialog && listDialog.extraProp('title', title).extraProp('action', action).open(list);
    }

    // <editor-fold defaultstate="collapsed" desc="onSelectDay">
    onSelectDay(day) {
        const {list} = this.state;
        const subList = list.filter(({_group, list}) => list.anyMatch(({
                                                                           id,
                                                                           data: {date, date_split}
                                                                       }) => day.equals(date)));

        if (subList.isEmpty()) {
            return infoDialog.open("No records available");
        }

        const items = [];
        subList.forEach(({_group, list}) => {
            items.push(...list.filter(({id, data: {date, date_split}}) => {
                return day.equals(date);
            }));
        });

//        this.onOpenListDialog(<h3 className="margin-0 margin-b-15 padding-10 bg-white">{Dates.formatDate(day)} Data</h3>, "View", items);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeByDate">
    onChangeByDate(evt, btn) {
        const {type, value} = btn.props;
        if (type === "Year") {
            const createList = () => {
                const list = [];
                const start = new Date().getFullYear();
                const end = start - 2000;
                for (let value = start; value >= 2000; value--) {
                    list.push(value);
                }
                return list;
            };

            const jqElem = $(btn.getDOMNode());
            const {left} = jqElem.offset();
            this.refs.popover.settings({
                style: {left, top: 60, bottom: 10, width: 'auto', minWidth: 100},
                isDialog: true,
                contentNode: <div>
                    <p className="padding-t-10 text-center">--- Select ---</p>
                    <hr className="margin-t-0 margin-b-0"/>
                    {createList().map(this.renderYearItem)}
                </div>
            }).open();
        } else {
            extendObservable(this.state, {
                selectedMonth: value, selectedDate: 1
            });
            this.onLoadList();
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSelectYear, onSelectMonth">
    onSelectYear(e, elem) {
        const {title} = elem.props;

        const {selectedYear: oldSelectedYear} = this.state;
        this.state.selectedYear = parseInt(title);

        setTimeout(() => {
            this.refs.popover.settings({
                style: {top: 60, bottom: 10, width: 'auto', minWidth: 100},
                isDialog: true,
                className: 'SelectMonthPopover',
                contentNode: <div>
                    <p className="padding-t-10 text-center">--- Select ---</p>
                    <hr className="margin-t-0 margin-b-0"/>
                    {[...Dates.monthsStr.values()].map(this.renderMonthItem)}
                </div>,
                onClickAway: e => {
                    this.state.selectedYear = oldSelectedYear;
                    infoDialog.open('No month was selected');
                }
            }).open();
        }, 800);
    }

    onSelectMonth(e, elem) {
        const {title} = elem.props;

        extendObservable(this.state, {
            selectedMonth: title, selectedDate: 1
        });
        this.onLoadList();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderYearItem, renderMonthItem, renderDay">
    renderYearItem(item, n) {
        const {selectedYear} = this.state;
        const className = item === selectedYear ? "active" : "";
        return <NavItem key={n} idx={n} onClick={this.onSelectYear} title={item} className={className}/>;
    }

    renderMonthItem(item, n) {
        const {selectedMonth} = this.state;
        const className = item === selectedMonth ? "active" : "";
        return <NavItem key={n} idx={n} onClick={this.onSelectMonth} title={item} className={className}/>;
    }

    renderDay(dateItem) {
        return <RenderDay dateItem={dateItem} state={this.state} onOpenListDialog={this.onOpenListDialog}/>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {NewDialog} = this.props;
        const {isEmployee, isContractorView} = storage.is;
        if (isEmployee)
            return null;

        const isReadonly = isEmployee || isContractorView;
        const {pageId} = this.props;
        const {permissions_other} = storage.loggedUser.user.data;
        const perm = (permissions_other || []).find(v => v.key === "COVID Reports");

        return <div className="left-buttons pull-left flex no-border">
            {/*!isEmployee && (!isReadonly && Permissions.allowCreate(perm)) && <Button className="btn btn-primary border-radius-3" onClick={this.onPrintReports}>
     <i className="fa fa-pdf icon-left"/>Print Reports
     </Button>*/}
        </div>
            ;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderRightButtons">
    renderRightButtons() {
        const {NewDialog} = this.props;
        const {isEmployee, isContractorView} = storage.is;
        if (isEmployee)
            return null;

        const isReadonly = isEmployee || isContractorView;
        const {pageId} = this.props;
        const {permissions_other} = storage.loggedUser.user.data;
        const perm = (permissions_other || []).find(v => v.key === "COVID Reports");

        return <div className="right-buttons pull-right flex no-border">
            {!isEmployee && (!isReadonly && Permissions.allowCreate(perm) && !pageId.startsWith("PositiveUnApprovedTab")) &&
                <Button className="btn btn-primary border-radius-l-3" onClick={this.onSubmitDataOptions}>
                    <i className="fa fa-chart-bar icon-left"/>Submit Data
                </Button>}
            {!isEmployee && (!isReadonly && Permissions.allowCreate(perm) && !pageId.startsWith("PositiveUnApprovedTab")) &&
                <DateRangeReports state={this.state} onSubmit={this.onSubmitData}/>}
            {NewDialog && <Button className="btn btn-primary border-radius-r-3 pull-right top-btn-nav__create"
                                  onClick={this.onNew}>
                <i className="fa fa-plus"/> Create
            </Button>}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {children, pageId, pageTitle, pageTitleSingular, NewDialog, EmployeeDialog, ListDialog} = this.props;
        return <div id={pageId} className={"page-content calendar-page"}>
            <div className="page-title">
                <h3>{pageTitle}</h3>
                <TabledTopPanel ref="tabledTopPanel" titleSinglar={pageTitleSingular} titlePlural={pageTitle}>
                    {this.renderLeftButtons()}
                    {this.renderRightButtons()}
                </TabledTopPanel>
                <div className="clearfix"/>
            </div>
            <ViewByPanel
                title=""
                state={this.state}
                onChange={this.onChangeByDate}
                onViewMonthOptions={this.onViewMonthOptions}
            />
            <CalendarWrapper
                state={this.state}
                onSelectDay={this.onSelectDay}
                renderer={this.renderDay}
            />

            <ConfirmDialog ref="removeDialog"/>
            {NewDialog && <NewDialog ref="newDialog" path={this.path}/>}

            <ProfileDialog ref="profileDialog" path={this.path}/>
            <EmployeeDialog ref="statusDialog"/>

            {ListDialog &&
                <ListDialog ref="listDialog" path={this.path} onSubmitDataOptions={this.onSubmitDataOptions}/>}

            <Popover key="popover" ref="popover"/>
            <EditClientDialog ref="editClientDialog"/>
        </div>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="RenderDayIcon">
@observer
class RenderDayIcon extends React.Component {
    render() {
        const {state: {selectedMonth, list}, date: propDate, month: propMonth} = this.props;
        if (!!propMonth && propMonth !== selectedMonth)
            return null;
//        console.log('RenderDayIcon', propDate, list.slice()); 
        const items = [];
        list.forEach(({_group, list}) => {
            items.push(...list.filter(({id, data: {date, date_split}}) => {
                if (propDate) {
                    return propDate.equals(date);
                } else {
                    return date_split.month === Dates.monthsNum.get(propMonth);
                }
            }));
        });
        if (propDate && items.isEmpty()) {
            return null;
        }
        const count = items.length;
        const countSubmitted = items.filter(({id, data: {api_submitted}}) => api_submitted).length;
        const percentageSubmitted = (countSubmitted / count) * 100;
        return <React.Fragment>
            <div className="RenderDayIcon"><i>{count}</i></div>
            {propDate && <div className={`RenderDayIconAPISubmitted${percentageSubmitted < 100 ? ' bg-red' : ''}`}>
                <i>{percentageSubmitted.toFixed(0)}%</i>
                Submitted
            </div>}
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderDay">
@observer
class RenderDay extends React.Component {
    constructor(props) {
        super(props);
        this.onViewTypeOptions = this.onViewTypeOptions.bind(this);
        this.onViewOptions = this.onViewOptions.bind(this);

        this.onAction = this.onAction.bind(this);
    }

    onAction(evt, el) {
        const {type, action} = el.props;
        const {state: {list}, dateItem, onOpenListDialog} = this.props;
        const currDate = dateItem.date;

        const items = list.map(({_group, list}) => {
            return list.filter(({id, data: {date, date_split}}) => {
                const d = Dates.parse(date);
                console.log('onAction', d, currDate, d.equals(currDate))
                if (type === 'Daily') {
                    return d.equals(currDate);
                } else {
                    return d.getWeekNumber() === currDate.getWeekNumber();
                }
            });
        }).reduce((a1, a2) => [...a1, ...a2], []);

        let msg;
        if (type === 'Daily') {
            msg = `Day (${Dates.formatDate(currDate)}) Data`;
        } else {
            const startD = currDate.toWeekStartDate();
            const endD = currDate.toWeekEndDate();

            msg = `Week ${currDate.getWeekNumber()} (${Dates.formatDateRange(startD, endD)}) Data`;
        }

        if (items.isEmpty()) {
            return infoDialog.open(`No records found for ${msg}`);
        }

        onOpenListDialog(<h3 className="margin-0 margin-b-15 padding-10 bg-white">
            {action} {msg}
        </h3>, action, items);
    }

    onViewTypeOptions(evt) {
        const {state, dateItem} = this.props;
        const jqElem = $(findDOMNode(this));
        const {left, top} = jqElem.offset();
        const monthElemJQ = jqElem.closest('.rgc-calendar__month');
        const week = dateItem.date.getWeekNumber();
        monthElemJQ.find(`.RenderDay.RenderDayWeek${week}`).addClass('selected');
        monthElemJQ.find(`.RenderDay:not(.RenderDayWeek${week})`).removeClass('selected');

        const startD = dateItem.date.toWeekStartDate();
        const endD = dateItem.date.toWeekEndDate();

        popover.settings({
            style: {left: left, top: top - (jqElem.height() / 2) - 105, width: 'auto', minWidth: 140},
            contentNode: <div>
                <p className="padding-5 padding-t-3 text-center margin-l-0 margin-t-0 margin-r-0 margin-b-0 color-eee bg-primary">
                    Weekly / Daily Options
                </p>
                <NavItem key={1} action="Weekly" onClick={this.onViewOptions}
                         title={`Week ${week} (${Dates.formatDateRange(startD, endD)}) Options`}/>
                <NavItem key={2} action="Daily" onClick={this.onViewOptions}
                         title={`Day (${Dates.formatDate(dateItem.date)}) Options`}/>
            </div>
        }).open();
    }

    onViewOptions(evt, el) {
        const {action, title} = el.props;
        const {state, dateItem} = this.props;
        const jqElem = $(findDOMNode(this));
        const {left, top} = jqElem.offset();
        const monthElemJQ = jqElem.closest('.rgc-calendar__month');
        const week = dateItem.date.getWeekNumber();
        monthElemJQ.find(`.RenderDay.RenderDayWeek${week}`).addClass('selected');
        monthElemJQ.find(`.RenderDay:not(.RenderDayWeek${week})`).removeClass('selected');

        const startD = dateItem.date.toWeekStartDate();
        const endD = dateItem.date.toWeekEndDate();

        setTimeout(() => {
            popover.settings({
                style: {left: left, top: top - (jqElem.height() / 2) - 155, width: 'auto', minWidth: 140},
                contentNode: <div>
                    {action === 'Weekly' &&
                        <p className="padding-5 padding-t-3 text-center margin-l-0 margin-t-0 margin-r-0 margin-b-0 color-eee bg-primary">
                            Week <b>{week}</b> Options
                            <i className="font-size-11 block padding-3 color-primary bg-eee margin-t-3 border-radius-20">
                                <b>({Dates.formatDateRange(startD, endD)})</b>
                            </i>
                        </p>}
                    {action === 'Daily' &&
                        <p className="padding-5 padding-t-3 text-center margin-l-0 margin-t-0 margin-r-0 margin-b-0 color-eee bg-primary">
                            Day Options
                            <i className="font-size-11 block padding-3 color-primary bg-eee margin-t-3 border-radius-20">
                                <b>({Dates.formatDate(dateItem.date)})</b>
                            </i>
                        </p>}
                    <NavItem key={1} type={action} action="Submit" onClick={this.onAction} title={`Submit Data`}/>
                    <NavItem key={2} type={action} action="View" onClick={this.onAction} title={`View Data`}/>
                    <NavItem key={3} type={action} action="Print" onClick={this.onAction} title={`Print Data`}/>
                </div>
            }).open();
        }, 1000);
    }

    render() {
        const {state, dateItem} = this.props;
        return <div className={`RenderDay RenderDayWeek${dateItem.date.getWeekNumber()}`}
                    onClick={this.onViewTypeOptions}>
            <RenderDayIcon state={state} date={dateItem.date}/>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelMonths">
@observer
class ViewByPanelMonths extends React.Component {
    constructor(props) {
        super(props);

        this.renderButton = this.renderButton.bind(this);
    }

    renderButton(val, n) {
        const {state, onViewMonthOptions} = this.props;
        return <ViewByPanelMonthsButton key={val} state={state} text={val} onViewMonthOptions={onViewMonthOptions}/>;
    }
    ;

    render() {
        return <div className="ViewByPanelMonths flex">
            {[...Dates.monthsStr.values()].map(this.renderButton)}
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelYearsButton">
@observer
class ViewByPanelYearsButton extends React.Component {
    render() {
        const {state: {selectedYear}, onChange} = this.props;
        return <Button key={selectedYear} className="btn btn-primary margin-r-10 fixed-flex" text={String(selectedYear)}
                       type="Year" onClick={onChange}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelMonthsButton">
@observer
class ViewByPanelMonthsButton extends React.Component {
    render() {
        const {state, state: {selectedMonth}, onViewMonthOptions, text} = this.props;
        const className = "btn btn-primary" + (selectedMonth === text ? " _888" : "");
        return <Button key={text} className={className} value={text} type="Month" onClick={onViewMonthOptions}>
            {text}<RenderDayIcon state={state} month={text}/>
        </Button>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanel">
@observer
class ViewByPanel extends React.Component {

    constructor(props) {
        super(props);

//        this.onViewTeam = this.onViewTeam.bind(this);
    }

//    onViewTeam(action, list) {
//        const {attendanceTeamDialog} = this.refs;
//        attendanceTeamDialog.extraProp('action', action).open(list);
//    }

    render() {
        const {state, onChange, onViewMonthOptions, title} = this.props;
        return <div className="ViewByPanel">
            <div className="ViewByPanelFilter h-35">
                <div className="flex">
                    <ViewByPanelYearsButton state={state} onChange={onChange}/>
                    <ViewByPanelMonths state={state} onViewMonthOptions={onViewMonthOptions}/>
                </div>
            </div>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CalendarWrapper">
@observer
class CalendarWrapper extends React.Component {

    @computed
    get currDate() {
        const {state: {selectedYear, selectedMonth, selectedDate}} = this.props;
        return Dates.parse(selectedDate + "-" + selectedMonth + "-" + selectedYear);
    }

    render() {
        const {onSelectDay, renderer} = this.props;
        return <Calendar
            key={this.currDate}
            firstDayIsMonday={false}
            date={this.currDate}
            selectDay={false}
            markers={[]}
            onSelectDay={onSelectDay}
            renderer={renderer}
        />;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="DateRangeReports">
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
            <ClearableInput name="date_from" type="date" placeholder="Date From..."
                            className="form-control border-radius-l-20" onChange={this.form.onChange}/>
            <ClearableInput name="date_to" type="date" placeholder="Date To..." className="form-control border-radius-0"
                            onChange={this.form.onChange}/>
            <Button className="btn btn-primary fixed-flex border-radius-0" text="Close" onClick={this.onClose}/>
            <Button className="btn btn-primary fixed-flex border-radius-r-3" text="Submit" onClick={this.onSubmit}/>
        </div>;
    }
}

// </editor-fold>

export default ATab;
