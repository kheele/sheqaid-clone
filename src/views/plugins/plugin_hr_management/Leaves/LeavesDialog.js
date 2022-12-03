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

import NewLeaveDialog from './NewLeaveDialog';
import EditLeaveDialog from './EditLeaveDialog';
import ProfileLeaveDialog from "./ProfileLeaveDialog";
import AEmployeeDocDialog from '../AEmployeeDocDialog';

import LeavesRenderRow from "./LeavesRenderRow";

import style from "./LeavesDialog.lazy.css";
import SignatureDialog from "../../../../components/dialogs/SignatureDialog";

// </editor-fold>

@observer
class LeavesDialog extends AEmployeeDocDialog {
    path = "plugin_sheq_assist/employees/leaves/";
    pageKey = "LeavesDialog";
    title = "Leaves";
    titleSingular = "Leave";
    permissionKey = "Leaves";
    
    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            types: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'],
            due_to: [{label: 'Occurred Incident', value: 'Occurred Incident'}, {label: 'Other', value: 'Other'}],
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
        return <div className="controls grid-3 grid-gap-5 -margin-b-35 padding-r-10">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="select" placeholder="Leave Type..." className="form-control" onChange={onChange} values={this.selfState.lists.types} returnValue/>
            <ClearableInput name="due_to" type="select" placeholder="Leave Due To..." className="form-control" onChange={onChange} values={this.selfState.lists.due_to} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Start Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Leaves</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <LeavesRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            listCountTopTitle="leave"
            pageTitleSingular="leaves"
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
            
            <NewLeaveDialog ref="newDialog" path={this.path} onSetSignatureSettings={this.onSignatures}/>
            <ProfileLeaveDialog ref="profileDialog" path={this.path}/>
            <EditLeaveDialog ref="editDialog" path={this.path}/>

            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="Leaves"/>
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default LeavesDialog;
