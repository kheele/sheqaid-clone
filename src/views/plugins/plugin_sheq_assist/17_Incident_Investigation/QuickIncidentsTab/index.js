// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    Button,
    ClearableInput,
    DateRangeInput,
    SelectIncidentActivityList,
    SelectIncidentSubCategoryList
} from 'components/inputs';
import {THead} from 'components/tables';

import {IncidentQuickTableRow} from '../dialogs/IncidentComponentRows';

// import NewIncidentAssignInvestigatorsDialog from '../dialogs/NewIncidentAssignInvestigatorsDialog.js';
// import NewIncidentInvestigationDialog from '../dialogs/NewIncidentInvestigationDialog.js';
// import NewIncidentDialog from '../dialogs/NewIncidentDialog.js';
// import EditIncidentDialog from '../dialogs/EditIncidentDialog.js';
// import ProfileIncidentDialog from '../dialogs/ProfileIncidentDialog.js';
//
// import ExportIncidentsDialog from '../dialogs/ExportIncidentsDialog.js';
//
// import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./QuickIncidentsTab.lazy.css";
import StateLists from "../dialogs/IncidentForms/StateLists";
import {execWhen} from "utils/UtilsFuns";
import updateIncident from "mutations/all/Incident/updateIncident";
import {Dates} from "../../../../../utils/Dates";
// </editor-fold>

@observer
class QuickIncidentsTab extends React.Component {
    path;
    pageKey = "QuickIncidentsTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            ...StateLists,
            incident_status: [
//                {label: 'Awaiting Approval', value: 'AwaitingApproval', checked: false},//x
                {label: 'Approved Incident', value: 'ApprovedIncident', checked: false},
                {label: 'Assigned Investigator', value: 'AssignedInvestigator', checked: false},//x
//                {label: 'Investigating', value: 'Investigating', checked: false},//x
                {label: 'Closed Incident', value: 'ClosedIncident', checked: false}
            ],
            investigation_status: [
                {label: 'Approved Investigation', value: 'ApprovedInvestigation', checked: false},
//                {label: 'Investigating', value: 'Investigating', checked: false},//x
                {label: 'Closed Investigation', value: 'ClosedInvestigation', checked: false}//inv
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

        this.onExport = this.onExport.bind(this);

        this.onApproveIncident = this.onApproveIncident.bind(this);
        this.onAssignInvestigator = this.onAssignInvestigator.bind(this);
        this.onInvestigate = this.onInvestigate.bind(this);
        this.onCloseIncident = this.onCloseIncident.bind(this);
        this.onReOpen = this.onReOpen.bind(this);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onViewReport = this.onViewReport.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
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
            // name,
        } = filterData || {};

        const listByLogged = sockets.of('incidents-quick').fn('listByLogged');

        const today = Dates.formatDateSQL(new Date());

        return listByLogged({
            // name,
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
    onExport(e, btn) {
        this.refs.exportIncidentsDialog.open();
    }

    onApproveIncident(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        confirmDialog.open("Are you sure you want to approve the incident?").then(res => {
            if (res === 1) {
                progressDialog.open("Approving the incident...");
                updateIncident({id: item.id, status_approved: true}).then(res => {
                    console.log("res", res)
                    if (!('status_approved' in item.data)) {
                        extendObservable(item.data, {status_approved: true});
                    } else {
                        item.data.status_approved = true;
                    }
                    setTimeout(() => {
                        list.removeIf(v => v.id === item.id);
                        list.insertAt(idx, item);
                    });
                    infoDialog.open("Incident successfully approved.");
                    infoDialog.close(2000);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            }
        });
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
        });
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
                //
                company,
                client,
                project,
                site,
                //
                logged_user,
                logged_employee,
                //Step 2 (Incident Details)
                latitude,
                longitude,
                exact_location,
                short_desc,
                //Step 3 (Date & Time)
                incident_date,
                incident_time,
                date_reported,
                time_reported,
                time_shift,
                //Step 4 (Incident Category)
                category_list,
                //Step 5 (Injury Report)
                person_reporting,
                //Step 6 (Injury Details)
                person_injured,
                nature_of_injury_list,
                bodily_injury_location_list,
                injury_mechanism_list,
                //6.2 Motor Vehicle
                is_vehicle_incident,
                driver,
                driver_email,
                driver_phone,
                vehicle_make,
                vehicle_reg_num,
                //6.3 Incident Severity
                severity,
                //Step 7 (Media Details)
                image_list,
                video_list,
            },
        } = item;

        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            {/*<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>*/}
            {/*<hr action="writable"/>*/}
            {/*{!status_approved &&*/}
            {/*    <NavItem*/}
            {/*        action="writable"*/}
            {/*        idx={idx}*/}
            {/*        onClick={this.onApproveIncident}*/}
            {/*        faIconLeft="check"*/}
            {/*        title="Approve Incident"*/}
            {/*    />*/}
            {/*}*/}
            {/*<hr action="writable"/>*/}
            {/*<NavItem action="print" idx={idx} onClick={this.onViewReport} faIconLeft="file-text" title="View Report"/>*/}
            {/*<NavItem action="print" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>*/}
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        const category_list = this.state.lists.category_list.map(({value, text, checked}) => ({value, label: text}));
        const sector_list = this.state.lists.sector_list.map(({value, text, checked}) => ({value, label: text}));
        return <div className="col-lg-12 controls -margin-b-35">
            <ClearableInput name="category" type="select" placeholder="Category..." className="col-lg-3 form-control"
                            onChange={onChange} values={category_list} returnValue/>
            <SelectIncidentSubCategoryList
                ref={this.onSetCategoryRef}
                refName="sub_category"
                name="sub_category"
                type="select"
                placeholder="Sub-Category..."
                className="col-lg-3 form-control"
                vertical={false}
                onChange={onChange}
                values={this.state.lists.sub_category_list}
                add={false}
            />
            <ClearableInput name="sector" type="select" placeholder="Sector..." className="col-lg-3 form-control"
                            onChange={onChange} values={sector_list} returnValue/>
            <SelectIncidentActivityList
                ref={this.onSetCategoryRef}
                refName="activity"
                name="activity"
                type="select"
                placeholder="Activity..."
                className="col-lg-3 form-control"
                vertical={false}
                onChange={onChange}
                values={this.state.lists.activity_list}
                add={false}
            />
            <ClearableInput name="incident_status" type="select" placeholder="Incident Status..."
                            className="col-lg-3 form-control" onChange={onChange}
                            values={this.state.lists.incident_status} returnValue/>
            <ClearableInput name="investigation_status" type="select" placeholder="Investigation Status..."
                            className="col-lg-3 form-control" onChange={onChange}
                            values={this.state.lists.investigation_status} returnValue/>
            <DateRangeInput name="incident_date_range" className="col-lg-6 margin-t-10 form-control"
                            placeholder="Date of Incident" placeholderWidthClass="min-w-135" onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-160">Incident Date && Time</div>
            <div className="td fixed-flex min-w-160">Reported Date && Time</div>
            <div className="td fixed-flex min-w-80">Time Shift</div>
            <div className="td fixed-flex min-w-120">Severity</div>
            <div className="td">Category</div>
            <div className="td">Reported By</div>
            <div className="td">Person Injured</div>
            <div className="td fixed-flex min-w-160">Asset</div>
            <div className="td">Driver</div>
            <div className="td">Description</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-120">GPS Location</div>
            {/*<div className="td fixed-flex min-w-140">Status</div>*/}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <IncidentQuickTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Quick Incidents"
            pageTitleSingular="quick incident"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            {/*<NewIncidentDialog ref="newDialog"/>*/}
            {/*<EditIncidentDialog ref="editDialog"/>*/}
            {/*<ProfileIncidentDialog ref="profileDialog"/>*/}

            {/*<NewIncidentAssignInvestigatorsDialog ref="newIncidentAssignInvestigatorsDialog"/>*/}
            {/*<NewIncidentInvestigationDialog ref="newInvestigationDialog"/>*/}
            {/*<ProfilePDFReader ref="pdfReader"/>*/}
            {/*<ExportIncidentsDialog ref="exportIncidentsDialog"/>*/}
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default QuickIncidentsTab;
