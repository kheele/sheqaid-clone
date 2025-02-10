import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./FlashReportsDialog.lazy.css";

import {Dates} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewFlashReportDialog from "./NewFlashReportDialog";
import ProfileFlashReportDialog from "./ProfileFlashReportDialog";

@observer
class FlashReportsDialog extends ADialogList {

    path = "plugin_sheq_assist/17_Incident_Investigation/flash-reports/";
    pageKey = "flash-reports";
    title = "Flash Reports";

    @observable
    selfState = {
        lists: {
            incident_type: ["Personal Inquiry", "Security", "Fire", "Environment", "Property Damage", "Vehicle", "Plant"]
        }
    };
    
    constructor(props) {
        super(props);
        
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name_of_injured_person" type="text" placeholder="Name Of Injured" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="occupation" type="text" placeholder="Occupation" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="employer" type="text" placeholder="Employer" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="incident_type" type="select" placeholder="Incident Type...." className="col-lg-3 form-control" onChange={onChange} values={this.selfState.lists.incident_type} returnValue/>
            <ClearableInput name="reported_by" type="text" placeholder="Reported By" className="col-lg-3 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Name Of Injured</div>
            <div className="td">Occupation</div>
            <div className="td">Employer</div>
            <div className="td">Incident Type</div>
            <div className="td">Reported By</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, name_of_injured_person, occupation, employer, incident_type, reported_by}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{name_of_injured_person}</div>
            <div className="td">{occupation}</div>
            <div className="td">{employer}</div>
            <div className="td">{incident_type}</div>
            <div className="td">{reported_by}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="flash report"
            pageTitleSingular="flash report"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewFlashReportDialog ref="newDialog"/>
            <ProfileFlashReportDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

}

export default FlashReportsDialog;
