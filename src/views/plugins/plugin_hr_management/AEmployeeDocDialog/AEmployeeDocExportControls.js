// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, extendObservable} from 'mobx';
import {
    ClearableInput,
    DateRangeInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
} from 'components/inputs';

import {AControls} from 'components/exports/AExportDialog';
import {execWhen} from "utils/UtilsFuns";
// </editor-fold>

@observer
class Controls extends AControls {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {
                label: '1 month',
                value: 1
            }, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        },
        searchList: [],
    };

    @observable
    filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        department_id: null,
        job_position_id: null,
        employee_id: null,
        //
        // ...(this.filterDataExtra || {}),
        //
        expiry_date: null,
        date_range: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        execWhen(() => this.path).then(() => {
            const {filterDataExtra} = this;
            if (filterDataExtra) {
                extendObservable(this.filterData, filterDataExtra);
                execWhen(() => this.filterData).then(this.onListenChanges);
                console.log('filterData', this.filterData, filterDataExtra);
            }
        });

        this.onBuildQuery = this.onBuildQuery.bind(this);
    }
    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {onBuildQuery} = this;

        const {page, lastItem, filterData, filtered, isNew} = params;

        const attrs = onBuildQuery ? onBuildQuery(params) : {};

        const {
            client_id,
            project_id,
            site_id,
            //
            department_id,
            job_position_id,
            employee_id,
            team_id,
            supervisor_id,
            name,
            //
            expiry_date,
            date_range,
        } = filterData || {};

        const listByLogged = sockets.of(attrs.path).fn('listByLogged');
        delete attrs.path;

        return listByLogged({
            view: 'EACH',
            client_id,
            project_id,
            site_id,
            //
            expiry_date,
            date_range,
            //
            department_id,
            job_position_id,
            employee_id,
            team_id,
            supervisor_id,
            name,
            //
            ...attrs,
            //
            exact_orgs: true,
            //
            limit: 0,
            offset: 0,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <>
            <SelectDepartmentInput ref="department_id" name="department" placeholder="Department..."
                                   className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..."
                                    className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="employee_id" name="employee" placeholder="Employee..."
                                 className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            {this.renderFieldsExtra}

            <ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.state.lists.expiry_date} returnValue/>
            <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
                            placeholder="Expiry Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
        </>;
    }
    // </editor-fold>
}

export default Controls;