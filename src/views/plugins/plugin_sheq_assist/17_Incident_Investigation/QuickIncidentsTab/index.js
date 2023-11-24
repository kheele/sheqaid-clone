// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    Button,
    ClearableInput,
    DateRangeInput, SelectEmployeeInput,
    SelectIncidentCategoryList,
} from 'components/inputs';
import {THead} from 'components/tables';

import {IncidentQuickTableRow} from '../dialogs/IncidentComponentRows';

import style from "./QuickIncidentsTab.lazy.css";
import {execWhen} from "utils/UtilsFuns";
import {Dates} from "utils/Dates";
import ExportQuickIncidentsDialog from "./ExportQuickIncidentsDialog";

// </editor-fold>

@observer
class QuickIncidentsTab extends React.Component {
    pageKey = "QuickIncidentsTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            is_vehicle_incident: ['Yes', 'No'].map(value => ({label: value, value: value === "Yes", checked: false})),
            severity: ['Medical Examination', 'Working / At Work'].map(value => ({
                label: value,
                value,
                checked: false
            })),
            time_shift: ['Day', 'Night'].map(value => ({label: value, value, checked: false})),
        }
    }
    // </editor-fold>
    innerRefs = {};

    // <editor-fold defaultstate="collapsed" desc="constructor, componentMount">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onExport = this.onExport.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
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
            incident_date_range,
            date_reported_range,
            category_list,
            time_shift,
            person_reporting_id,
            person_reporting_other_id,
            person_injured_id,
            person_injured_other_id,
            driver_id,
            driver_other_id,
            severity,
            exact_location,
            is_vehicle_incident,
            vehicle_make,
            vehicle_reg_num,
        } = filterData || {};

        const listByLogged = sockets.of('incidents-quick').fn('listByLogged');

        return listByLogged({
            id,
            incident_date_range,
            date_reported_range,
            category_list,
            time_shift,
            person_reporting_id,
            person_reporting_other_id,
            person_injured_id,
            person_injured_other_id,
            driver_id,
            driver_other_id,
            severity,
            exact_location,
            is_vehicle_incident,
            vehicle_make,
            vehicle_reg_num,
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
        this.refs.exportDialog.open();
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
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls -margin-b-15">
            <SelectEmployeeInput
                name="person_reporting"
                placeholder="Reported By..."
                className="col-lg-3 margin-b-10 form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="person_injured"
                placeholder="Person Injured..."
                className="col-lg-3 margin-b-10 form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="driver"
                placeholder="Driver..."
                className="col-lg-3 margin-b-10 form-control"
                onChange={onChange}
            />

            <SelectIncidentCategoryList
                name="category_list"
                type="select_multi"
                className="col-lg-3 margin-b-10 form-control"
                onChange={onChange}
            />
            <ClearableInput
                name="severity"
                type="radio"
                placeholder="Severity"
                className="col-lg-3 margin-b-10 form-control"
                onChange={onChange}
                values={this.state.lists.severity}
                returnValue
            />
            <ClearableInput
                name="exact_location"
                type="text"
                placeholder="Exact Location"
                className="col-lg-3 margin-b-10 form-control"
                onChange={onChange}
            />

            <ClearableInput name="is_vehicle_incident" type="radio" placeholder="Vehicle Incident"
                            className="col-lg-3 margin-b-10 form-control" onChange={onChange}
                            values={this.state.lists.is_vehicle_incident} returnValue/>
            <ClearableInput name="vehicle_make" type="text" placeholder="Vehicle Make"
                            className="col-lg-3 margin-b-10 form-control" onChange={onChange}/>
            <ClearableInput name="vehicle_reg_num" type="text" placeholder="Reg/Serial No."
                            className="col-lg-3 margin-b-10 form-control" onChange={onChange}/>

            <ClearableInput name="time_shift" type="radio" placeholder="Time Shift"
                            className="col-lg-3 margin-b-10 form-control" onChange={onChange}
                            values={this.state.lists.time_shift} returnValue/>
            <DateRangeInput name="incident_date_range" className="col-lg-3 margin-b-10 form-control"
                            placeholder="Date of Incident" placeholderWidthClass="min-w-135" onChange={onChange}/>
            <DateRangeInput name="date_reported_range" className="col-lg-3 margin-b-10 form-control"
                            placeholder="Date Reported" placeholderWidthClass="min-w-135" onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td fixed-flex min-w-180">Date & Time</div>
            <div className="td fixed-flex min-w-140">Severity</div>
            <div className="td">Category</div>
            <div className="td">Reported By</div>
            <div className="td">Person Injured</div>
            <div className="td fixed-flex min-w-160">Asset</div>
            <div className="td">Driver</div>
            <div className="td">Description</div>
            <div className="td">Location</div>
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
            <ExportQuickIncidentsDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default QuickIncidentsTab;
