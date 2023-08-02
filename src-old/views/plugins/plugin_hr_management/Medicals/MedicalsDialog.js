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

import NewMedicalFitnessCertificateDialog from './NewMedicalFitnessCertificateDialog';
import EditMedicalFitnessCertificateDialog from './EditMedicalFitnessCertificateDialog';
import ProfileMedicalFitnessCertificateDialog from "./ProfileMedicalFitnessCertificateDialog";
import AEmployeeDocDialog from '../AEmployeeDocDialog';

import MedicalsRenderRow from "./MedicalsRenderRow";

import style from "./MedicalsDialog.lazy.css";

// </editor-fold>

@observer
class MedicalsDialog extends AEmployeeDocDialog {
    path = "plugin_sheq_assist/employees/medicals/";
    pageKey = "MedicalsDialog";
    title = "Medicals";
    titleSingular = "Medical Certificate";
    permissionKey = "Medicals";

    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            annexture_3: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
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
        return <div className="col-lg-12 controls flex">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?" className="form-control" onChange={onChange} values={this.selfState.lists.annexture_3} returnValue/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Medicals</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <MedicalsRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            listCountTopTitle="medical"
            pageTitleSingular="medical"
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
            
            <NewMedicalFitnessCertificateDialog ref="newDialog" path={this.path}/>
            <ProfileMedicalFitnessCertificateDialog ref="profileDialog" path={this.path}/>
            <EditMedicalFitnessCertificateDialog ref="editDialog" path={this.path}/>
            
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default MedicalsDialog;
