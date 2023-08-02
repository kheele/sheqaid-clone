import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {calculateRightPos, execWhen, Permissions} from 'utils/Utils';
import APageListReadWrite from "../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, ClearableInput, Clickable} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewEmployeeDialog from 'views/plugins/plugin_hr_management/Employees/forms/NewDialog.js';
import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";

@observer
class Users extends React.Component {
    static key = 'Users';

    pageKey = "Users";
    @observable
    state = {
    };

    constructor(props) {
        super(props);

        this.path = storage.is.isContractor ? 'plugin_sheq_assist/contractors/users/' : 'users/';
        
	this.onSendApplicationLink = this.onSendApplicationLink.bind(this);
        this.onCompleteEmploymentDetailsShowWarningMsg = this.onCompleteEmploymentDetailsShowWarningMsg.bind(this);
        
        this.hasCreateBtn = this.hasCreateBtn.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onCompleteEmploymentDetailsShowWarningMsg({target}, elem) {
        let {idx} = elem.props;
        if(this.openIdx === idx) return;
        
        const item = this.refs.root.list[idx];
        const {id, data: {fname, lname, linked_employee_id}} = item;
        const offset = $(target).offset();
        const style = {left: "auto", right: calculateRightPos(target, false) + 10, top: offset.top, width: 340};
        this.refs.root.refs.popover.settings({
            style, 
            isDialog: false,
            contentNode: <div>
                <p className="nav-item padding-0">
                    <b>{fname + " " + lname}</b> details are incomplete.<br/>
                    <small className="hor-center text-center">
                        .......................................<br/>
                        Please do the following actions for this user.<br/>
                        Note: These actions are required.
                    </small>
                </p>
                <hr/>
                {!linked_employee_id && <NavItem idx={idx} onClick={this.refs.root.onView} title="Link To Employee Details"/>}
            </div>
        }).open();
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
    
    hasCreateBtn() {
        const {isTrial} = storage.is;
        if(isTrial) {
            return execWhen(() => this.refs.root).then(root => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(root.list.length < 3);
                    }, 100);
                });
            });
        } else {
            return true;
        }
    }
	
    renderLeftButtons() {
        const {isTrial, isConsultant} = storage.is;
	return <div className="left-buttons pull-left">
            {isConsultant && isTrial && <label className="max-warning min-w-130">
                Max. Of 3 Users Allowed
            </label>}
	</div>;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Users";
        const {user} = storage.loggedUser;
        const {permissions_other} = user.data;
        const permissions_other_Users = (permissions_other || []).find(v => v.key === permissionKey);
        
        const item = this.refs.root.list[idx];
        const isLoggedUser = item.id === user.id;
        
        const allowView = () => {
            return isLoggedUser || Permissions.allowView(permissions_other_Users);
        };
        const allowEdit = () => {
            return isLoggedUser || Permissions.allowEdit(permissions_other_Users);
        };
        const allowRemove = () => {
            return !isLoggedUser && Permissions.allowRemove(permissions_other_Users);
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
            <div className="td">Company Name</div>
            <div className="td">Project Name</div>
            <div className="td">Site Name</div>
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
            
            {RenderUtils.renderOrgTD(client, null, 'Company Name')}
            {RenderUtils.renderOrgTD(project, null, 'Project Name')}
            {RenderUtils.renderOrgTD(site, null, 'Site Name')}
            
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                {!linked_employee_id && <Clickable idx={n} onClick={this.onCompleteEmploymentDetailsShowWarningMsg}><i className="fa fa-warning"/></Clickable>}
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasCreateBtn={this.hasCreateBtn}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Users"
            pageTitleSingular="user"
            path={this.path}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog" EditDialog={EditDialog} NewEmployeeDialog={NewEmployeeDialog}/>
            <EditDialog ref="editDialog"/>            
        </APageListReadWrite>;
    }
}

export default Users;//313, 237
