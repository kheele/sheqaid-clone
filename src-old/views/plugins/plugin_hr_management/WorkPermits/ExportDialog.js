// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../utils/Utils';
import {renderExpiryDateSpan} from '../../../../utils/ComponentUtils';
import {
    ClearableInput,
    DateRangeInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput
} from '../../../../components/inputs';
import {THead} from '../../../../components/tables';

import ListPDFReader from './printers/ListPDFReader';

import {AControls, AExportDialog} from '../../../../components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Work Permit';
    titlePlural = 'Work Permits';

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
	},
        searchList: []
    };
    @observable filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        department_id: null, 
        job_position_id: null, 
        employee: null,
        //
        expiry_date: null, 
        date_range: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-120">Date</div>
            <div className="td fixed-flex min-w-105">Expiry Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n){
        let {id, data: {
                fname, lname, 
                optional_info, client, project, site, client_id, project_id, site_id,
                
                employee_work_permit_list, sub_collection_keys: {
                    employee_work_permit_list: {latest, id: ids}
                }
            }
        } = item;
        
        const last = employee_work_permit_list[latest.id];
        const {created_at, date, expiry_date, notes, doc} = last;
        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(date) || 'N/A'}</div>
            <div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
        </React.Fragment>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>
            <SelectDepartmentInput ref="department_id" name="department" placeholder="Department..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.expiry_date} returnValue/>
            <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Expiry Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <ListPDFReader ref="pdfReader"/>
        </React.Fragment>;
    }
    // </editor-fold>
}

export default ExportDialog;
