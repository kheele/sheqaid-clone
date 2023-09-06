// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {calculateRightPos, Dates} from 'utils/Utils';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {ConfirmDialog} from 'components/dialogs';
import {
    ActionsButton,
    ClearableInput, Clickable,
    SelectDepartmentInput, SelectEmployeeInput,
    SelectJobPositionInput, SelectTeamInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AsyncTD} from 'views/plugins/components';

import NewDialog from './forms/NewDialog';
import ProfileDialog from './forms/ProfileDialog';
import EditDialog from './forms/EditDialog';

import PrintCardsPDFReader from './printers/PrintCardsPDFReader';
import ProfilePDFReader from './printers/ProfilePDFReader';
import style from "./EmployeesActiveTab.lazy.css";
import Avatar from "@mui/material/Avatar";
import Chip from "@material-ui/core/Chip";
import findByIdsActiveEmployee from "mutations/all/EmployeeActive/findByIdsActiveEmployee";
import AEmployeeListTab, {StatsPanel} from "./AEmployeeListTab";
import updateJobPosition from "../../../../mutations/all/JobPosition/updateJobPosition";
import updateEmployee from "../../../../mutations/all/Employee/updateEmployee";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Main">
@observer
class Main extends AEmployeeListTab {
    static key = 'Employees';
    static title = 'Employees';
    static faIconLeft = 'users';

    pageKey = "EmployeesActiveTab";
    removed = false;
    findByIdsEmployees = findByIdsActiveEmployee;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSendApplicationLink = this.onSendApplicationLink.bind(this);
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onSubmitPrintCards = this.onSubmitPrintCards.bind(this);

        this.onCompleteEmploymentDetailsShowWarningMsg = this.onCompleteEmploymentDetailsShowWarningMsg.bind(this);
        this.onUpdateEmployee = this.onUpdateEmployee.bind(this);
    }

    // </editor-fold>

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onSendApplicationLink">
    onSendApplicationLink(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        const {id, data: {email}} = item;
        if (email) {
            progressDialog.open("Please wait...");
            neonBinding.events.emit(this.path + "send-app-link", id).then(res => {
                infoDialog.open("Link successfully sent.");
                infoDialog.close(2000);
            }).finally(() => {
                progressDialog.close();
            });
        } else {
            infoDialog.open(<React.Fragment>
                <p>The employee does not have an username / email address.</p>
                <p>Please edit the employee and add his/her username / email address.</p>
            </React.Fragment>);
        }
    }

    //</editor-fold>

    //<editor-fold desc="onSaveAsPDF">
    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }

    //</editor-fold>

    //<editor-fold desc="onSubmitPrintCards">
    onSubmitPrintCards(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.printCardsPDFReader.open([item]);
    }

    //</editor-fold>

    //<editor-fold desc="onCompleteEmploymentDetailsShowWarningMsg">
    onCompleteEmploymentDetailsShowWarningMsg(evt) {
        let elem = window.$(evt.target);
        const idx = parseInt(elem.attr("idx"));
        if (this.openIdx === idx)
            return;

        const item = this.refs.root.list[idx];
        const {id, data: {fname, lname, client, project, site}} = item;
        const offset = elem.offset();
        const style = {left: "auto", right: calculateRightPos(elem[0], false) + 10, top: offset.top, width: 340};
        this.refs.popover.settings({
            style,
            isDialog: false,
            contentNode: <div>
                <p className="nav-item padding-0">
                    <b>{fname + " " + lname}</b> details are incomplete.<br/>
                    <small className="hor-center text-center">
                        .......................................<br/>
                        Please do the following actions for this employee.<br/>
                        Note: These actions are required.
                    </small>
                </p>
                <hr/>
                {!client && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Client / Company"/>}
                {!project && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Project"/>}
                {!site && <NavItem item={item} onClick={this.onUpdateEmployee} title="Add Site"/>}
            </div>
        }).open();
    }

    //</editor-fold>

    //<editor-fold desc="onUpdateEmployee">
    onUpdateEmployee(evt, elem) {
        const {item} = elem.props;
        this.refs.root.onEdit(evt, elem, item);
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Employees";
        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSendApplicationLink} faIconLeft="paper-plane"
                     title="Send Application Link"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"
                     title="Save As PDF"/>
            <NavItem action="writable" idx={idx} onClick={this.onSubmitPrintCards} faIconLeft="print"
                     title="Print Card"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectDepartmentInput name="department" placeholder="Department..." required className="form-control"
                                   onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." required className="form-control"
                                    onChange={onChange}/>
            <SelectTeamInput name="team" placeholder="Team..." required className="form-control"
                                    onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." required className="form-control"
                                    onChange={onChange}/>
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="id_or_pass_num" type="text" placeholder="ID/Passport No." className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {isConsultant, hasProjects, isContractorView} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Name</div>
            <div className="td">Department</div>
            <div className="td">Job Position</div>
            {(hasProjects || isContractorView) && <>
                {/*isConsultant && <div className="td sm-hidden">Company Name</div>*/}
                {isContractorView && <div className="td">Company Name</div>}
                {!isContractorView && <div className="td">Project Name</div>}
                <div className="td">Site Name</div>
            </>}
            <div className="td fixed-flex min-w-500">Stats</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const {isConsultant, hasProjects, isContractorView} = storage.is;
        const item = this.refs.root.list[n];
        let {
            id,
            data: {
                created_at, fname, lname, profile_pic,
                department, job_position, supervisor,
                client, project, site,
                medical_list_aggregate, leave_list_aggregate, ppe_list_aggregate,
                trainer_training_list_aggregate, warning_list_aggregate,
                supervisor_employee_list_aggregate,
            }
        } = item;

        return <TRow key={id}>
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Name</h6>
                <Clickable
                    idx={n}
                    onClick={this.refs.root.onView}
                >
                    <Chip
                        avatar={<Avatar alt={lname + ' ' + fname}
                                        src={profile_pic && profile_pic.dlUrls && profile_pic.dlUrls[0]}/>}
                        label={lname + ' ' + fname}
                        sx={{cursor: "pointer"}}
                    />
                </Clickable>
            </div>
            <AsyncTD title="Department" defaultValue={department}
                     renderer={v => v.name}/>
            <AsyncTD title="Job Position" defaultValue={job_position}
                     renderer={v => v.name}/>

            {(hasProjects || isContractorView) && <>
                {/*isConsultant && RenderUtils.renderOrgTD(client, null, 'Company Name', 'sm-hidden')*/}
                {isContractorView && RenderUtils.renderOrgTD(client, null, 'Company Name', 'sm-hidden')}
                {!isContractorView && RenderUtils.renderOrgTD(project, null, 'Project Name')}
                {RenderUtils.renderOrgTD(site, null, 'Site Name')}
            </>}

            <div className="td fixed-flex min-w-500 padding-r-10 flex td-stats">
                <StatsPanel item={item}/>
            </div>

            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                {hasProjects && (!site || !project || (isConsultant && !client)) &&
                    <i className="fa fa-warning" idx={n} onClick={this.onCompleteEmploymentDetailsShowWarningMsg}/>}
            </div>
        </TRow>;
    }

    // </editor-fold>
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite
            ref="root"
            page={this}
            pageId={this.pageKey + "-tab"}
            pageTitle="Employees"
            pageTitleSingular="employee"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateEmployee}/>

            <NewDialog ref="newDialog" path={this.path}/>
            <ProfileDialog ref="profileDialog" path={this.path}/>
            <EditDialog ref="editDialog" path={this.path}/>

            <ProfilePDFReader ref="pdfReader"/>
            <PrintCardsPDFReader ref="printCardsPDFReader"/>

            <Popover ref="popover"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

// </editor-fold>

export default Main;