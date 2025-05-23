// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {
    ClearableInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectPPEItemInput,
    SelectPPETypeInput,
    SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
import LeaveTypeRenderRow from "./LeaveTypeRenderRow";
import {exportExcelEmployeeLeaveTypes} from "mutations/exportExcel";
import {listEmployeeLeaveTypes} from "mutations/listByLogged";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Leave Type';
    titlePlural = 'Leave Types';

    get excludePDF() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends AControls {
    exportFn = exportExcelEmployeeLeaveTypes;

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        searchList: []
    };
    @observable filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        team_id: null,
        department_id: null,
        job_position_id: null,
        employee_id: null,
        //
        name: null,
        contact_person: null,
        ppe_item_id: null,
        ppe_type_id: null,
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <>
            <SelectDepartmentInput ref="department_id" name="department" placeholder="Department..."
                                   className="col-lg-12 form-control" parentClassName="margin-0"
                                   onChange={this.form.onChange}
                                   addButton={false}/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..."
                                    className="col-lg-12 form-control" parentClassName="margin-0"
                                    onChange={this.form.onChange}
                                    addButton={false}/>
            <SelectTeamInput ref="team_id" name="team" placeholder="Team..." className="col-lg-12 form-control"
                             parentClassName="margin-0"
                             onChange={this.form.onChange}
                             addButton={false}/>
            <SelectEmployeeInput ref="employee_id" name="employee" placeholder="Employee..."
                                 className="col-lg-12 form-control" parentClassName="margin-0"
                                 onChange={this.form.onChange}
                                 addButton={false}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="name" name="name" type="text" placeholder="Supplier"
                            className="col-lg-12 margin-0 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput ref="contact_person" name="contact_person" type="text" placeholder="Contact Person"
                            className="col-lg-12 margin-0 form-control"
                            onChange={this.form.onChange}/>
            <SelectPPETypeInput ref="ppe_type_id" name="ppe_type" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={this.form.onChange} addButton={false}/>
            <SelectPPEItemInput ref="ppe_item_id" name="ppe_item" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={this.form.onChange} addButton={false}/>
        </>;
    }

    //</editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList({isNew, filterData}) {
        const {
            client_id,
            project_id,
            site_id,
            //
            team_id,
            department_id,
            job_position_id,
            employee_id,
            //
            name,
            contact_person,
            ppe_item_id,
            ppe_type_id,
        } = filterData || {};

        return listEmployeeLeaveTypes({
            client_id,
            project_id,
            site_id,
            //
            team_id,
            department_id,
            job_position_id,
            employee_id,
            //
            name,
            contact_person,
            ppe_item_id,
            ppe_type_id,
            //
            exact_orgs: true,
            //
            limit: 0,
            offset: 0,
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td">Supplier</div>
            <div className="td">Contact Person</div>
            <div className="td">Email Address</div>
            <div className="td">Phone No.</div>
            <div className="td">Address</div>
            <div className="td fixed-flex min-w-110">PPE Items</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n) {
        return <LeaveTypeRenderRow key={item.id} idx={n} item={item} renderActionsCol/>;
    }

    // </editor-fold>
}

export default ExportDialog;
