import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    Button,
    ClearableInput,
    DateRangeInput,
    SelectEmployeeInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import RemedialActionPlanDialog from "./dialogs/RemedialActionPlanDialog.js";
import CauseAnalysisDialog from "./dialogs/CauseAnalysisDialog.js";
import NewIncidentDialog from './dialogs/NewIncidentDialog.js';
import ProfileIncidentDialog from './dialogs/ProfileIncidentDialog.js';

import style from "./IncidentsTab.lazy.css";

@observer
class IncidentsTab extends React.Component {
    path;
    pageKey = "IncidentsTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'incidents/';
        
        this.onVewRemedialActionPlan = this.onVewRemedialActionPlan.bind(this);
        this.onVewCauseAnalysis = this.onVewCauseAnalysis.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onVewRemedialActionPlan() {
        this.refs.remedialActionPlanDialog.open();
    }

    onVewCauseAnalysis() {
        this.refs.causeAnalysisDialog.open();
    }

    renderLeftButtons() {
        return <div className="left-buttons pull-left">
            <Button key="buttonRemedialActionPlan" className="btn btn-primary pull-right _888 min-w-180" onClick={this.onVewRemedialActionPlan}>
                <i key="buttonRemedialActionPlanIcon" className="fa fa-clipboard-list icon-left"/>Remedial Action Plan
            </Button>
            <Button key="buttonCauseAnalysis" className="btn btn-primary pull-right _888 min-w-140" onClick={this.onVewCauseAnalysis}>
                <i key="buttonCauseAnalysisIcon" className="fa fa-clipboard-list icon-left"/>Cause Analysis
            </Button>
        </div>;
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
            <DateRangeInput name="she_incident_date_range" className="col-lg-6 hor-center form-control" placeholder="Date of Incident" placeholderWidthClass="min-w-135" onChange={onChange}/>
            <ClearableInput name="she_department" type="text" placeholder="Department" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="investigator_of_incident" type="text" placeholder="Incident Investigator" className="col-lg-4 form-control" onChange={onChange}/>
            <SelectEmployeeInput name="she_person_injured" placeholder="Who Was Injured..." className="col-lg-4 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-150">Date of Incident</div>
            <div className="td">Department</div>
            <div className="td">Incident Investigator</div>
            <div className="td">Who Was Injured</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, she_incident_date, she_department, investigator_of_incident, she_person_injured}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-150">{Dates.formatDate(she_incident_date)}</div>
            <div className="td">{she_department}</div>
            <div className="td">{investigator_of_incident}</div>
            <div className="td">{she_person_injured.fname + ' ' + she_person_injured.lname}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        const {permissionKey} = this.props;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Incidents"
            pageTitleSingular="incident"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewIncidentDialog ref="newDialog"/>
            <ProfileIncidentDialog ref="profileDialog"/>
            <RemedialActionPlanDialog ref="remedialActionPlanDialog" path={this.path} permissionKey={permissionKey}/>
            <CauseAnalysisDialog ref="causeAnalysisDialog" path={this.path} permissionKey={permissionKey}/>
        </APageListReadWrite>;
    }
}

export default IncidentsTab;
