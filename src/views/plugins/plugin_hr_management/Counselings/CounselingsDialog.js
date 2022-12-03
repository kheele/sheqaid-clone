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

import NewCounselingDialog from './NewCounselingDialog';
import EditCounselingDialog from './EditCounselingDialog';
import ProfileCounselingDialog from "./ProfileCounselingDialog";
import AEmployeeDocDialog from '../AEmployeeDocDialog';

import CounselingsRenderRow from "./CounselingsRenderRow";

import style from "./CounselingsDialog.lazy.css";
import SignatureDialog from "../../../../components/dialogs/SignatureDialog";

// </editor-fold>

@observer
class CounselingsDialog extends AEmployeeDocDialog {
    path = "plugin_sheq_assist/employees/counselling/";
    pageKey = "CounselingsDialog";
    title = "Counselings";
    titleSingular = "Counseling";
    permissionKey = "Counseling";
    
    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
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
	    expiry_date: [{label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
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
        return <div className="col-lg-12 controls">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="col-lg-6 form-control" onChange={onChange}/>
            <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." className="col-lg-6 form-control" onChange={onChange}/>
            <ClearableInput name="types" type="select_multi" placeholder="Counseling Types..." className="col-lg-4 margin-t-10 form-control" onChange={onChange} values={this.selfState.lists.types} returnValue add/>
            <ClearableInput name="reasons" type="select_multi" placeholder="Reasons For Counseling..." className="col-lg-4 margin-t-10 form-control" onChange={onChange} values={this.selfState.lists.reasons} returnValue add/>
            <ClearableInput name="expiry_date" type="select" placeholder="Completion Date..." className="col-lg-4 margin-t-10 form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Counselings</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <CounselingsRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            listCountTopTitle="counseling"
            pageTitleSingular="counseling"
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
            
            <NewCounselingDialog ref="newDialog" path={this.path} onSetSignatureSettings={this.onSignatures}/>
            <ProfileCounselingDialog ref="profileDialog" path={this.path}/>
            <EditCounselingDialog ref="editDialog" path={this.path}/>

            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="Counseling"/>
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default CounselingsDialog;
