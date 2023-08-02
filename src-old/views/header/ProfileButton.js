import React from "react";
import {observer} from 'mobx-react';

import {Button, ProfilePic} from '../../components/inputs';
import Popover from '../../components/popovers/Popover';

import {calculateRightPos} from '../../utils/Utils';

import ProfileAdminUserDialog from '../admin/AdminUsers/ProfileDialog';
import ProfileUserDialog from '../default/Users/ProfileDialog';
import ProfileEmployeeDialog from '../../views/plugins/plugin_hr_management/Employees/ProfileDialog';

import EditAdminUserDialog from '../admin/AdminUsers/EditDialog';
import EditUserDialog from '../default/Users/EditDialog';
import NewEmployeeDialog from '../../views/plugins/plugin_hr_management/Employees/NewDialog';

@observer
class ProfileButton extends React.Component {

    constructor() {
        super();

        this.onUploaded = this.onUploaded.bind(this);
        this.onLogoutContractor = this.onLogoutContractor.bind(this);
    }
    
    onUploaded(path) {
        const {user} = storage.loggedUser;
        user.data.profile_pic = path;
        storage.update.updateDBUser(storage.loggedUser);
    }
    
    onLogoutContractor() {
        storage.logout.logoutContractor();
    }
    
    render() {
        if(isAdminApp) {
            return <ProfileAvatar onRef={() => this.refs}>
                <ProfileAdminUserDialog ref="profileUserDialog" EditDialog={EditAdminUserDialog}/>
            </ProfileAvatar>;
        }
        const {isContractorViewVisited} = storage.is;
        if(isContractorViewVisited) {
            return <div className="avatar contractor" onClick={this.onLogoutContractor}>
                <hr />
                <i className="fa fa-close" />
            </div>;
        }
        
        return <ProfileAvatar onRef={() => this.refs}>
            <ProfileUserDialog ref="profileUserDialog" EditDialog={EditUserDialog} NewEmployeeDialog={NewEmployeeDialog}/>
            <ProfileEmployeeDialog ref="profileEmployeeDialog"/>
        </ProfileAvatar>;
    }
}

@observer
class ProfileAvatar extends React.Component {

    constructor() {
        super();

        this.onViewUserProfile = this.onViewUserProfile.bind(this);
        this.onPopoverProfile = this.onPopoverProfile.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }
    
    onViewUserProfile() {
        const {onRef} = this.props;
        
        const refs = onRef && onRef();
        if(!refs) return;
        
        const {user} = storage.loggedUser;
        if(isAdminApp) {
            refs.profileUserDialog.open(user);
        } else {
            const {isEmployee, isUser, isContractor} = storage.is;
            if(isEmployee) {
                refs.profileEmployeeDialog.open(user);
            } else if(isUser || isContractor) {
                refs.profileUserDialog.open(user);
            }
        }
    }
    
    onPopoverProfile(e) {
        const {isEmployee, isUser, isContractor, isContractorViewVisited} = storage.is;
        let path, name, email;
        if(isAdminApp) {
            path =  'admin/users/update/upload/profile-pic/user';
        } else {
            if(isEmployee) {
                path =  'plugin_sheq_assist/employees/upload/profile-pic';
            } else if(isUser) {
                path =  'users/update/upload/profile-pic/user';
            } else if(isContractor) {
                path = "plugin_sheq_assist/contractors/upload/profile-pic";
            } else {
                return;
            }
        }
        
        const {user: {id, data, data: {profile_pic}}} = storage.loggedUser;
        if(isAdminApp) {
            name = `${data.fname} ${data.lname}`;
            email = data.username;
        } else {
            name = `${data.fname} ${data.lname}`;
            email = data.username || data.email;
        }
        
        this.refs.popover.settings({
            style: {left: "auto", right: calculateRightPos(this.refs.profile), top: 60, width: 350},
            contentNode: <div key="profile" className="popover-account-options">
                <ProfilePic path={path} profilePic={profile_pic} id={id} onUploaded={this.onUploaded} className="margin-t-5">
                    <h2 className="fixed-center margin-0">{name.charAt(0).toUpperCase()}</h2>
                </ProfilePic>
                <p className="text-center margin-t-10 margin-b-5">
                    <b>{name}</b><br />
                    {email}
                </p>
                {!isContractorViewVisited && <hr />}
                {!isContractorViewVisited && <Button module="Profile" onClick={this.onViewUserProfile} className="btn btn-action hor-center w-260  margin-b-15 border-radius-20 no-background" text="View My Account"/>}
                {!isContractorViewVisited && <Button module="Profile" onClick={defaultView.onOpenPage} className="btn btn-action hor-center w-260 border-radius-20 no-background" text="View Company Account"/>}
                <hr />
                <Button onClick={this.onLogout} faIconLeft="power-off" className="btn hor-center w-260 border-radius-20 margin-b-10" text="Sign Out"/>
            </div>
        }).open();
    }
    
    onLogout(e, elem) {
        storage.logout.signOutAndConfirm();
    }
    
    render() {
        const {children} = this.props;
        
        const {user: {data, data: {profile_pic}}} = storage.loggedUser;
        
        return <div ref="profile" className="avatar" onClick={this.onPopoverProfile}>
            <hr />
            <ProfilePic readonly profilePic={profile_pic} className="x50">
                <h2 className="fixed-center margin-0">{data.lname.charAt(0).toUpperCase()}</h2>
            </ProfilePic>
            {children}
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}
export default ProfileButton;
