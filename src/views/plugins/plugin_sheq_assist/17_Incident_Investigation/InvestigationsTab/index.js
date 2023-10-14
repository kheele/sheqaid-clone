// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable} from 'mobx';

import {Dates, execWhen} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {
    ActionsButton,
    ClearableInput,
    DateRangeInput,
    SelectIncidentActivityList,
    SelectIncidentSubCategoryList
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewIncidentAssignInvestigatorsDialog from '../dialogs/NewIncidentAssignInvestigatorsDialog.js';
import NewIncidentInvestigationDialog from '../dialogs/NewIncidentInvestigationDialog.js';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./InvestigationsTab.lazy.css";
import StateLists from "../dialogs/IncidentForms/StateLists";
import byLogged from "./Query/List/listAllIncidentInvestigationByLogged";
import {IncidentInvestigationTableRow,} from "../dialogs/IncidentComponents";

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
        this.onCloseInvestigation = this.onCloseInvestigation.bind(this);
        this.onReOpen = this.onReOpen.bind(this);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onViewReport = this.onViewReport.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
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
        const item = this.refs.root.list[idx];
        const {investigation} = item.data;
        confirmDialog.open("Are you sure you want to approve the investigation?").then(res => {
            if (res === 1) {
                progressDialog.open("Approving the investigation...");
                neonBinding.events.emit(this.path + "add-status", item.id, "ApprovedInvestigation").then(res => {
                    progressDialog.close();
                    console.log("res", res)
                    if (!investigation.status) {
                        setTimeout(() => {
                            extendObservable(investigation, {status: ['ApprovedInvestigation']});
                        });
                    }
                    infoDialog.open("Investigation successfully approved.");
                    infoDialog.close(2000);
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
        this.refs.newInvestigationDialog.open(item);
    }

    onCloseInvestigation(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        const {investigation} = item.data;
        confirmDialog.open("Are you sure you want to close the investigation?").then(res => {
            if (res === 1) {
                progressDialog.open("Closing the investigation...");
                neonBinding.events.emit(this.path + "add-status", item.id, "ClosedInvestigation").then(res => {
                    progressDialog.close();
                    console.log("res", res)
                    if (!investigation.status) {
                        extendObservable(investigation, {status: ['ClosedInvestigation']});
                    }
                    setTimeout(() => {
                        investigation.status.push('ClosedInvestigation');
                    }, 2000);
                    infoDialog.open("Investigation successfully closed.");
                    infoDialog.close(2000);
                });
            }
        })
    }

    onReOpen(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        const {investigation} = item.data;
        confirmDialog.open("Are you sure you want to re-open the investigation?").then(res => {
            if (res === 1) {
                progressDialog.open("Re-opening the investigation...");
                neonBinding.events.emit(this.path + "remove-status", item.id, "ClosedInvestigation").then(res => {
                    progressDialog.close();
                    console.log("res", res)
                    setTimeout(() => {
                        investigation.status.remove('ClosedInvestigation');
                    });
                    infoDialog.open("Investigation successfully re-opened.");
                    infoDialog.close(2000);
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

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        let {id, data: {investigation, investigation: {status = []}}} = item;
        status = isArray(status) || isObservableArray(status) ? status : [];

        console.log('this.props.permissionKey', this.props.permissionKey)
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            {!status.contains('ClosedInvestigation') && <React.Fragment>
                <NavItem action="writable" idx={idx} onClick={this.onAssignInvestigator} faIconLeft="edit"
                         title="Re-Assign Investigator(s)"/>
                <NavItem action="writable" idx={idx} onClick={this.onInvestigate} faIconLeft="edit"
                         title="Investigate"/>
                {!status.contains('ApprovedInvestigation') &&
                    <NavItem action="writable" idx={idx} onClick={this.onApproveInvestigation} faIconLeft="check"
                             title="Approve Investigation"/>}
            </React.Fragment>}

            {!status.contains('ClosedInvestigation') &&
                <NavItem action="writable" idx={idx} onClick={this.onCloseInvestigation} faIconLeft="ban"
                         title="Close Investigation"/>}
            {status.contains('ClosedInvestigation') &&
                <NavItem action="writable" idx={idx} onClick={this.onReOpen} faIconLeft="edit"
                         title="Re-Open Investigation"/>}
            <hr action="writable"/>
            <NavItem action="print" idx={idx} onClick={this.onViewReport} faIconLeft="file-text" title="View Report"/>
            <NavItem action="print" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
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
            <div className="td">Sector(s)</div>
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
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <NewIncidentAssignInvestigatorsDialog ref="newIncidentAssignInvestigatorsDialog"/>
            <NewIncidentInvestigationDialog ref="newInvestigationDialog"/>
            <ProfilePDFReader ref="pdfReader"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default InvestigationsTab;
