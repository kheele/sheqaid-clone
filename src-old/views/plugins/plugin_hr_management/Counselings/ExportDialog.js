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
    titleSingular = 'Counseling';
    titlePlural = 'Counselings';

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
            types: [
                'Directive Counseling',
                'Nondirective Counseling',
                'Cooperative Counseling',
                'Participative Counseling',
                'Desensitization',
                'Catharsis',
                'Insight',
                'Developing the new patterns'
            ].map(label => {
                return {label, value: label};
            }),
            reasons: [
                'Attendance',
                'Behaviour / Teamwork',
                'Inappropriate Conduct',
                'Inappropriate Dress',
                'Safety Violation',
                'Sleeping On The Job',
                'Substandard Work',
                'Violence'
            ].map(label => {
                return {label, value: label};
            }),
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {
                label: '1 month',
                value: 1
            }, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
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
        responsible_person: null,
        types: null,
        reasons: null,
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
            <div className="td">Responsible Person</div>
            <div className="td">Types</div>
            <div className="td">Reasons</div>
            <div className="td fixed-flex min-w-90">Previous</div>
            <div className="td fixed-flex min-w-125">Completion Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n) {
        let {
            id, data: {
                fname, lname,
                optional_info, client, project, site, client_id, project_id, site_id,

                employee_counselling_list, sub_collection_keys: {
                    employee_counselling_list: {latest, id: ids}
                }
            }
        } = item;

        const last = employee_counselling_list[latest.id];
        const {
            created_at,
            employee,
            responsible_person,
            //2
            types,
            reasons,
            incident_desc,
            corrective_actions,
            counselling_hrs_to_complete,
            expiry_date,
            witness_list,
            //3
            doc
        } = last;

        const responsible_person_name = (v) => {
            if (!v) return 'N/A';
            const {id, lname, fname, data} = v;
            return (lname || data.lname) + ' ' + (fname || data.fname);
        };

        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td">{responsible_person_name(responsible_person)}</div>
            <div className="td">{types ? types.map(v => <span>{v}</span>) : 'N/A'}</div>
            <div className="td">{reasons ? reasons.map(v => <span>{v}</span>) : 'N/A'}</div>
            <div className="td fixed-flex min-w-90">{ids.length - 1}</div>
            <div className="td fixed-flex min-w-125">{renderExpiryDateSpan(expiry_date)}</div>
        </React.Fragment>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>
            <SelectDepartmentInput ref="department_id" name="department" placeholder="Department..."
                                   className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..."
                                    className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..."
                                 className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <SelectEmployeeInput ref="responsible_person" name="responsible_person" placeholder="Responsible Person..."
                                 className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <ClearableInput ref="types" name="types" type="select_multi" placeholder="Counseling Types..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.state.lists.types} returnValue add/>
            <ClearableInput ref="reasons" name="reasons" type="select_multi" placeholder="Reasons For Counseling..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.state.lists.reasons} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.state.lists.expiry_date} returnValue/>
            <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
                            placeholder="Expiry Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <ListPDFReader ref="pdfReader"/>
        </React.Fragment>;
    }

    // </editor-fold>
}

export default ExportDialog;
