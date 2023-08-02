import React from "react";
import {observer} from 'mobx-react';

import style from "./CauseAnalysisDialog.lazy.css";

import {Dates} from "../../../../../utils/Utils";
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from '../../../../../components/navs/NavItem';
import {ConfirmDialog} from '../../../../../components/dialogs';
import {ActionsButton, ClearableInput} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import NewCauseAnalysisDialog from "./NewCauseAnalysisDialog";
import ProfileCauseAnalysisDialog from "./ProfileCauseAnalysisDialog";

@observer
class CauseAnalysisDialog extends ADialogList {
    path;
    pageKey = "CauseAnalysisDialog";
    title = "Cause Analysis";

    selfState = {
        lists: {
            general_agents: ['Struck By', 'Struck Against', 'Fall', 'Falling Object', 'Handling', 'Machine', 'Transport', 'Electricity'],
            occupational_health_or_environmental_agents: ['Chemical', 'Fumes', 'Fire', 'Gas', 'Dust', 'Noise', 'Vapour', 'Temperature']
        }
    };
    
    constructor(props) {
        super(props);

        this.path = props.path + 'cause-analysis/';
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
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="general_agents" type="select" placeholder="General Agent" className="form-control" onChange={onChange} values={this.selfState.lists.general_agents} returnValue/>
            <ClearableInput name="occupational_health_or_environmental_agents" type="select" placeholder="Occupational Health / Environmental Agent" className="fixed-flex min-w-410 form-control" onChange={onChange} values={this.selfState.lists.occupational_health_or_environmental_agents} returnValue/>
            <div className="fixed-flex min-w-495 form-control grouped-control">
                <label className="fixed-flex min-w-200">Replacement / Repair Cost</label>
                <ClearableInput name="total_cost_from" type="number" placeholder="From" className="fixed-flex min-w-140 form-control" onChange={onChange}/>
                <hr className="fixed-flex min-w-10"/>
                <ClearableInput name="total_cost_to" type="number" placeholder="To" className="fixed-flex min-w-140 form-control" onChange={onChange}/>
            </div>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">General Agent(s)</div>
            <div className="td">Occupational Health / Environmental Agent(s)</div>
            <div className="td fixed-flex min-w-250">Total Replacement / Repair Cost</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, general_agents, occupational_health_or_environmental_agents, she_incident_cost_list}} = item;
        const cost = she_incident_cost_list.map(v => parseInt(v.cost)).reduce((n1, n2) => n1 + n2);
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{general_agents ? general_agents.join(', ') : 'N/A'}</div>
            <div className="td">{occupational_health_or_environmental_agents ? occupational_health_or_environmental_agents.join(', ') : 'N/A'}</div>
            <div className="td fixed-flex min-w-250 text-right padding-r-5">R {cost}</div>
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
            listCountTopTitle="cause analysis"
            pageTitleSingular="cause analysis"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewCauseAnalysisDialog ref="newDialog"/>
            <ProfileCauseAnalysisDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

}

export default CauseAnalysisDialog;
