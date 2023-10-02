// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {getRandomRolor} from 'utils/Utils';
import {ClearableInput, DateRangeInput, SelectEmployeeInput, SelectJobPositionInput} from 'components/inputs';
import {THead} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';

import NCRRenderRow from "./NCRRenderRow";
import byLogged from "../NCRTab/Query/List/listAllNCRByLogged";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Non-Comformance';
    titlePlural = 'Non-Comformances';
    
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
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "plugin_sheq_assist/ncr/";

    @observable
    state = {
        lists: {
            type: ['Corrective Action', 'Preventative Action', 'Opportunity For Improver'],
            priority: ['Low', 'Medium', 'High', 'Critical'],
            allocation: ['NCR', 'Finding', 'Observation', 'Deviation'],
            status_progress: ['Pending', 'Progressed', 'Approved', 'Rejected', 'Completed'],
            status_acceptance: ['Pending', 'Approved', 'Rejected'],
            responsible_party_list: ['Consultant', 'Client', 'External'],
            result: ['Pass', 'Fail'].map(text => {
                return {text, value: text, checked: false};
            }),
            source: ['Site Audit', 'Compliance Audit', 'Inspection', 'Incident Investigation']
        },
        searchList: []
    };
    @observable
    filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        responsible_party_list: null,
        assigned_job_position_list: null,
        assigned_person_list: null,
        approving_person_list: null,
        //
        type: null,
        priority: null,
        allocation: null,
        source: null,
        //
        status_progress: null,
        status_acceptance: null,
        result: null,
        //
        due_date_range: null,
        progress_date_range: null,
        completed_date_range: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            source,
            responsible_party_list,
            assigned_job_position_list,
            assigned_person_list,
            approving_person_list,

            type,
            priority,
            allocation,
            status_progress,
            status_acceptance,
            result,
            due_date_range,
            progress_date_range,
            completed_date_range,
        } = filterData || {};

        const limit = 50;

        const args = {
            removed: false,
            source,
            responsible_party_list,
            assigned_job_position_list: assigned_job_position_list && assigned_job_position_list.map(({id}) => id),
            assigned_person_list: assigned_person_list && assigned_person_list.map(({id}) => id),
            approving_person_list: approving_person_list && approving_person_list.map(({id}) => id),

            type,
            priority,
            allocation,
            status_progress,
            status_acceptance,
            result,
            due_date_range,
            progress_date_range,
            completed_date_range,
            //
            limit,
            //
            exact_orgs: true,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        const {source, selected_source} = this.filterData;
        return <THead>
            <div className="td fixed-flex min-w-20">#</div>
            <div className="td fixed-flex min-w-100">Due Date</div>
            <div className="td fixed-flex min-w-130">Date Completed</div>
            <div className="td fixed-flex min-w-70">Priority</div>
            <div className="td fixed-flex min-w-180">Type</div>
            <div className="td fixed-flex min-w-120">Allocation</div>
            <div className="td">Finding/NCR Description</div>
            <div className="td fixed-flex min-w-180">Responsible Party</div>
            <div className="td fixed-flex min-w-180">Assigned To</div>
            <div className="td fixed-flex min-w-140">Progress Status</div>
            <div className="td fixed-flex min-w-60">Result</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {source, selected_source} = this.filterData;
        return <NCRRenderRow key={item.id} idx={n} item={item} source={source} selected_source={selected_source} renderActionsCol={renderActionsCol} onClick={onClick}/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderBeforeResults">
    get renderBeforeResults() {
        return <TitlePanel state={this.filterData}/>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        const {responsible_party_list, type, priority, allocation, source: sourceList, status_progress, status_acceptance, result,} = this.state.lists;
        const source = this.props.dialog.extraProp('source');

        const {onChange} = this.form;
        
        return <>
            <ClearableInput ref="responsible_party_list" name="responsible_party_list" type="select_multi" placeholder="Responsible Party..."
                            className="col-lg-12 margin-b-10 form-control" onChange={onChange}
                            values={responsible_party_list} returnValue add/>
            <SelectJobPositionInput ref="assigned_job_position_list" name="assigned_job_position_list" placeholder="Assigned Job Position..."
                                    type="select_multi"
                                    className="col-lg-12 form-control" onChange={onChange} add={false}/>
            <SelectEmployeeInput ref="assigned_person_list" name="assigned_person_list" placeholder="Assigned Person..."
                                 type="select_multi"
                                 className="col-lg-12 margin-b-10 form-control" onChange={onChange}/>
            <SelectEmployeeInput ref="approving_person_list" name="approving_person_list" placeholder="Approving Person..." type="select_multi"
                                 className="col-lg-12 form-control" onChange={onChange}/>

            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="priority" name="priority" type="select" placeholder="Priority..." className="col-lg-12 form-control" onChange={onChange} values={priority} returnValue/>
            <ClearableInput ref="allocation" name="allocation" type="select" placeholder="Allocation..." className="col-lg-12 form-control" onChange={onChange} values={allocation} returnValue/>
            <ClearableInput ref="type" name="type" type="select" placeholder="Type..." className="col-lg-12 form-control" onChange={onChange} values={type} returnValue/>
            <ClearableInput ref="source" name="source" type="select" placeholder="Source..." defaultValue={source} className="col-lg-12 margin-0 form-control" onChange={onChange} values={sourceList} returnValue/>

            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="status_acceptance" name="status_acceptance" type="select" placeholder="Acceptance Status..." vertical className="col-lg-12 margin-0 form-control" onChange={onChange} values={status_acceptance} returnValue/>
            <ClearableInput ref="status_progress" name="status_progress" type="select" placeholder="Progress Status..." vertical className="col-lg-12 margin-0 form-control" onChange={onChange} values={status_progress} returnValue/>
            <ClearableInput ref="result" name="result" type="radio" placeholder="Result" className="col-lg-12 form-control" onChange={onChange} values={result} returnValue/>

            <hr className="pull-left no-border bg-ddd h-2"/>
            <DateRangeInput ref="due_date_range" name="due_date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Due Date Range" onChange={onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <DateRangeInput ref="progress_date_range" name="progress_date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Progress Date Range" onChange={onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <DateRangeInput ref="completed_date_range" name="completed_date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Completed Date Range" onChange={onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
        </>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="TitlePanel">
@observer
class TitlePanel extends React.Component {
    
    render() {
        const {state: {source}} = this.props;
        if(!source) return null;
        const style = {background: getRandomRolor()};  
        return <React.Fragment>
            <div style={style} className="TitlePanel flex margin-10 padding-20 color_white b">
                {source} Non-Comformances
            </div>
            <div className="TitlePanel-message flex flex-center">
                Non-Conformances are listed per {source}
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

export default ExportDialog;
