// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {renderLeftButtonsForExpiryOnly} from 'utils/ComponentUtils';
import APageListReadWrite from "../../../APageListReadWrite";
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    ClearableInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTrainingCourseInput
} from 'components/inputs';
import {THead} from 'components/tables';

import ExportDialog from './ExportDialog.js';

import NewCompetencyCertificateDialog from './firestore_forms/NewCompetencyCertificateDialog';
import EditCompetencyCertificateDialog from './firestore_forms/EditCompetencyCertificateDialog';
import ProfileCompetencyCertificateDialog from "./firestore_forms/ProfileCompetencyCertificateDialog";

import CompetenciesRenderRow from "./CompetenciesRenderRow";

import AEmployeeDocDialog from '../AEmployeeDocDialog';

import style from "./CompetenciesDialog.lazy.css";

// </editor-fold>

@observer
class CompetenciesDialog extends AEmployeeDocDialog {
    path = 'plugin_sheq_assist/employees/competencies/';
    pageKey = "CompetenciesDialog";
    title = "Competencies";
    titleSingular = "Competency";
    permissionKey = "Competencies";
    
    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            type: [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}],
            competency_type: [{label: 'Behavioural', value: 'Behavioural'}, {label: 'Technical / Functional', value: 'Technical / Functional'}, {label: 'Leadership', value: 'Leadership'}],
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
            <ClearableInput name="type" type="radio" className="form-control" onChange={onChange} values={this.selfState.lists.type} returnValue/>
            <ClearableInput name="competency_type" type="select" placeholder="Competency Type..." className="form-control" onChange={onChange} values={this.selfState.lists.competency_type} returnValue/>
            <SelectTrainingCourseInput name="course_or_module" placeholder="Course..." className="form-control" onChange={onChange} add={false}/>
            <SelectJobPositionInput name="job_title" placeholder="Job Title..." className="form-control" onChange={onChange} add={false}/>
            <ClearableInput name="issued_date" type="date" placeholder="Date Of Issue..." className="form-control" onChange={onChange}/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Competency Certificates</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <CompetenciesRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            listCountTopTitle="competency"
            pageTitleSingular="competencies"
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
            
            <NewCompetencyCertificateDialog ref="newDialog" path={this.path}/>
            <ProfileCompetencyCertificateDialog ref="profileDialog" path={this.path}/>
            <EditCompetencyCertificateDialog ref="editDialog" path={this.path}/>
            
            <ExportDialog ref="exportDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default CompetenciesDialog;
