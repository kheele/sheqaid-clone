// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {
    ActionsButton,
    ClearableInput,
    SelectDepartmentInput,
    SelectJobPositionInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AsyncTD} from 'views/plugins/components';

import ProfileDialog from './ProfileDialog';

import ProfilePDFReader from './printers/ProfilePDFReader';
// </editor-fold>
import style from "./EmployeesRemovedTab.lazy.css";
import Avatar from "@mui/material/Avatar";
import Chip from "@material-ui/core/Chip";

// <editor-fold defaultstate="collapsed" desc="RemovedMain">
@observer
class Main extends React.Component {
    path = "plugin_sheq_assist/employees/removed/";
    pageKey = "EmployeesRemovedTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onReInstead = this.onReInstead.bind(this);
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        
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

    // <editor-fold defaultstate="collapsed" desc="onReInstead">
    onReInstead(evt, btn) {
        confirmDialog.open("Are you sure you want to re-instead the employee?").then(res => {
            if (res === 1) {
                const {idx} = btn.props;
                const {list} = this.refs.root;
                const item = list[idx];
                progressDialog.open("Re-insteading the employee...");
                neonBinding.events.emit(this.path + "re-instead", item.id).then(res => {
                    setTimeout(() => {
                        list.removeIf((item, _idx) => _idx === idx);
                    });
                    infoDialog.open("Employee successfully re-insteaded.");
                    infoDialog.close(2000);
                }).finally(() => {
                    progressDialog.close();
                });
            }
        });
    }
    // </editor-fold>

    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }
    
    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Employees";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="remove" idx={idx} onClick={this.onReInstead} faIconLeft="ban" title="Re-Instead"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectDepartmentInput name="department" placeholder="Department..." required className="form-control" onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." required className="form-control" onChange={onChange}/>
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="identity_num" type="text" placeholder="ID/Passport No." className="form-control" onChange={onChange}/>
        </div>;
    }

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

    renderItem(n, onClick) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
	const item = this.refs.root.list[n];
        let {id, data: {created_at, fname, lname, profile_pic, optional_info, client, project, site, client_id, project_id, site_id}} = item;
//        console.log('employee', item)
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
            <AsyncTD title="Department" defaultValue={optional_info && optional_info.department} renderer={v => v.name || v.data.name}/>
            <AsyncTD title="Job Position" defaultValue={optional_info && optional_info.job_position} renderer={v => v.name || v.data.name}/>
            
            {hasProjects && <React.Fragment>
                {isConsultant && RenderUtils.renderOrgTD(client, null, 'Company Name', 'sm-hidden')}
                {RenderUtils.renderOrgTD(project, null, 'Project Name')}
                {RenderUtils.renderOrgTD(site, null, 'Site Name')}
            </React.Fragment>}
            
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
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
            pageTitle="Removed Employees"
            pageTitleSingular="removed employee"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
        
            <ProfileDialog ref="profileDialog" path={this.path} isRemoved/>
            <ProfilePDFReader ref="pdfReader" isRemoved/>
            
            <Popover ref="popover"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}
// </editor-fold>

export default Main;