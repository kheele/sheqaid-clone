import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewSafetyObservationReportDialog from './dialogs/NewSafetyObservationReportDialog.js';
import ProfileSafetyObservationReportDialog from './dialogs/ProfileSafetyObservationReportDialog';
//import EditBaselineRiskAssessmentDialog from './dialogs/EditBaselineRiskAssessmentDialog';
import style from "./SafetyObservationReportTab.lazy.css";

@observer
class SafetyObservationReportTab extends React.Component {
    path;
    pageKey = "SafetyObservationReportTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'safety-observations-report/';

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
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
        const {hasProjects} = storage.is;
        return <div className="col-lg-12 controls multiline-controls absolute-btns">
            <ClearableInput name="observation_type" type="text" placeholder="Observation Type" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="location" type="text" placeholder="Location of Observation" className="col-lg-4 form-control" onChange={onChange}/>
            {hasProjects && <ClearableInput name="site" type="text" placeholder="Site" className="col-lg-4 form-control" onChange={onChange}/>}
            <ClearableInput name="observed_team_member" type="text" placeholder="Observed Team Member" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="created_at" type="date" placeholder="Date..." className="col-lg-4 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {hasProjects} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-140">Date Created</div>
            <div className="td">Observation Type</div>
            <div className="td">Location of Observation</div>
            {hasProjects && <div className="td">Site</div>}
            <div className="td">Observed Team Member</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, observation_type, location, site, observed_team_member}} = item;
        const {hasProjects} = storage.is;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-140">{Dates.formatDateTime(created_at)}</div>
            <div className="td">{observation_type}</div>
            <div className="td">{location}</div>
            {hasProjects && <div className="td">{site.name}</div>}
            <div className="td">{observed_team_member.fname + ' ' + observed_team_member.lname}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Safety Observations Report"
            pageTitleSingular="safety observation report"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewSafetyObservationReportDialog ref="newDialog"/>
            <ProfileSafetyObservationReportDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default SafetyObservationReportTab;
