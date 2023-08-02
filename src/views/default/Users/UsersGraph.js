//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {calculateRightPos, Dates, execWhen, Permissions} from 'utils/Utils';

import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ClearableInput, Clickable} from 'components/inputs';
import ActionsButton from 'components/Omni/ActionsButton';

import NewEmployeeDialog from 'views/plugins/plugin_hr_management/Employees/forms/NewDialog.js';
import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Users.lazy.css";
import PageListWritable from "page-templates/PageListWritable";
import listAllUser from "mutations/all/User/listAllUser";
import {listAllUserByQuery} from "./queries/listAllUserBy";
import listAllUserByLoggedSite from "mutations/all/User/listAllUserByLoggedSite";
import listAllUserByLoggedProject from "mutations/all/User/listAllUserByLoggedProject";
import listAllUserByLoggedClient from "mutations/all/User/listAllUserByLoggedClient";
import listAllContractorUserByLoggedSite from "mutations/all/ContractorUser/listAllContractorUserByLoggedSite";
import listAllContractorUserByLoggedContractor
    from "mutations/all/ContractorUser/listAllContractorUserByLoggedContractor";
//</editor-fold>

@observer
class Users extends React.Component {
    static key = 'Users';

    pageKey = "Users";
    @observable
    state = {
        page_size: 30,
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.path = storage.is.isContractor ? 'plugin_sheq_assist/contractors/users/' : 'users/';

        this.onSendApplicationLink = this.onSendApplicationLink.bind(this);
        this.onCompleteEmploymentDetailsShowWarningMsg = this.onCompleteEmploymentDetailsShowWarningMsg.bind(this);

        this.hasCreateBtn = this.hasCreateBtn.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);

        this.actions = this.actions.bind(this);
    }
    //</editor-fold>

    //<editor-fold desc="componentWillMount">
    componentWillMount() {
        style.use();
    }
    //</editor-fold>

    //<editor-fold desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }
    //</editor-fold>

    //<editor-fold desc="loader">
    @computed loader() {
        const {page_size} = this.state;
        const {isConsultant, isHasProjects} = storage.is;
        const {isLoggedClient, isLoggedProject, isLoggedSite, isContractor, isContractorViewVisited} = storage.is;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {selectedContractorSite} = storage.selected;

        let rows;

        if(isContractor) {
            if(selectedContractorSite) {
                rows = listAllContractorUserByLoggedSite(page_size, selectedContractorSite.id);
            } else {
                rows = listAllContractorUserByLoggedContractor(page_size, );
            }
        } else if(isContractorViewVisited) {
            if(selectedContractorSite) {
                rows = listAllContractorUserByLoggedSite(page_size, selectedContractorSite.id);
            } else {
                rows = listAllContractorUserByLoggedContractor(page_size, );
            }
        } else if(isConsultant) {
            if(isLoggedSite) {
                rows = listAllUserByLoggedSite(page_size, selectedSite.id);
            } else if(isLoggedProject) {
                rows = listAllUserByLoggedProject(page_size, selectedProject.id);
            } else {//isLoggedClient
                rows = listAllUserByLoggedClient(page_size, selectedClient.id);
            }
        } else if(isHasProjects) {
            if(isLoggedSite) {
                rows = listAllUserByLoggedSite(page_size, selectedSite.id);
            } else if(isLoggedProject) {
                rows = listAllUserByLoggedProject(page_size, selectedProject.id);
            } else {
                // rows = listAllUserByLoggedCompany(page_size, selectedClient.id);
            }
        } else {
            // rows = listAllUserByLoggedCompany(page_size, selectedClient.id);
        }

        return {rows};
    }
    //</editor-fold>

    //<editor-fold desc="actions">
    actions(item) {
        const permissionKey = "Users";
        const {user} = storage.loggedUser;
        const {permissions_other} = user.data;
        const permissions_other_Users = (permissions_other || []).find(v => v.key === permissionKey);

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

        return [
            allowView() && {action: "view", title: "View"},
            allowEdit() && {action: "edit", title: "Edit"},
            allowRemove() && {action: "remove", title: "Remove"},
            {title: "Send Application Link", onClick: this.onSendApplicationLink}
        ]
    }
    //</editor-fold>

    //<editor-fold desc="columns">
    get columns() {
        const {isConsultant, isHasProjects, isContractor} = storage.is;
        const getSitesLength = (contractor = {}) => {
            const {site_list} = contractor || {};
            if (!site_list) return 'N/A';
            return site_list.length;
        };
        const renderSite = ({contractor, site}) => {
            if (isContractor) {
                return getSitesLength(contractor);
            }
            return site ? site.name : "N/A";
        };
        const cols = [
            {Header: "Name", accessor: ({fname, lname}) => `${lname} ${fname}`, width: "100px", align: "left",},
            {Header: "Email Address", accessor: "username", width: "100px", align: "left",}
        ];
        if (isHasProjects) {
            isConsultant && cols.push({Header: "Company Name", accessor: "client.name", align: "left"});
            cols.push(...[
                {Header: "Project Name", accessor: "project.name", align: "left"},
                {Header: isContractor ? "Sites" : "Site Name", accessor: renderSite, align: "left"},
            ]);
        }
        cols.push({
            Header: "Actions", accessor: (row, n) => <>
                {!row.linked_employee && !isContractor && <Clickable
                    row={row}
                    onClick={this.onCompleteEmploymentDetailsShowWarningMsg}
                >
                    <i className="fa fa-warning margin-r-10 cursor-pointer font-size-16"/>
                </Clickable>}
                <ActionsButton row={row}/>
            </>, width: "60px", align: "right",
        });
        return cols;
    }
    //</editor-fold>

    //<editor-fold desc="onCompleteEmploymentDetailsShowWarningMsg">
    onCompleteEmploymentDetailsShowWarningMsg({target}, elem) {
        let {row: item} = elem.props;
        // if (this.openIdx === idx) return;

        const {id, fname, lname, linked_employee} = item;
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
                {!linked_employee &&
                    <NavItem item={item} onClick={this.refs.root.onView} title="Link To Employee Details"/>}
            </div>
        }).open();
    }
    //</editor-fold>

    //<editor-fold desc="onSendApplicationLink">
    onSendApplicationLink(item) {
        const {id, username} = item;
        if (username) {
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

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        return <PageListWritable
            ref="root"
            page={this}
            hasCreateBtn={this.hasCreateBtn}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Users"
            renderLeftButtons={this.renderLeftButtons}
            renderFilterNode={this.renderFilterNode}
            actions={this.actions}
            columns={this.columns}
            loader={this.loader}
            permissionOtherKey="Users"
            override={false}
            readonly={false}
        >
            <ConfirmDialog ref="removeDialog"/>

            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog" EditDialog={EditDialog} NewEmployeeDialog={NewEmployeeDialog}/>
            <EditDialog ref="editDialog"/>
        </PageListWritable>;
    }
    //</editor-fold>
}

export default Users;//313, 237
//243