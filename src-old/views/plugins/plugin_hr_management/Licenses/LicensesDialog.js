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

import NewLicenseDialog from './NewLicenseDialog';
import EditLicenseDialog from './EditLicenseDialog';
import ProfileLicenseDialog from "./ProfileLicenseDialog";
import AEmployeeDocDialog from '../AEmployeeDocDialog';

import LicensesRenderRow from "./LicensesRenderRow";

import style from "./LicensesDialog.lazy.css";

// </editor-fold>

@observer
class LicensesDialog extends AEmployeeDocDialog {
    path = "plugin_sheq_assist/employees/licenses/";
    pageKey = "LicensesDialog";
    title = "Licenses";
    titleSingular = "License";
    permissionKey = "Licenses";

    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
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
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Licenses</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <LicensesRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            listCountTopTitle="license"
            pageTitleSingular="license"
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
            
            <NewLicenseDialog ref="newDialog" path={this.path}/>
            <ProfileLicenseDialog ref="profileDialog" path={this.path}/>
            <EditLicenseDialog ref="editDialog" path={this.path}/>
            
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default LicensesDialog;
