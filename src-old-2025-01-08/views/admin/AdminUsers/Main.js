import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Permissions} from 'utils/Utils';
import APageListReadWrite from "../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";

@observer
class Users extends React.Component {
    static key = 'Users';

    pageKey = "Users";
    path = 'admin/users/';
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
	this.onSendApplicationLink = this.onSendApplicationLink.bind(this);
        
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
    
    onSendApplicationLink(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        const {id, data: {username}} = item;
        if(username) {
            progressDialog.open("Please wait...");
            neonBinding.events.emit(this.path + "send-app-link", id).then(res => {
                infoDialog.open("Link successfully sent.");
                infoDialog.close(2000);
            }).finally(() => {
                progressDialog.close();
            });
        } else {
            infoDialog.open(<React.Fragment>
                <p>The user does not have an username / email address.</p>
                <p>Please edit the user and add his/her username / email address.</p>
            </React.Fragment>);
        }
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Users";
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_modules_Users = (permissions_modules || []).find(v => v.key === permissionKey);
        
        const item = this.refs.root.list[idx];
        const isLoggedUser = item.id === user.id;
        
        const allowView = () => {
            return isLoggedUser || Permissions.allowView(permissions_modules_Users);
        };
        const allowEdit = () => {
            return isLoggedUser || Permissions.allowEdit(permissions_modules_Users);
        };
        const allowRemove = () => {
            return !isLoggedUser && Permissions.allowRemove(permissions_modules_Users);
        };
        
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            {allowView() && <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>}
            {allowEdit() && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {allowRemove() && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSendApplicationLink} faIconLeft="paper-plane" title="Send Application Link"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Name</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {old_id, new_id, fname, lname, username, phone, linked_employee_id, user_type, client, project, site, client_id, project_id, site_id}} = item;
        console.log('user', lname, client, project, site, client_id, project_id, site_id)
        return <TRow key={id}>
            <div className="td">
                <h6 className="xs-shown font-size-13">Name</h6>
                {lname + ' ' + fname}
            </div>
            
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
             </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasCreateBtn={() => true}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Users"
            pageTitleSingular="user"
            path={this.path}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog" EditDialog={EditDialog}/>
            <EditDialog ref="editDialog"/>            
        </APageListReadWrite>;
    }
}

export default Users;//313, 237
