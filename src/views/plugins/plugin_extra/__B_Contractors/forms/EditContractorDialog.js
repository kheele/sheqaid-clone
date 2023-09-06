import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {Permissions, ShouldUpdate} from 'utils/Utils';
import {ClearableInput, SelectClientInput, SelectProjectInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewSiteListTable} from 'components/FormTableComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditContractorDialog.lazy.css";
import updateContractor from "mutations/all/Contractor/updateContractor";
import findByIdContractor from "mutations/all/Contractor/findByIdContractor";
import {CircularProgress} from "@mui/material";
import Popover from "components/popovers/Popover";
import Tabs from "components/tabs/Tabs";
import updateProxyContractorSite from "mutations/all/ProxyContractorSite/updateProxyContractorSite";
import NavItem from "components/navs/NavItem";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditContractorDialog";
    title = "Edit Contractor";

    constructor(props) {
        super(props, style);
    }
    
    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === "__B_Contractors");
        if(!Permissions.allowRemove(permissions_mod)) {
            return true;
        }
        
        return false;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/";
    @observable
    state = {
        lists: {
            inc_contractor_pack: [
                {text: 'Yes', value: 'Yes', checked: false}, 
                {text: 'No', value: 'No', checked: false}
            ]
        },
        item: null,
    };
    
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
        this.onFormSave = this.onFormSave.bind(this);
        
        this.form = new Form();
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

    //<editor-fold desc="onFormSave">
    onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
        } = this;

        const {hasProjects} = storage.is;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateContractor({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (res === "EMAIL_DUP") {
                    infoDialog.open("Contractor with this email address already exist.");
                } else {
                    onSaved && onSaved(res);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    // this.props.close();
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;

        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Contractor Name is required');
                return;
            }
            if (!form.isValid('username')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('inc_contractor_pack')) {
                infoDialog.open("Include Contractor's Pack is required");
                return;
            }

            const {
                name, username, inc_contractor_pack
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, name, 'name');
            ShouldUpdate.check(data, old_data, username, 'username');
            ShouldUpdate.checkBox(data, old_data, inc_contractor_pack, 'inc_contractor_pack');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            if(hasProjects) {
                if (!form.isValid('site_list') || form.get('site_list').isEmpty()) {
                    infoDialog.open('At least one Site is required');
                    return;
                }
            }

            const {
                site_list
            } = form.data;
            const data = {};
            if(hasProjects) {
                ShouldUpdate.checkSiteList(data, old_data, site_list, 'site_list');
            }

            onSubmit(data);
            return;
        }

        return true;
    }

    //</editor-fold>

    @computed get item() {
        return this.state.item;
    }

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
        
        const {isConsultant, hasProjects} = storage.is;
        
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
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Employer Details" 
                onFormOpen={onFormOpen} 
                onFormNext={hasProjects && onFormNext}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="name" placeholder="Contractor Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="username" type="email" placeholder="Email Address" defaultValue={username} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="inc_contractor_pack" type="radio"  placeholder="Include Contractor's Pack" defaultValue={inc_contractor_pack} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.inc_contractor_pack} returnValue/>
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
            {/*{hasProjects && <Row */}
            {/*    rendered */}
            {/*    idx={2}*/}
            {/*    title="2. Add/Remove Site(s)" */}
            {/*    onFormOpen={onFormOpen} */}
            {/*    onFormBack={onFormBack}*/}
            {/*    onFormSave={this.onFormSave}*/}
            {/*>*/}
            {/*    {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}*/}
            {/*    <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>*/}
            {/*    <NewSiteListTable name="site_list" defaultValue={[...site_list, null]} onChange={this.form.onChange}/>*/}
            {/*</Row>}*/}
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
            <Popover ref="popover"/>
        </FormControls>;
    }
    //</editor-fold>
}

export default EditDialog;
