import React from "react";
import {observer} from 'mobx-react';

import style from "./EmergencyNumbersTab.lazy.css";

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewEmergencyNumberInternalDialog from './dialogs/NewEmergencyNumberInternalDialog.js';
import NewEmergencyNumberExternalDialog from './dialogs/NewEmergencyNumberExternalDialog.js';
import EditEmergencyNumberInternalDialog from './dialogs/EditEmergencyNumberInternalDialog.js';
import EditEmergencyNumberExternalDialog from './dialogs/EditEmergencyNumberExternalDialog.js';
import ProfileEmergencyNumberInternalDialog from './dialogs/ProfileEmergencyNumberInternalDialog';
import ProfileEmergencyNumberExternalDialog from './dialogs/ProfileEmergencyNumberExternalDialog';

@observer
class EmergencyNumbersTab extends React.Component {
    path;
    pageKey = "EmergencyNumbersTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'emergency-numbers/';
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {permissionKey} = this.props;
        return <div id={this.pageKey + "-tab"} className={this.pageKey + "-tab page-content"}>
            <EmergencyNumbersInternal permissionKey={permissionKey} path={this.path}/>
            <EmergencyNumbersExternal permissionKey={permissionKey} path={this.path}/>
        </div>;
    }
}

@observer
class EmergencyNumbersInternal extends React.Component {
    path;
    pageKey = "EmergencyNumbersInternal";

    constructor(props) {
        super(props);

        this.path = props.path + "internal/";

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="designation" type="text" placeholder="Designation" className="form-control" onChange={onChange}/>
            <ClearableInput name="contacts" type="text" placeholder="Contact No." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Name</div>
            <div className="td">Designation</div>
            <div className="td">Contact No.</div>
            <div className="td fixed-flex min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, name, designation, contacts}} = item;
        return <TRow key={"item-" + n}>
            <div className="td">{name}</div>
            <div className="td">{designation}</div>
            <div className="td">{contacts}</div>
            <div className="td fixed-flex min-w-50">
                <Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        //const {cost, completed_trainings, outstanding_trainings, accredited_trainings, non_accredited_trainings} = this.state.counts;
        return <div className="EmergencyNumbersInternal">
            <h4>Internal Emergency Numbers</h4>
            <div>
                <APageListReadWrite 
                    hasBackBtn={false}
                    ref="root"
                    page={this}
                    createBtnTitle="Create"
                    pageId={this.pageKey}
                    pageTitle="Internal Emergency Numbers"
                    pageTitleSingular="internal emergency number"
                    path={this.path}
                    noAnimation={true}
                    renderPopoverOptions={this.renderPopoverOptions}
                    renderFilterNode={this.renderFilterNode}
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}>
                    <ConfirmDialog ref="removeDialog"/>
                    
                    <NewEmergencyNumberInternalDialog ref="newDialog"/>
                    <EditEmergencyNumberInternalDialog ref="editDialog"/>
                    <ProfileEmergencyNumberInternalDialog ref="profileDialog"/>
                </APageListReadWrite>
            </div>
        </div>;
    }
}

@observer
class EmergencyNumbersExternal extends React.Component {
    path;
    pageKey = "EmergencyNumbersExternal";

    constructor(props) {
        super(props);

        this.path = props.path + "external/";

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="org_name" type="text" placeholder="Organization" className="form-control" onChange={onChange}/>
            <ClearableInput name="area" type="text" placeholder="Area" className="form-control" onChange={onChange}/>
            <ClearableInput name="contacts" type="text" placeholder="Contact No." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Organization</div>
            <div className="td">Area</div>
            <div className="td">Contact No.</div>
            <div className="td fixed-flex min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, org_name, area, contacts}} = item;
        return <TRow key={"item-" + n}>
            <div className="td">{org_name}</div>
            <div className="td">{area}</div>
            <div className="td">{contacts}</div>
            <div className="td fixed-flex min-w-50">
                <Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        //const {cost, completed_trainings, outstanding_trainings, accredited_trainings, non_accredited_trainings} = this.state.counts;
        return <div className="EmergencyNumbersExternal">
            <h4>External Emergency Numbers</h4>
            <div>
                <APageListReadWrite 
                    hasBackBtn={false}
                    ref="root"
                    page={this}
                    createBtnTitle="Create"
                    pageId={this.pageKey}
                    pageTitle="External Emergency Numbers"
                    pageTitleSingular="external emergency number"
                    path={this.path}
                    noAnimation={true}
                    renderPopoverOptions={this.renderPopoverOptions}
                    renderFilterNode={this.renderFilterNode}
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}>
                    <ConfirmDialog ref="removeDialog"/>
                    
                    <NewEmergencyNumberExternalDialog ref="newDialog"/>
                    <EditEmergencyNumberExternalDialog ref="editDialog"/>
                    <ProfileEmergencyNumberExternalDialog ref="profileDialog"/>
                </APageListReadWrite>
            </div>
        </div>;
    }
}

export default EmergencyNumbersTab;
