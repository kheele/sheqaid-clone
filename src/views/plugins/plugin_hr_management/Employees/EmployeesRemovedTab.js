// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {
    ActionsButton,
    ClearableInput, Clickable,
    SelectDepartmentInput, SelectEmployeeInput,
    SelectJobPositionInput, SelectTeamInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AsyncTD} from 'views/plugins/components';

import ProfileDialog from './forms/ProfileDialog';

import ProfilePDFReader from './printers/ProfilePDFReader';
import style from "./EmployeesRemovedTab.lazy.css";
import Avatar from "@mui/material/Avatar";
import Chip from "@material-ui/core/Chip";
import employeeInactiveStore from "mutations/all/EmployeeInactive";
import findByIdsInactiveEmployee from "mutations/all/EmployeeInactive/findByIdsInactiveEmployee";
import AEmployeeListTab, {StatsPanel} from "./AEmployeeListTab";
import updateEmployee from "mutations/all/Employee/updateEmployee";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RemovedMain">
@observer
class Main extends AEmployeeListTab {
    path = "plugin_sheq_assist/employees/removed/";
    pageKey = "EmployeesRemovedTab";
    removed = true;
    findByIdsEmployees = findByIdsInactiveEmployee;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

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
                updateEmployee({id: item.id, removed: false}).then(res => {
                    setTimeout(() => {
                        list.removeIf((item, _idx) => _idx === idx);
                    });
                    infoDialog.open("Employee successfully re-insteaded.");
                    infoDialog.close(2000);
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    progressDialog.close();
                });
            }
        });
    }

    // </editor-fold>

    //<editor-fold desc="onSaveAsPDF">
    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Employees";
        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="remove" idx={idx} onClick={this.onReInstead} faIconLeft="ban" title="Re-Instead"/>
            {/*<hr action="writable"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"*/}
            {/*         title="Save As PDF"/>*/}
        </Options>;
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
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

    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        const {isConsultant, hasProjects, isContractorView} = storage.is;
        const {filterData} = this.props.params || {};
        const {department_id, job_position_id} = filterData || {};
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Name</div>
            {!department_id && <div className="td">Department</div>}
            {!job_position_id && <div className="td">Job Position</div>}
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

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const {isConsultant, hasProjects, isContractorView} = storage.is;

        const {filterData} = this.props.params || {};
        const {department_id, job_position_id} = filterData || {};

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
       console.log('employee', item)
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
            {!department_id && <AsyncTD title="Department" defaultValue={department} renderer={v => v.name}/>}
            {!job_position_id && <AsyncTD title="Job Position" defaultValue={job_position} renderer={v => v.name}/>}

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
            </div>
        </TRow>;
    }

    //</editor-fold>

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite
            ref="root"
            page={this}
            pageId={this.pageKey + "-tab"}
            pageTitle="Removed Employees"
            pageTitleSingular="removed employee"
            onLoadList={this.onLoadList}
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
