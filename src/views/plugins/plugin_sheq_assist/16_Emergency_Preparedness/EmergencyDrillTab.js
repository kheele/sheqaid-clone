import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "../../../../utils/Utils";

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewDialog from './dialogs/NewEmergencyDrillDialog.js';
import ProfileDialog from './dialogs/ProfileEmergencyDrillDialog.js';

import EmergencyDrillReportDialog from './dialogs/EmergencyDrillReportDialog.js';
import EmergencyDrillMatrixDialog from './dialogs/EmergencyDrillMatrixDialog.js';

import style from "./EmergencyDrillTab.lazy.css";

@observer
class EmergencyDrillTab extends React.Component {
    
    pageKey = "EmergencyDrillTab";
    path;
    
    constructor(props) {
        super(props);
        
        this.path = props.path + 'emergency-drill/drill/';

        this.onVewEmergencyDrillReport = this.onVewEmergencyDrillReport.bind(this);
        this.onVewEmergencyDrillMatrix = this.onVewEmergencyDrillMatrix.bind(this);
        
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onVewEmergencyDrillReport() {
        this.refs.emergencyDrillReportDialog.open(this.path);
    }

    onVewEmergencyDrillMatrix() {
        this.refs.emergencyDrillMatrixDialog.open(this.path);
    }

    renderLeftButtons() {
        const {isEmployee} = storage.is;
        if(isEmployee) return null;
        return <div className="left-buttons pull-left">
            <Button key="buttonEmergencyDrillReport" className="btn btn-primary pull-right _888 min-w-190" onClick={this.onVewEmergencyDrillReport}>
                <i key="buttonEmergencyDrillReportIcon" className="fa fa-clipboard-list icon-left"/>Emergency Drill Reports
            </Button>
            <Button key="buttonEmergencyDrillMatrix" className="btn btn-primary pull-right _888 min-w-180" onClick={this.onVewEmergencyDrillMatrix}>
                <i key="buttonEmergencyDrillMatrixIcon" className="fa fa-clipboard-list icon-left"/>Emergency Drill Matrix
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
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="date" type="date" placeholder="Date..." className="fixed-flex min-w-280 form-control" onChange={onChange}/>
            <ClearableInput name="area" type="text" placeholder="Area" className="form-control" onChange={onChange}/>
            <ClearableInput name="manager_or_supervisor" type="text" placeholder="Manager / Supervisor" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-160">Date</div>
            <div className="td">Area</div>
            <div className="td fixed-flex"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {date, area, manager_or_supervisor, team_member_list}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(date)}</div>
            <div className="td">{area}</div>
            <div className="td fixed-flex">
                <Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite  
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Emergency Drill"
            pageTitleSingular="emergency drill"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog"/>
            
            <EmergencyDrillReportDialog ref="emergencyDrillReportDialog" path={this.props.path + 'emergency-drill/'}/>
            <EmergencyDrillMatrixDialog ref="emergencyDrillMatrixDialog" path={this.props.path + 'emergency-drill/'}/>
        </APageListReadWrite>;
    }
}

export default EmergencyDrillTab;
