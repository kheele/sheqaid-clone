// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {calculateRightPos, Dates} from 'utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {ConfirmDialog} from 'components/dialogs';
import {
    ActionsButton,
    ClearableInput,
    SelectDepartmentInput,
    SelectJobPositionInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AsyncTD} from 'views/plugins/components';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import PrintCardsPDFReader from './printers/PrintCardsPDFReader';
import ProfilePDFReader from './printers/ProfilePDFReader';
// </editor-fold>
import style from "./EmployeesActiveTab.lazy.css";
import Avatar from "@mui/material/Avatar";
import Chip from "@material-ui/core/Chip";

// <editor-fold defaultstate="collapsed" desc="Main">
@observer
class Main extends React.Component {
    static key = 'Employees';
    static title = 'Employees';
    static faIconLeft = 'users';

    path = "plugin_sheq_assist/employees/";
    pageKey = "EmployeesActiveTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSendApplicationLink = this.onSendApplicationLink.bind(this);
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onSubmitPrintCards = this.onSubmitPrintCards.bind(this);

        this.onCompleteEmploymentDetailsShowWarningMsg = this.onCompleteEmploymentDetailsShowWarningMsg.bind(this);
        this.onUpdateEmployee = this.onUpdateEmployee.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

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

    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }

    onSubmitPrintCards(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.printCardsPDFReader.open([item]);
    }

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

    onUpdateEmployee(evt, elem) {
        const {item} = elem.props;
        this.refs.root.onEdit(evt, elem, item);
    }

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Employees";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
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
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="identity_num" type="text" placeholder="ID/Passport No." className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-120 md-hidden">Date Created</div>
            <div className="td">Name</div>
            <div className="td">Department</div>
            <div className="td">Job Position</div>
            {hasProjects && <React.Fragment>
                {isConsultant && <div className="td sm-hidden">Company Name</div>}
                <div className="td">Project Name</div>
                <div className="td">Site Name</div>
            </React.Fragment>}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const item = this.refs.root.list[n];
        let {
            id, data: {
                created_at, fname, lname, profile_pic,
                optional_info,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        return <TRow key={id}>
            <div className="td fixed-flex min-w-120 md-hidden">
                <h6 className="xs-shown font-size-13">Date Created</h6>
                {Dates.formatDate(created_at)}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Name</h6>
                <Chip
                    avatar={<Avatar alt={lname + ' ' + fname} src={profile_pic && profile_pic.dlUrls && profile_pic.dlUrls[0]} />}
                    label={lname + ' ' + fname}
                />
            </div>
            <AsyncTD title="Department" defaultValue={optional_info && optional_info.department}
                     renderer={v => v.name || v.data.name}/>
            <AsyncTD title="Job Position" defaultValue={optional_info && optional_info.job_position}
                     renderer={v => v.name || v.data.name}/>

            {hasProjects && <React.Fragment>
                {isConsultant && RenderUtils.renderOrgTD(client, null, 'Company Name', 'sm-hidden')}
                {RenderUtils.renderOrgTD(project, null, 'Project Name')}
                {RenderUtils.renderOrgTD(site, null, 'Site Name')}
            </React.Fragment>}

            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                {hasProjects && (!site || !project || (isConsultant && !client)) &&
                    <i className="fa fa-warning" idx={n} onClick={this.onCompleteEmploymentDetailsShowWarningMsg}/>}
            </div>
        </TRow>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite
            ref="root"
            page={this}
            pageId={this.pageKey + "-tab"}
            pageTitle="Employees"
            pageTitleSingular="employee"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

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