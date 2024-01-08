import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Permissions} from 'utils/Utils';

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewSiteListTable} from 'components/FormTableComponents';

import EditContractorDialog from './EditContractorDialog.js';

import style from "./ProfileContractorDialog.lazy.css";
import Tabs from "components/tabs/Tabs";
import updateProxyContractorSite from "mutations/all/ProxyContractorSite/updateProxyContractorSite";
import Popover from "components/popovers/Popover";
import NavItem from "components/navs/NavItem";
import {CircularProgress} from "@mui/material";
import findByIdContractor from "mutations/all/Contractor/findByIdContractor";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileContractorDialog";
    findById = findByIdContractor;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Contractor";
    }

    onEdit(evt, btn) {
        this.refs.controls.onEdit(evt, btn);
    }

    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === "__B_Contractors");
        if (!Permissions.allowRemove(permissions_mod)) {
            return true;
        }

        return false;
    }

    get topButtonsHiddenEdit() {
        if (this.props.isRemoved) {
            return true;
        }
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === "__B_Contractors");
        if (!Permissions.allowEdit(permissions_mod)) {
            return true;
        }

        return false;
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    @observable
    state = {
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.renderActions = this.renderActions.bind(this);
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {
        const {dialog} = this.props;

        try {
            const item = await dialog.execWhen(() => this.props.state.item);

            this.state.item = await findByIdContractor(item.id);
        } catch (e) {

        }
    }

    // </editor-fold>

    //<editor-fold desc="onClick">
    onClick(evt, btn) {
        const {action: status, title, item} = btn.props;

        const {
            id, data: {
                site_pending_list, site_accepted_list, site_declined_list, site_cancelled_list, site_removed_list,
            }
        } = this.item;

        const proceed = (status) => {
            confirmDialog.open(`Are you sure you want to proceed?`).then(res => {
                if (res === 1) {
                    progressDialog.open();
                    updateProxyContractorSite({id: item.id, status}).then(res => {
                        item.status = status;

                        infoDialog.open(`Successfully ${status}`);
                        if (status === "Accepted") {
                            site_accepted_list.push(item);
                            site_pending_list.remove(item);
                            site_declined_list.remove(item);
                            site_removed_list.remove(item);
                        } else if (status === "Declined") {
                            site_declined_list.push(item);
                            site_pending_list.remove(item);
                        } else if (status === "Removed") {
                            site_removed_list.push(item);
                            site_accepted_list.remove(item);
                        } else if (status === "Pending") {
                            site_pending_list.push(item);
                            site_accepted_list.remove(item);
                            site_removed_list.remove(item);
                        }
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again.");
                    }).finally(() => {
                        progressDialog.close();
                    });
                }
            });
        };

        if (title === "Restore") {
            const onClick = (evt, el) => {
                const {action: status} = el.props;
                proceed(status);
            };

            this.ref.popover.settings({
                style: {
                    left: 'auto',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 350,
                    transform: 'none',
                    position: 'fixed !important'
                },
                isDialog: true,
                contentNode: <div className="text-center w-full h-full flex-column flex-center">
                    <NavItem action="Pending" onClick={onClick} title="Restore To Pending"/>
                    <NavItem action="Accepted" onClick={onClick} title="Restore & Accept"/>
                </div>
            }).open();
        } else {
            proceed(status);
        }
    }

    //</editor-fold>

    onEdit(evt, btn) {
        this.refs.editDialog.open(this.item);
    }

    @computed get item() {
		return this.props.state.item;
	}

    //<editor-fold desc="renderActions">
    renderActions(item, n) {
        const {status} = item;

        const pending = status === "Pending";
        const declined = status === "Declined";
        const cancelled = status === "Cancelled";
        const accepted = status === "Accepted";
        const removed = status === "Removed";

        const w = accepted ? 150 : 80;
        return <div className={`td fixed-flex min-w-${w} grid-gap-5`}>
            {(pending || declined) && <Button
                item={item}
                action="Accepted"
                className="btn btn-primary padding-v-0 padding-h-0 w-70"
                text="Accept"
                onClick={this.onClick}
            />}
            {pending && <Button
                item={item}
                action="Declined"
                className="btn btn-primary padding-v-0 padding-h-0 w-70"
                text="Decline"
                onClick={this.onClick}
            />}
            {accepted && <Button
                item={item}
                action="Removed"
                className="btn btn-primary padding-v-0 padding-h-0 w-70"
                text="Remove"
                onClick={this.onClick}
            />}
            {removed && <Button
                item={item}
                className="btn btn-primary padding-v-0 padding-h-0 w-70"
                text="Restore"
                onClick={this.onClick}
            />}
        </div>;
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, name, username, inc_contractor_pack,
                    site_pending_list, site_accepted_list, site_declined_list, site_cancelled_list, site_removed_list,
                }
            }
        } = this;

        const {hasProjects} = storage.is;

        console.log(this.item)

        let index;
        const viewStatus = dialog.extraProp('status');
        if (viewStatus === "Accepted") {
            index = 0;
        } else if (viewStatus === "Pending") {
            index = 1;
        } else if (viewStatus === "Declined") {
            index = 2;
        } else if (viewStatus === "Cancelled") {
            index = 3;
        } else {
            index = 0;
        }

        return <FormControls lazyLoad>
            <Row
                rendered
                active={!viewStatus}
                idx={1}
                title="1. Employer Details"
                onFormOpen={onFormOpen}
                onFormNext={hasProjects && onFormNext}
            >
                <ProfileField title="Contractor Name" name="name" value={name} className="col-lg-12"/>
                <ProfileField title="Email Address" name="username" value={username} className="col-lg-12"/>
                <ProfileField title="Include Contractor's Pack" name="inc_contractor_pack" value={inc_contractor_pack}
                              className="col-lg-12"/>
            </Row>
            {hasProjects && <Row
                rendered
                active={!!viewStatus && viewStatus !== "Removed"}
                idx={2}
                title="2. Active Site(s)"
                sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Tabs ref="mainTabs" tabsHeight="400px" index={index}>
                    <NewSiteListTable title="Accepted Sites" name="accepted_site_list" defaultValue={site_accepted_list}
                                      readonly renderActions={this.renderActions} className="table-Accepted"/>
                    <NewSiteListTable title="Pending Sites" name="pending_site_list" defaultValue={site_pending_list}
                                      readonly renderActions={this.renderActions} className="table-Pending"/>
                    <NewSiteListTable title="Declined Sites" name="declined_site_list" defaultValue={site_declined_list}
                                      readonly renderActions={this.renderActions} className="table-Declined"/>
                    <NewSiteListTable title="Cancelled Sites" name="cancelled_site_list"
                                      defaultValue={site_cancelled_list} readonly renderActions={this.renderActions}
                                      className="table-Cancelled"/>
                </Tabs>
            </Row>}
            {hasProjects && <Row
                active={viewStatus === "Removed"}
                rendered
                idx={3}
                title="3. Removed Site(s)"
                sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewSiteListTable title="Removed Sites" name="removed_site_list" defaultValue={site_removed_list}
                                  readonly renderActions={this.renderActions} className="table-Removed"/>
            </Row>}
            <EditContractorDialog ref="editDialog"/>
            <Popover ref="popover"/>
        </FormControls>;
    }

    //</editor-fold>

}

export default ProfileDialog;
