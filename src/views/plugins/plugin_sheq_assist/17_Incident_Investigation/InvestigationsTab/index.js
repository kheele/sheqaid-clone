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
    SelectIncidentSubCategoryList
} from 'components/inputs';
import {THead} from 'components/tables';

import NewIncidentAssignInvestigatorsDialog from '../dialogs/NewIncidentAssignInvestigatorsDialog.js';
import NewIncidentInvestigationDialog from '../dialogs/NewIncidentInvestigationDialog.js';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./InvestigationsTab.lazy.css";
import StateLists from "../dialogs/IncidentForms/StateLists";
import byLogged from "./Query/List/listAllIncidentInvestigationByLogged";
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
            // name,
        } = filterData || {};

        const limit = 50;

        const args = {
            // name,
            removed: false,
            //
            limit,
            //
            exact_orgs: true,
        };

        if (!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        return byLogged(args).then((res) => {
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
            <div className="td fixed-flex min-w-120">Incident Date</div>
            <div className="td fixed-flex min-w-140">Investigation Date</div>
            <div className="td">Group</div>
            <div className="td">Category</div>
            <div className="td">Sub-Category</div>
            <div className="td">Activities</div>
            <div className="td">Description</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-120">Status</div>
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
