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

import NewWarningDialog from './NewWarningDialog';
import EditWarningDialog from './EditWarningDialog';
import ProfileWarningDialog from "./ProfileWarningDialog";
import AEmployeeDocDialog from '../AEmployeeDocDialog';

import WarningsRenderRow from "./WarningsRenderRow";

import style from "./WarningsDialog.lazy.css";
import SignatureDialog from "../../../../components/dialogs/SignatureDialog";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    path = "plugin_sheq_assist/employees/warnings/";
    pageKey = "WarningsDialog";
    title = "Warnings";
    titleSingular = "Warning";
    permissionKey = "Warnings";
    
    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            warning_types: ['Verbal', 'Written', 'Final'],
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
            <SelectEmployeeInput ref="issued_by" name="issued_by" placeholder="Issued By..." className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="select" placeholder="Warning Type..." className="form-control" onChange={onChange} values={this.selfState.lists.warning_types} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Warning Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Warnings</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <WarningsRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            listCountTopTitle="warning"
            pageTitleSingular="warnings"
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
            
            <NewWarningDialog ref="newDialog" path={this.path} onSetSignatureSettings={this.onSignatures}/>
            <ProfileWarningDialog ref="profileDialog" path={this.path}/>
            <EditWarningDialog ref="editDialog" path={this.path}/>

            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="Warnings"/>
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default Dialog;
//276