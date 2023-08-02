import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "../../../../../utils/Utils";
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from '../../../../../components/navs/NavItem';
import {ConfirmDialog} from '../../../../../components/dialogs';
import {ActionsButton, ClearableInput} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import NewRemedialActionPlanDialog from "./NewRemedialActionPlanDialog";
import ProfileRemedialActionPlanDialog from "./ProfileRemedialActionPlanDialog";

import style from "./RemedialActionPlanDialog.lazy.css";

@observer
class RemedialActionPlanDialog extends ADialogList {
    path;
    pageKey = "RemedialActionPlanDialog";
    title = "Remedial Action Plan";

    constructor(props) {
        super(props);

        this.path = props.path + 'remedial-action-plan/';
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
        return <div className="col-lg-12 controls multiline-controls">
            <ClearableInput name="person_involved_name" type="text" placeholder="Person Involved" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="she_department_name" type="text" placeholder="SHE Department" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="she_committee_chairperson_name" type="text" placeholder="SHE Committee Chairperson" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="management_name" type="text" placeholder="Management" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="incident_assessor_name" type="text" placeholder="Incident Assessor" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-4 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-110">Date</div>
            <div className="td">Person Involved</div>
            <div className="td">SHE Department</div>
            <div className="td min-w-250">SHE Committee Chairperson</div>
            <div className="td">Management</div>
            <div className="td">Incident Assessor</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, date, person_involved_name, she_department_name, she_committee_chairperson_name, management_name, incident_assessor_name}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
            <div className="td">{person_involved_name}</div>
            <div className="td">{she_department_name}</div>
            <div className="td min-w-250">{she_committee_chairperson_name}</div>
            <div className="td">{management_name}</div>
            <div className="td">{incident_assessor_name}</div>
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
            listCountTopTitle="remedial action plan"
            pageTitleSingular="remedial action plan"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewRemedialActionPlanDialog ref="newDialog"/>
            <ProfileRemedialActionPlanDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

}

export default RemedialActionPlanDialog;
