// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed, extendObservable} from 'mobx';

import style from "./AppointmentsTab.lazy.css";

import {renderLeftButtonsForExpiryOnly} from 'utils/ComponentUtils';
import {Dates, execWhen} from 'utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    Button,
    ClearableInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput, SelectTeamInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewDialog from './JobAppointments/forms/NewDialog';
import EditDialog from './JobAppointments/forms/EditDialog';
import ProfileDialog from './JobAppointments/forms/ProfileDialog';
import ExportDialog from './JobAppointments/ExportDialog';
import SignatureDialog from "components/dialogs/SignatureDialog";

import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";
import JobAppointmentsRenderRow from "./JobAppointments/JobAppointmentsDialog/JobAppointmentsRenderRow";
import updateEmployeeJobAppointment
    from "mutations/all/EmployeeJobAppointment/updateEmployeeJobAppointment";
// </editor-fold>

@observer
class AppointmentsTab extends React.Component {

    pageKey = "AppointmentsTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            expiry_date: [{label: 'Expired', value: -1}, {label: '1 month', value: 1}, {
                label: '2 months',
                value: 2
            }, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        },
        view: 'Employee',
        expiry_date: 'ALL',
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.classNames += "LeftButtonsForExpiryOnlyPage";

        this.onLoadList = this.onLoadList.bind(this);

        this.onRemoved = this.onRemoved.bind(this);

        this.onChangeViewExpiryDate = this.onChangeViewExpiryDate.bind(this);

        this.setView = this.setView.bind(this);
        this.onView = this.onView.bind(this);

        this.onNewItem = this.onNewItem.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);

        this.onSignatures = this.onSignatures.bind(this);
        this.onExport = this.onExport.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    @computed get isEmployee() {
        return this.state.view === "Employee";
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {state: {view, expiry_date: expiry_date_top_filter}} = this;

        const {page, lastItem, filterData, filtered, isNew} = params;

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        const {
            department_id,
            job_position_id,
            employee_id,
            team_id,
            supervisor_id,
            name,
            //
            notes,
            //
            expiry_date,
        } = filterData || {};

        const listByLogged = sockets.of('structure-and-responsibility/job-appointments').fn('listByLogged');

        return listByLogged({
            removed: false,
            view,
            expiry_date: expiry_date || expiry_date_top_filter,
            mon, mon2, mon3,
            //
            department_id,
            job_position_id,
            employee_id,
            team_id,
            supervisor_id,
            name,
            //
            notes,
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

    //<editor-fold desc="setView">
    async setView({view = 'Employee', expiry_date = 'ALL', load = true}) {
        let ref;
        if (this.refs.viewButtonsRefBox) {
            ref = this.refs.viewButtonsRefBox;
        } else {
            ref = await execWhen(() => this.refs.viewButtonsRefBox);
        }

        const {view: old_view, expiry_date: old_expiry_date, } = this.state;

        console.log('setView', this);
        console.log('setView view', old_view, view);
        console.log('setView expiry_date', old_expiry_date, expiry_date);

        if(old_view !== view || old_expiry_date !== expiry_date) {
            const filterWrapper = await execWhen(() => this.refs.root.refs.filterWrapper);
            if (filterWrapper.isOpen) {
                await filterWrapper.close();
            }
        }

        ref.setView(view);
        this.state.view = view;
        this.state.expiry_date = expiry_date;

        this.onChangeViewExpiryDate(expiry_date);

        if (load) {
            this.refs.root.load();
        }
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        console.log("list", this.isEmployee, list.slice())
        const dialog = this.refs.root.getDialogByRef('profileDialog');
        if (dialog) {
            if (this.isEmployee) {
                dialog.open(item);
            } else {
                const {data: {employee: employeeItem}} = item;
                dialog.extraProp('activeId', item.id).open(employeeItem);
            }
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onAdd">
    onAdd(e, el) {
        const {idx} = el.props;
        const employeeItem = this.refs.root.list[idx];
        const dialog = this.refs.root.getDialogByRef('newDialog');
        dialog && dialog.open(employeeItem).then(data => {
//            extendObservable(item.data, data);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onEdit">
    onEdit(e, el) {
        const {idx} = el.props;
        const docItem = this.refs.root.list[idx];
        const dialog = this.refs.root.getDialogByRef('editDialog');
        dialog && dialog.open(docItem).then(data => {
            extendObservable(docItem.data, data);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNewItem">
    onNewItem(item) {
        const {list} = this.refs.root;
        const existingItem = list.find(v => v.id === item.id);
        if (existingItem) {
            setTimeout(() => {
                extendObservable(existingItem.data, item.data);
                const idx = list.indexOf(existingItem);
                list.removeIf((item, _idx) => _idx === idx);
                list.insertAt(idx, item);
            }, 0);
        } else {
            list.pushFirst(item);
        }
    }

    // </editor-fold>

    //<editor-fold desc="onChangeViewExpiryDate">
    onChangeViewExpiryDate(expiry_date) {
        this.expiry_date = expiry_date;
    }

    //</editor-fold>

    onRemoved(item) {
        this.refs.root.list.removeIf((v, n) => v.id === item.id);
    }

    // <editor-fold defaultstate="collapsed" desc="onSignatures">
    onSignatures(e, btn) {
        this.refs.signaturesDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        this.refs.exportDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
    renderDefaultLeftButtons() {
        const {isContractorView} = storage.is;

//        const {permissions_other} = storage.loggedUser.user.data;
//        //
//        const permissions_other_Medicals = (permissions_other || []).find(v => v.key === "Medicals");
//        const c_Medicals = Permissions.allow(permissions_other_Medicals) ? "allowed" : "disallowed";

//        const writable = storage.is.isContractor || !isContractorView;
        return <>
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
            </Button>
        </>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const permissionKey = "Appointments";
        const titleSingular = "Job Appointment";
        const {isEmployee} = this;
        const isEditable = !isEmployee;
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={this.onView} faIconLeft="eye" title="View"/>
            {isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"
                                    title={`Add ${titleSingular}`}/>}
            {isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            {/*<hr action="writable"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"*/}
            {/*         title="Save As PDF"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsExcel} faIconLeft="file-excel-o"*/}
            {/*         title="Save As Excel"/>*/}
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className={`controls grid-4 grid-gap-5 padding-r-10 -margin-b-`}>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control" onChange={onChange} add={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control" onChange={onChange} add={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>

            <ClearableInput name="notes" type="text" placeholder="Notes" className="form-control" onChange={onChange}/>

            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control" onChange={onChange}/>
            {this.expiry_date === 'ALL' && <ClearableInput
                ref="expiry_date"
                name="expiry_date"
                type="select"
                placeholder="Expiry..."
                className="form-control"
                onChange={onChange}
                values={this.state.lists.expiry_date}
                returnValue
            />}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const {view} = this.state;
        if (view === 'Employee') {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td">Department</div>
                <div className="td">Job Position</div>
                {hasProjects && <div className="td sm-hidden">Location</div>}
                <div className="td fixed-flex min-w-105">Latest On</div>
                <div className="td fixed-flex min-w-240">Stats</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td">Notes</div>
                <div className="td fixed-flex min-w-105">Start Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(idx, onClick) {
        const item = this.refs.root.list[idx];
        const {view} = this.state;
        return <JobAppointmentsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {state, state: {expiry_date}} = this;
        return <>
            <ViewByButtonsBox
                ref="viewButtonsRefBox"
                state={state}
                titleSingular="Job Appointment"
                expiry_date={expiry_date}
                onChange={this.setView}
            />
            <APageListReadWrite
                hasBackBtn={false}
                ref="root"
                page={this}
                createBtnTitle="Create"
                pageId={this.pageKey + "-tab"}
                pageTitle="Job Appointments"
                pageTitleSingular="job appointment"
                onLoadList={this.onLoadList}
                noAnimation={true}
                renderDefaultLeftButtons={this.renderDefaultLeftButtons}
                renderLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                renderTHead={this.renderTHead}
                renderItem={this.renderItem}>
                <ConfirmDialog ref="removeDialog" onSoftDelete={updateEmployeeJobAppointment}/>

                <ProfileDialog ref="profileDialog" onRemoved={this.onRemoved}/>
                <NewDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>
                <EditDialog ref="editDialog" onRemoved={this.onRemoved}/>

                <SignatureDialog ref="signaturesDialog" plugin="plugin_extra" module="Job Appointments"/>
                <ExportDialog ref="exportDialog"/>
            </APageListReadWrite>
        </>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.setView = this.setView.bind(this);
    }

    // </editor-fold>

    setView(value) {
        execWhen(() => this.viewButtonsRef).then(ref => {
            ref.setView(value);
        });
    }

    render() {
        const {state: {view}, expiry_date, titleSingular, onChange} = this.props;
        return <MKBox
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin='10px 0 0px'
            padding="0 0 10px"
            borderBottom="2px solid #ebebeb"
        >
            <ViewByButtons ref={ref => {
                this.viewButtonsRef = ref;
            }} text="Employee" expiry_date={expiry_date} value={view} name={titleSingular} onChange={onChange}/>
        </MKBox>
    }
}

// </editor-fold>

export default AppointmentsTab;
