// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, extendObservable} from 'mobx';

import {execWhen} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {
    Button,
    ActionsButton,
    ClearableInput,
    DateRangeInput,
    SelectIncidentActivityList,
    SelectIncidentSubCategoryList, SelectIncidentCategoryList, SelectEmployeeInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewIncidentAssignInvestigatorsDialog from '../dialogs/NewIncidentAssignInvestigatorsDialog.js';
import NewIncidentInvestigationDialog from '../dialogs/NewIncidentInvestigationDialog.js';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./InvestigationsTab.lazy.css";
import StateLists from "../dialogs/IncidentForms/StateLists";
import {IncidentInvestigationTableRow,} from "../dialogs/IncidentComponentRows";
import updateIncident from "mutations/all/Incident/updateIncident";
import ExportInvestigationsDialog from "../dialogs/ExportInvestigationsDialog";

// </editor-fold>

@observer
class InvestigationsTab extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="state">
    path;
    pageKey = "InvestigationsTab";

    @observable
    state = {
        lists: {
            ...StateLists,
            incident_status: [
               {label: 'Awaiting Approval', value: 'AwaitingApproval', checked: false},
                {label: 'Approved Incident', value: 'ApprovedIncident', checked: false},
                {label: 'Assigned Investigator', value: 'AssignedInvestigator', checked: false},
               {label: 'Investigating', value: 'Investigating', checked: false},
                {label: 'Closed Incident', value: 'ClosedIncident', checked: false}
            ],
            investigation_status: [
                {label: 'Awaiting Investigation Approval', value: 'AwaitingInvestigationApproval', checked: false},
                {label: 'Approved Investigation', value: 'ApprovedInvestigation', checked: false},
                {label: 'Closed Investigation', value: 'ClosedInvestigation', checked: false},
            ]
        }
    }
    // </editor-fold>

    innerRefs = {};

    // <editor-fold defaultstate="collapsed" desc="constructor, componentMount">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
        
      

        this.onSetCategoryRef = this.onSetCategoryRef.bind(this);

        this.onApproveInvestigation = this.onApproveInvestigation.bind(this);
        this.onAssignInvestigator = this.onAssignInvestigator.bind(this);
        this.onInvestigate = this.onInvestigate.bind(this);
        this.onCloseIncident = this.onCloseIncident.bind(this);
        this.onReOpen = this.onReOpen.bind(this);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onViewReport = this.onViewReport.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        
        this.onExport = this.onExport.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        execWhen(() => this.refs.root && this.refs.root.refs.filterWrapper).then(filterWrapper => {
            filterWrapper.form.addChangeOne("category", this.onChangeCategory.bind(this));
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            id,
            //
            person_reporting_id,
            person_reported_to_id,
            person_involved_id,
            person_injured_id,
            witness_id,
            person_distributed_to_id,
            driver_id,
            //
            category_list,
            sub_category_list,
            activity_list,
            //
            exact_location,
            is_vehicle_incident,
            vehicle_make,
            vehicle_reg_num,
            incident_status,
            investigation_status,
            //
            group,
            consequence,
            likelihood,
            risk_rating,
            //
            day_group,
            time_shift,
            incident_date_range,
            date_reported_range,
        } = filterData || {};

        const listByLogged = sockets.of('incidents/investigations').fn('listByLogged');

        return listByLogged({
            id,
            //
            person_reporting_id,
            person_reported_to_id,
            person_involved_id,
            person_injured_id,
            witness_id,
            person_distributed_to_id,
            driver_id,
            //
            category_list,
            sub_category_list,
            activity_list,
            //
            exact_location,
            is_vehicle_incident,
            vehicle_make,
            vehicle_reg_num,
            incident_status,
            investigation_status,
            //
            group,
            consequence,
            likelihood,
            risk_rating,
            //
            day_group,
            time_shift,
            incident_date_range,
            date_reported_range,
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
    
    // <editor-fold defaultstate="collapsed" desc="actions">
    onApproveInvestigation(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        confirmDialog.open("Are you sure you want to approve the investigation?").then(res => {
            if (res === 1) {
                progressDialog.open("Approving the investigation...");
                updateIncident({id: item.id, status_approved_investigation: true}).then(res => {
                    console.log("res", res)
                    if (!('status_approved_investigation' in item.data)) {
                        extendObservable(item.data, {status_approved_investigation: true});
                    } else {
                        item.data.status_approved_investigation = true;
                    }
                    setTimeout(() => {
                        list.removeIf(v => v.id === item.id);
                        list.insertAt(idx, item);
                    });
                    infoDialog.open("Incident Investigation successfully approved.");
                    infoDialog.close(2000);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            }
        })
    }

    onAssignInvestigator(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        this.refs.newIncidentAssignInvestigatorsDialog.open(item);
    }

    onInvestigate(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        this.refs.newInvestigationDialog.extraProp('incident', item).open(item.data.investigation);
    }

    onCloseIncident(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        confirmDialog.open("Are you sure you want to close the incident?").then(res => {
            if (res === 1) {
                progressDialog.open("Closing the incident...");
                updateIncident({id: item.id, status_closed: true}).then(res => {
                    console.log("res", res)
                    if (!('status_closed' in item.data)) {
                        extendObservable(item.data, {status_closed: true});
                    } else {
                        item.data.status_closed = true;
                    }
                    setTimeout(() => {
                        list.removeIf(v => v.id === item.id);
                        list.insertAt(idx, item);
                    });
                    infoDialog.open("Incident successfully closed.");
                    infoDialog.close(2000);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            }
        });
    }

    onReOpen(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {investigation} = item.data;
        confirmDialog.open("Are you sure you want to re-open the incident?").then(res => {
            if (res === 1) {
                progressDialog.open("Re-opening the incident...");
                updateIncident({id: item.id, status_closed: false}).then(res => {
                    console.log("res", res)
                    if (!('status_closed' in item.data)) {
                        extendObservable(item.data, {status_closed: false});
                    } else {
                        item.data.status_closed = false;
                    }
                    setTimeout(() => {
                        list.removeIf(v => v.id === item.id);
                        list.insertAt(idx, item);
                    });
                    infoDialog.open("Incident successfully re-opened.");
                    infoDialog.close(2000);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            }
        })
    }

    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }

    onViewReport(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }
    
    onExport(e, btn) {
        this.refs.exportInvestigationsDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSetCategoryRef">
    onSetCategoryRef(ref) {
        this.innerRefs.sub_category = ref;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeCategory(el, val) {
        execWhen(() => this.innerRefs.sub_category).then(ref => {
            if (val) {
                const {[val]: list, options} = this.state.lists.sub_category_list;
                if (list) {
                    options.clear();
                    options.push(...list);
                }
            } else {
                const {options} = this.state.lists.sub_category_list;
                options.clear();
            }
        });
    }

    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        return !isReadonly && <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
        </div>;
    }
    
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];

        const {
            id,
            data: {
                investigation,
                //
                status_closed,
                status_approved,
                status_approved_investigation,
                status_awaiting_approval,
                status_investigating,
                status_awaiting_investigation_approval,
            },
        } = item;

        console.log('this.props.permissionKey', this.props.permissionKey)
        
        const {is: {isEmployee}, loggedUser: {user}} = storage;
        
        if (isEmployee) {
            //TODO: Determine who is an approver
            // const isInvestigationApprover = distribution_list && distribution_list.anyMatch(({employee: {id}}) => id === user.id);
            const isInvestigator = investigation && investigation.investigation_team_list && investigation.investigation_team_list.anyMatch(({investigator: {id}}) => id === user.id);
            return <Options idx={idx}>
                <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
                <hr action="writable"/>
                {/*{isInvestigationApprover && !status_approved_investigation &&*/}
                {/*  <NavItem action="writable" idx={idx} onClick={this.onApproveInvestigation} faIconLeft="check"*/}
                {/*           title="Approve Investigation"/>}*/}
                
                {isInvestigator && <>
                    {!status_closed && <>
                        <NavItem action="writable" idx={idx} onClick={this.onInvestigate} faIconLeft="edit"
                                 title="Investigate"/>
                        {status_approved_investigation &&
                          <NavItem action="writable" idx={idx} onClick={this.onCloseIncident} faIconLeft="ban"
                                   title="Close Incident"/>}
                    </>}
                    {status_closed &&
                      <NavItem action="writable" idx={idx} onClick={this.onReOpen} faIconLeft="edit"
                               title="Re-Open Incident"/>}
                </>}
                {/*<hr action="writable"/>*/}
                {/*<NavItem action="print" idx={idx} onClick={this.onViewReport} faIconLeft="file-text" title="View Report"/>*/}
                {/*<NavItem action="print" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>*/}
            </Options>;
        }
        
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            {!status_closed && <>
                <NavItem action="writable" idx={idx} onClick={this.onAssignInvestigator} faIconLeft="edit"
                         title="Re-Assign Investigator(s)"/>
                <NavItem action="writable" idx={idx} onClick={this.onInvestigate} faIconLeft="edit"
                         title="Investigate"/>
                {!status_approved_investigation &&
                    <NavItem action="writable" idx={idx} onClick={this.onApproveInvestigation} faIconLeft="check"
                             title="Approve Investigation"/>}
                {status_approved_investigation &&
                    <NavItem action="writable" idx={idx} onClick={this.onCloseIncident} faIconLeft="ban"
                             title="Close Incident"/>}
            </>}
            {status_closed &&
                <NavItem action="writable" idx={idx} onClick={this.onReOpen} faIconLeft="edit"
                         title="Re-Open Incident"/>}

            {/*<hr action="writable"/>*/}
            {/*<NavItem action="print" idx={idx} onClick={this.onViewReport} faIconLeft="file-text" title="View Report"/>*/}
            {/*<NavItem action="print" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>*/}
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-3 grid-gap-10 -margin-b-35">
            <ClearableInput
                name="id"
                type="number"
                placeholder="ID #"
                className="form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="person_reporting"
                placeholder="Reported By..."
                className="form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="person_reported_to"
                placeholder="Reported To..."
                className="form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="person_involved"
                placeholder="Person Involved..."
                className="form-control"
                onChange={onChange}
            />

            <SelectEmployeeInput
                name="person_injured"
                placeholder="Person Injured..."
                className="form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="witness"
                placeholder="Witness..."
                className="form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="person_distributed_to"
                placeholder="Person Distributed To..."
                className="form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="driver"
                placeholder="Driver..."
                className="form-control"
                onChange={onChange}
            />

            <SelectIncidentCategoryList
                name="category_list"
                type="select_multi"
                className="form-control"
                onChange={onChange}
            />
            {/*<SelectIncidentSubCategoryList*/}
            {/*    name="sub_category_list"*/}
            {/*    type="select_multi"*/}
            {/*    className="col-lg-4 margin-b-10 form-control"*/}
            {/*    onChange={onChange}*/}
            {/*/>*/}
            {/*<SelectIncidentActivityList*/}
            {/*    name="activity_list"*/}
            {/*    type="select_multi"*/}
            {/*    placeholder="Activities..."*/}
            {/*    className="col-lg-4 margin-b-10 form-control"*/}
            {/*    onChange={onChange}*/}
            {/*    add={false}*/}
            {/*/>*/}
            <ClearableInput name="day_group" type="radio" placeholder="Morning / Afternoon"
                            className="form-control" onChange={onChange}
                            values={this.state.lists.day_group} returnValue/>
            <ClearableInput name="time_shift" type="radio" placeholder="Time Shift"
                            className="form-control" onChange={onChange}
                            values={this.state.lists.time_shift} returnValue/>
            <ClearableInput
                name="exact_location"
                type="text"
                placeholder="Exact Location"
                className="form-control"
                onChange={onChange}
            />
            
            <ClearableInput name="is_vehicle_incident" type="select" placeholder="Vehicle Incident?"
                            className="form-control" onChange={onChange}
                            values={this.state.lists.is_vehicle_incident.map(({text: label, value}) => ({label, value: value === "Yes"}))} returnValue/>
            <ClearableInput name="vehicle_make" type="text" placeholder="Vehicle Make"
                            className="form-control" onChange={onChange}/>
            <ClearableInput name="vehicle_reg_num" type="text" placeholder="Reg/Serial No."
                            className="form-control" onChange={onChange}/>
            <ClearableInput name="incident_status" type="select" placeholder="Incident Status..."
                            className="form-control" onChange={onChange}
                            values={this.state.lists.incident_status} returnValue/>
            <ClearableInput name="investigation_status" type="select" placeholder="Investigation Status..."
                            className="form-control" onChange={onChange}
                            values={this.state.lists.investigation_status} returnValue/>

            <ClearableInput
                name="group"
                type="select"
                placeholder="Incident Group"
                className="form-control"
                onChange={onChange}
                values={this.state.lists.group.map(({text: label, value}) => ({label, value}))}
                returnValue
            />
            <ClearableInput
                name="consequence"
                type="select"
                placeholder="Consequence / Severity"
                className="form-control"
                onChange={onChange}
                values={this.state.lists.consequence.map(({text: label, value}) => ({label, value}))}
                returnValue
            />
            <ClearableInput
                name="likelihood"
                type="select"
                placeholder="Likelihood / Probability"
                className="form-control"
                onChange={onChange}
                values={this.state.lists.likelihood.map(({text: label, value}) => ({label, value}))}
                returnValue
            />
            <ClearableInput
                name="risk_rating"
                type="select"
                placeholder="Risk Rating"
                className="form-control"
                onChange={onChange}
                values={[...this.state.lists.risk_rating.map(({text: label, value}) => ({label, value})), {label: 'N/A', value: 'N/A'}]}
                returnValue
            />

            <DateRangeInput name="incident_date_range" className="form-control"
                            placeholder="Date of Incident" placeholderWidthClass="min-w-135" onChange={onChange}/>
            <DateRangeInput name="date_reported_range" className="form-control"
                            placeholder="Date Reported" placeholderWidthClass="min-w-135" onChange={onChange}/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td fixed-flex min-w-120">Incident Date</div>
            <div className="td fixed-flex min-w-120">Investigation Due Date</div>
            <div className="td fixed-flex min-w-120">Risk Rating</div>
            <div className="td">Category</div>
            <div className="td">Sub-Category</div>
            <div className="td">Short Description</div>
            <div className="td">Exact Location</div>
            <div className="td fixed-flex min-w-140">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <IncidentInvestigationTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Investigations"
            pageTitleSingular="investigation"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <NewIncidentAssignInvestigatorsDialog ref="newIncidentAssignInvestigatorsDialog"/>
            <NewIncidentInvestigationDialog ref="newInvestigationDialog"/>
            <ProfilePDFReader ref="pdfReader"/>
            <ExportInvestigationsDialog ref="exportInvestigationsDialog"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default InvestigationsTab;
