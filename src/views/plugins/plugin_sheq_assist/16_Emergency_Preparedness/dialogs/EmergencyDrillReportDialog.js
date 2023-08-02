import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./EmergencyDrillReportDialog.lazy.css";

import {Dates} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewEmergencyDrillReportDialog from "./NewEmergencyDrillReportDialog";
import ProfileEmergencyDrillReportDialog from "./ProfileEmergencyDrillReportDialog";

@observer
class EmergencyDrillReportDialog extends ADialogList {

    path;
    pageKey = "EmergencyDrillReportDialog";
    title = "Emergency Drill Reports";

    @observable
    selfState = {
        lists: {
            drill_type: [{text: 'Fire', value: 'Fire'}, {text: 'Fall Down', value: 'Fall Down'}, {text: 'Spillage', value: 'Spillage'}, {text: 'Gas Leakage', value: 'Gas Leakage'}]
        }
    };
    
    constructor(props) {
        super(props);
        
        this.path = props.path + "report/";

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

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="drill_date" type="drill_date" placeholder="Date..." className="fixed-flex min-w-280 form-control" onChange={onChange}/>
            <ClearableInput name="drill_type" type="radio" placeholder="Type" className="fixed-flex min-w-550 form-control" onChange={onChange} values={this.selfState.lists.drill_type}/>
            <ClearableInput name="shift" type="text" placeholder="Shift" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-160">Date</div>
            <div className="td fixed-flex min-w-120">Type</div>
            <div className="td">Shift</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {drill_date, drill_type, shift}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(drill_date)}</div>
            <div className="td fixed-flex min-w-120">{drill_type}</div>
            <div className="td">{shift}</div>
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
            listCountTopTitle="emergency drill report"
            pageTitleSingular="emergency drill report"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewEmergencyDrillReportDialog ref="newDialog"/>
            <ProfileEmergencyDrillReportDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

}

export default EmergencyDrillReportDialog;
