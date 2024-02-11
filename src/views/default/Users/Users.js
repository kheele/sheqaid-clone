import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {calculateRightPos, execWhen, Permissions} from 'utils/Utils';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, ClearableInput, Clickable} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewEmployeeDialog from 'views/plugins/plugin_hr_management/Employees/forms/NewDialog.js';
import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Users.lazy.css";

import listAllUserByLogged from "./Query/List/listAllUserByLogged";
import listAllContractorUserByLogged from "./Query/List/listAllContractorUserByLogged";
import MKBox from "components/MK/MKBox";

@observer
class Users extends React.Component {
    static key = 'Users';

    pageKey = "Users";
    @observable
    state = {};

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.path = storage.is.isContractor ? 'plugin_sheq_assist/contractors/users/' : 'users/';

        this.onSendApplicationLink = this.onSendApplicationLink.bind(this);
        this.onCompleteEmploymentDetailsShowWarningMsg = this.onCompleteEmploymentDetailsShowWarningMsg.bind(this);
        this.onCreateCompleteUser = this.onCreateCompleteUser.bind(this);

        this.hasCreateBtn = this.hasCreateBtn.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }
    //</editor-fold>

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {isContractor} = storage.is;
        // const {list} = this.props;
        // if(list) {
        //     return this.findByIdsEmployees(list.map(({id}) => id));
        // }

        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        const limit = 50;

        const args = {
            // removed: this.removed,
            removed: false,
            //
            name,
            //
            limit,
            //
            exact_orgs: false,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        const byLogged = isContractor ? listAllContractorUserByLogged : listAllUserByLogged;

        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    //<editor-fold desc="onCompleteEmploymentDetailsShowWarningMsg">
    onCompleteEmploymentDetailsShowWarningMsg({target}, elem) {
        let {idx} = elem.props;
        if (this.openIdx === idx) return;

        const item = this.refs.root.list[idx];
        const {id, data: {fname, lname, linked_employee}} = item;
        const offset = $(target).offset();
        const style = {left: "auto", right: calculateRightPos(target, false) + 10, top: offset.top, width: 340};
        this.refs.root.refs.popover.settings({
            style,
            isDialog: false,
            contentNode: <div>
                <MKBox
                  className="nav-item font-size-12 padding-10 margin-b-10 margin-h-0 text-center"
                  sx={{
                      borderRadius: '3px',
                      boxShadow: '0 0 3px #ddd',
                      background: '#f5f5f5',
                      textTransform: 'uppercase',
                  }}
                >
                    Please complete the following actions:
                </MKBox>
                <hr/>
                {!linked_employee &&
                    <NavItem idx={idx} onClick={this.onCreateCompleteUser} title="Link To Employee Details"/>}
            </div>
        }).open();
    }

    //</editor-fold>

    onCreateCompleteUser(evt, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        if(!item) return;

        const {root} = this.refs;
        const dialog = root.getDialogByRef("profileDialog");
        dialog && dialog.extraProp('linked_employee', true).open(item).then(() => {

        });
    }

    //<editor-fold desc="onSendApplicationLink">
    onSendApplicationLink(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        const {id, data: {username}} = item;
        
        const {isContractor} = storage.is;
        
        if (username) {
            progressDialog.open("Please wait...");
            const sendAppLink = sockets.of("send").fn("sendAppLink");
            sendAppLink({id, access_type: isContractor ? "ContractorUser" : "User"}).then(res => {
                infoDialog.open("Link successfully sent.");
                infoDialog.close(2000);
            }).finally(() => {
                progressDialog.close();
            });
        } else {
            infoDialog.open(<>
                <p>The user does not have an username / email address.</p>
                <p>Please edit the user and add his/her username / email address.</p>
            </>);
        }
    }

    //</editor-fold>

    //<editor-fold desc="hasCreateBtn">
    hasCreateBtn() {
        const {isTrial} = storage.is;
        if (isTrial) {
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
    //</editor-fold>

    //<editor-fold desc="renderLeftButtons">
    renderLeftButtons() {
        const {isTrial, isConsultant} = storage.is;
        return <div className="left-buttons pull-left">
            {isConsultant && isTrial && <label className="max-warning min-w-130">
                Max. Of 3 Users Allowed
            </label>}
        </div>;
    }
    //</editor-fold>

    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Users";
        const {user} = storage.loggedUser;

        const item = this.refs.root.list[idx];
        const isLoggedUser = item.id === user.id;

        const allowView = () => {
            return isLoggedUser || Permissions.allowViewOther(permissionKey);
        };
        const allowEdit = () => {
            return isLoggedUser || Permissions.allowEditOther(permissionKey);
        };
        const allowRemove = () => {
            return !isLoggedUser && Permissions.allowRemoveOther(permissionKey);
        };

        return <Options idx={idx} permissionOtherKey={permissionKey}>
            {allowView() && <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>}
            {allowEdit() && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {allowRemove() && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSendApplicationLink} faIconLeft="paper-plane"
                     title="Send Application Link"/>
        </Options>;
    }
    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }
    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td">Name</div>
            <div className="td">Username</div>
            {hasProjects && <React.Fragment>
                {isConsultant && <div className="td">Company Name</div>}
                <div className="td">Project Name</div>
                <div className="td">{isContractor ? "Sites" : "Site Name"}</div>
            </React.Fragment>}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                fname, lname, username, phone, linked_employee, user_type,
                contractor, client, project, site,
            }
        } = item;
//        console.log('user', lname, client, project, site)

        const getSitesLength = (contractor = {}) => {
            const {site_list} = contractor || {};
            if (!site_list) return 'N/A';
            return site_list.length;
        };

        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Name</h6>
                {lname + ' ' + fname}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Username</h6>
                {username}
            </div>
            {hasProjects && <>
                {isConsultant && RenderUtils.renderOrgTD(client, null, 'Company Name')}
                {RenderUtils.renderOrgTD(project, null, 'Project Name')}
                {!isContractor && RenderUtils.renderOrgTD(site, null, 'Site Name')}
                {isContractor && <div className="td">
                    <h6 className="xs-shown font-size-13">Sites</h6>
                    {getSitesLength(contractor)}
                </div>}
            </>}

            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                {!linked_employee && !isContractor &&
                    <Clickable idx={n} onClick={this.onCompleteEmploymentDetailsShowWarningMsg}><i
                        className="fa fa-warning"/></Clickable>}
            </div>
        </TRow>;
    }
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        return <APageListReadWrite
            ref="root"
            page={this}
            hasCreateBtn={this.hasCreateBtn}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Users"
            pageTitleSingular="user"
            onLoadList={this.onLoadList}
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
    //</editor-fold>
}

export default Users;//313, 237
