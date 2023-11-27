// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {Dates, isWeb} from 'utils/Utils';
import {Button, DateRangeInput, SelectClientInput} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import {ANewDialog} from 'components/dialogs';

import {getDocsStatus, getWClStatus} from '../../ClaimFuns';

import {AsyncTD} from 'views/plugins/components';
// </editor-fold>
import style from "./ExportClaimsDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportClaimsDialog extends ANewDialog {
    pageKey = "ExportClaimsDialog";
//    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }
    
    get title() {
        return "Export Claims(s)";
    }
    
    get topButtons() {
        const title = () => {
            return "Export";
        };
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>{title()}
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/COIDA_Management/claims/coid-provider/";

    @observable
    state = {
        claimList: []
    };
    filterData;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
                
        this.onSearch = this.onSearch.bind(this);
        this.onLoadListClaims = this.onLoadListClaims.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onUnSelectAll = this.onUnSelectAll.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    onLoadListClaims(isNew) {
        return neonBinding.events.emit(this.path + 'select/filter', {isNew, ...this.filterData});
    }
    
    // <editor-fold defaultstate="collapsed" desc="onSearch">
    onSearch(){
        const {form} = this;
        if (!form.isValid('client_from')) {
            infoDialog.open('Company is required');
            return;
        }
        const {
            client_from, date_range
        } = form.data;
        this.filterData = {client_id: client_from.id};
        if(date_range) {
            const {start, end} = date_range;
            this.filterData.date_range = {};
            if(start) {
                this.filterData.date_range.start = start.getTime();
            }
            if(end) {
                this.filterData.date_range.end = end.getTime();
            }
        }
        
        const {claimList} = this.state;
        this.refs.selectClaimTable.setSelectedList(claimList).open().then(list => {
            this.state.claimList.clear(); 
            this.state.claimList.push(...list);
//            this.filterData = null;
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        return this.onSubmitExport(e, btn, onSaved);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmitExport">
    onSubmitExport(e, btn, onSaved) {
        const {form, state: {claimList}} = this;
        
        if(claimList.isEmpty()) {
            infoDialog.open('Please select at least one Claim');
            return;
        }
        
        btn.text("Exporting...").disabled();
        neonBinding.events.emit(this.path + "export-excel", claimList.slice()).then(res => {
            if(!res) {
                infoDialog.open(<React.Fragment>
                    <p>An error occurred. Please try again</p>
                </React.Fragment>);
            } else {
                if(isWeb()) {
                    infoDialog.open(<React.Fragment>
                        <p>Claims successfully exported.</p>
                        <p><small>The file will be automatically downloaded</small></p>
                    </React.Fragment>);
                    saveFileAs(res, `Claims-Report_${Dates.formatDate(new Date())}.xlsx`);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>Claims successfully exported.</p>
                        <p>Saved in the following folder:</p>
                        <p><small>{res.path}</small></p>
                        <p><small>The file will open after 3 seconds</small></p>
                    </React.Fragment>);
                }
            }
        }).catch(err => {
            infoDialog.open(<React.Fragment>
                    <p>An error occurred. Please check your network connection and try again</p>
                </React.Fragment>);
        }).finally(() => {
            btn.text("Export").enabled();
        });
    }
    // </editor-fold>
    
    onSelectAll(e, btn) {
        
    }
    
    onUnSelectAll(e, btn) {
        
    }
    
    renderTHeadClaimsFrom() {
        return <THead>
            <div className="td fixed-flex min-w-85">Ref #</div>
            <div className="td fixed-flex min-w-120">Claim #</div>
            <div className="td fixed-flex min-w-120">Accident Date</div>
            <div className="td fixed-flex min-w-120">Resume Date</div>
            <div className="td fixed-flex min-w-120">Status</div>
            <div className="td fixed-flex min-w-120">Claim Status</div>
            <div className="td">Company Name</div>
            <div className="td">Employee Name</div>
            <div className="td fixed-flex min-w-130">Injury/Disease</div>
            <div className="td fixed-flex min-w-125">Documents</div>
            <div className="td fixed-flex min-w-110">W.Cl Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItemClaimsFrom(item, n){
        const {
            id, 
            data: {
                created_at, 
                client, project, site,
                //
                employee, employee_id, 
                claim_number,
                accident_date,
                //
                wcl_2 = {}, 
                wcl_4 = {}, 
                wcl_5_list = [], 
                wcl_6 = {}, 
                annexture_1 = {},
                //
                ref_num,
                status,
                claim_status, 
                message_list_provider = []
            }
        } = item;
        
        const {date_resumed_work} = wcl_2;
        console.log('Claim', toJS(item))
        
        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-85">{ref_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{claim_number || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(accident_date) || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(date_resumed_work) || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{claim_status || 'N/A'}</div>
            <div className="td w-auto">{client ? (client.name || client.data.name) : 'N/A'}</div>
            <AsyncTD 
                title="Employee Name" 
                defaultValue={employee} 
                renderer={v => `${v.lname || v.data.lname} ${v.fname || v.data.fname}`}
                className="w-auto"
            />
            <div className="td fixed-flex min-w-130">Injury</div>
            <div className="td fixed-flex grid-1 min-w-125 padding-t-3">{getDocsStatus(item)}</div>
            <div className="td fixed-flex grid-2 min-w-110 padding-t-3">{getWClStatus(item)}</div>
        </React.Fragment>;
    }
    
    get title() {
        return "Export";
    }
    
    get titleSelected() {
        return "Export";
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {title, titleSelected} = this;
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full">
                <div className="row col-lg-3 h-full padding-0">
                    <label className="heading text-center"><h4>Find Claim(s) To {title}:</h4></label>
                    <div className="row sec-group margin-t-10 padding-l-10 padding-r-10">    
                        <SelectClientInput name="client_from" group="orgs1" placeholder="Company..." required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-b-10 form-control" placeholder="Date Range" onChange={this.form.onChange}>
                            <label className="min-w-65">From</label>
                            <label className="min-w-50">To</label>
                        </DateRangeInput>
                        <Button className="btn btn-primary hor-center margin-b-10" onClick={this.onSearch}>
                            Find Claim(s)
                        </Button>
                    </div>
                    <SelectTable ref="selectClaimTable" 
                        isDialog 
                        replaceCols 
                        name="incident" 
                        desc="Claims" 
                        title="Select Claim(s)" 
                        className="col-lg-12 no-padding SelectClaimTable" 
                        renderTHead={this.renderTHeadClaimsFrom} 
                        renderItem={this.renderItemClaimsFrom} 
                        onLoadList={this.onLoadListClaims} 
                        onUnSelectAll={this.onUnSelectAll}
                        onSelectAll={this.onSelectAll}
                        isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
                <div className="row col-lg-9 h-full pull-right padding-0">
                    <label className="heading text-center"><h4>Claim(s) To {titleSelected}:</h4></label>
                    <SelectTable ref="selectedClaimTable" 
                        replaceCols
                        name="incident" 
                        desc="Claims" 
                        title="Selected Claim(s)" 
                        className={"col-lg-12 no-padding SelectedClaimTable Table-" + (title.replaceAll(' ', ''))}
                        renderTHead={this.renderTHeadClaimsFrom} 
                        renderItem={this.renderItemClaimsFrom} 
                        list={this.state.claimList}
                        isChecked={(item, selectedList) => true}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default ExportClaimsDialog;
