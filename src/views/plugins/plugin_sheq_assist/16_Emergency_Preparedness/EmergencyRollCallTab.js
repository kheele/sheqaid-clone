import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "../../../../utils/Utils";

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewEmergencyRollCallRegisterDialog from './dialogs/NewEmergencyRollCallRegisterDialog.js';
import ProfileEmergencyRollCallRegisterDialog from './dialogs/ProfileEmergencyRollCallRegisterDialog.js';

import style from "./EmergencyRollCallTab.lazy.css";

@observer
class EmergencyRollCallTab extends React.Component {
    path;
    pageKey = "EmergencyRollCallTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'emergency-roll-call/';

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
        return <div className="col-lg-12 controls">
            <ClearableInput name="department" type="text" placeholder="Department" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="division" type="text" placeholder="Division" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="location" type="text" placeholder="Location" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="floor" type="text" placeholder="Floor" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="floor_warden_name" type="text" placeholder="Fire/Warden Name" className="col-lg-3 form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-3 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Date</div>
            <div className="td">Department</div>
            <div className="td">Division</div>
            <div className="td">Location</div>
            <div className="td">Floor</div>
            <div className="td fixed-flex td-floor_warden_name">Fire/Warden Name</div>
            <div className="td fixed-flex td-attendance_register">Attendance List</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, date, department, division, location, floor, floor_warden_name, emergency_roll_call_register_list}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(date)}</div>
            <div className="td">{department.name}</div>
            <div className="td">{division}</div>
            <div className="td">{location}</div>
            <div className="td">{floor}</div>
            <div className="td fixed-flex td-floor_warden_name">{floor_warden_name}</div>
            <div className="td fixed-flex td-attendance_register">{emergency_roll_call_register_list.length}</div>
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
            pageTitle="Emergency Roll Call Register"
            pageTitleSingular="emergency roll call register"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewEmergencyRollCallRegisterDialog ref="newDialog"/>
            <ProfileEmergencyRollCallRegisterDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default EmergencyRollCallTab;
