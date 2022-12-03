// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {renderLeftButtonsForExpiryOnly} from '../../../../utils/ComponentUtils';
import APageListReadWrite from "../../../APageListReadWrite";
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ClearableInput, SelectEmployeeInput} from '../../../../components/inputs';
import {THead} from '../../../../components/tables';

import ExportDialog from './ExportDialog.js';

import NewContractDialog from './NewContractDialog';
import EditContractDialog from './EditContractDialog';
import ProfileContractDialog from "./ProfileContractDialog";
import AEmployeeDocDialog from '../AEmployeeDocDialog';

import ContractsRenderRow from "./ContractsRenderRow";

import style from "./ContractsDialog.lazy.css";

// </editor-fold>

@observer
class ContractsDialog extends AEmployeeDocDialog {
    path = "plugin_sheq_assist/employees/contracts/";
    pageKey = "ContractsDialog";
    title = "Contracts";
    titleSingular = "Contract";
    permissionKey = "Contracts";
    
    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            contract_type: ['Fixed Term', 'Permanent'].map(label => {
                return {label, value: label};
            }),
            payment_types: [{label: 'Salary (Fixed Payment)', value: 'Salary'}, {label: 'Hourly Wage', value: 'Wage'}],
            salary_intervals: [
                {label: 'Weekly', value: 'Weekly'}, 
                {label: 'Bi-Weekly', value: 'Bi-Weekly'}, 
                {label: 'Monthly', value: 'Monthly'}
            ],
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
	}
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="controls grid-3 grid-gap-5 padding-r-10 -margin-b-35">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput ref="contract_type" name="contract_type" type="select" placeholder="Contract Type..." className="form-control" onChange={onChange} values={this.selfState.lists.contract_type} returnValue/>
            <ClearableInput ref="payment_type" name="payment_type" type="select" placeholder="Payment Type..." className="form-control" onChange={onChange} values={this.selfState.lists.payment_types} returnValue/>
            <ClearableInput ref="salary_interval" name="salary_interval" type="select" placeholder="Salary Interval..." className="form-control" onChange={onChange} values={this.selfState.lists.salary_intervals} returnValue/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Contracts</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <ContractsRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        const {onLoadList, isRemoved} = this.props;
        
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            hasCreateBtn={() => !isRemoved}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="contract"
            pageTitleSingular="contracts"
            path={this.path}
            onLoadList={onLoadList}
            noAnimation={true}
            renderDefaultLeftButtons={this.renderDefaultLeftButtons}
            renderLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
            renderRightButtons={this.renderRightButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewContractDialog ref="newDialog" path={this.path}/>
            <ProfileContractDialog ref="profileDialog" path={this.path}/>
            <EditContractDialog ref="editDialog" path={this.path}/>
            
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default ContractsDialog;
