// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {getRandomRolor} from '../../../../../utils/Utils';
import {ClearableInput, DateRangeInput, SelectEmployeeInput} from '../../../../../components/inputs';
import {THead} from '../../../../../components/tables';

import {AControls, AExportDialog} from '../../../../../components/exports/AExportDialog';

import NCRRenderRow from "./NCRRenderRow";
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
    path = "plugin_sheq_assist/ncr/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            type: ['Corrective Action', 'Preventative Action', 'Opportunity For Improver'],
            priority: ['Low', 'Medium', 'High', 'Critical'],
            status: ['Pending', 'Progress', 'Approved', 'Rejected', 'Completed'],
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
        responsible_person_id: null,
        approving_person_id: null,
        //
        type: null,
        priority: null,
        source: null,
        //
        status: null,
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

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        const {source, selected_source} = this.filterData;
        return <THead>
            <div className="td fixed-flex min-w-20">#</div>
            <div className="td fixed-flex min-w-100">Due Date</div>
            <div className="td fixed-flex min-w-130">Date Completed</div>
            <div className="td fixed-flex min-w-70">Priority</div>
            <div className="td fixed-flex min-w-180">Type</div>
            <div className="td">Finding/NCR Description</div>
            <div className="td fixed-flex min-w-180">Responsible Person</div>
            <div className="td fixed-flex min-w-90">Status</div>
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
        const source = this.props.dialog.extraProp('source');
        
        return <React.Fragment>    
            <SelectEmployeeInput ref="responsible_person_id" name="responsible_person" placeholder="Responsible Person..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="approving_person_id" name="approving_person" placeholder="Approving Person..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="type" name="type" type="select" placeholder="Type..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
            <ClearableInput ref="priority" name="priority" type="select" placeholder="Priority..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.priority} returnValue/>
            <ClearableInput ref="source" name="source" type="select" placeholder="Source..." defaultValue={source} className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.source} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="status" name="status" type="select" placeholder="Status..." vertical className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.status} returnValue/>
            <ClearableInput ref="result" name="result" type="radio" placeholder="Result" className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.result} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <DateRangeInput ref="due_date_range" name="due_date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Due Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <DateRangeInput ref="progress_date_range" name="progress_date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Progress Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <DateRangeInput ref="completed_date_range" name="completed_date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Completed Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
        </React.Fragment>;
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
