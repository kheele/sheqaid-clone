// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {
    Button,
    ClearableInput,
    ProfilePic,
    SelectClientInput,
    SelectCountryCodeInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import SetupPhoneNumDialog from 'components/dialogs/SetupPhoneNumDialog';

import EditPasswordDialog from "../../EditPasswordDialog.js";
import {CircularProgress} from "@mui/material";
import PermissionsRow from "./PermissionsRow";
import NotificationsSettingsRow from "./NotificationsSettingsRow";
import {Permissions} from "utils/Utils";
import BlacklistingRow from "./BlacklistingRow";

// </editor-fold>

export default function render() {
    if (!this.item) {
        return <CircularProgress className="fixed-center"/>;
    }

    let {
        props: {
            onFormNext, onFormBack, onFormOpen,
        },
        item, item: {
            id, data: {
                created_at,
                profile_pic,
                fname,
                lname,
                phone,
                username,
                auth_type = "MultiFactor",
                //
                notifications_settings = {},
                //
                permissions_module_list,
                permissions_other_list,
                client,
                project,
                site,
                contractor = {},
            }
        }
    } = this;

    const {data = {}} = contractor;
    const {name: contractorName} = data;

    let {
        receive_asset_management_notifs,
        receive_chemicals_management_notifs,
        receive_contractor_management_notifs,
        receive_employees_expired_docs_medicals,
        receive_employees_profile_notifs,
        receive_incident_management_notifs,
        receive_inspection_management_notifs,
        receive_non_conformance_management_notifs,
        receive_training_management_notifs,
        receive_expired_docs_notifs,
    } = notifications_settings || {};

    console.log(this.item)

    const {
        isConsultant,
        shouldSetupPermissions,
        isNoProjects,
    } = storage.is;

    if (shouldSetupPermissions) {
        receive_asset_management_notifs = true;
        receive_chemicals_management_notifs = true;
        receive_contractor_management_notifs = true;
        receive_employees_expired_docs_medicals = true;
        receive_employees_profile_notifs = true;
        receive_incident_management_notifs = true;
        receive_inspection_management_notifs = true;
        receive_non_conformance_management_notifs = true;
        receive_training_management_notifs = true;
        receive_expired_docs_notifs = true;
    }
    setTimeout(() => {
        this.state.lists.receive_asset_management_notifs[0].checked = !!receive_asset_management_notifs;
        this.state.lists.receive_chemicals_management_notifs[0].checked = !!receive_chemicals_management_notifs;
        this.state.lists.receive_contractor_management_notifs[0].checked = !!receive_contractor_management_notifs;
        this.state.lists.receive_employees_expired_docs_medicals[0].checked = !!receive_employees_expired_docs_medicals;
        this.state.lists.receive_employees_profile_notifs[0].checked = !!receive_employees_profile_notifs;
        this.state.lists.receive_incident_management_notifs[0].checked = !!receive_incident_management_notifs;
        this.state.lists.receive_inspection_management_notifs[0].checked = !!receive_inspection_management_notifs;
        this.state.lists.receive_non_conformance_management_notifs[0].checked = !!receive_non_conformance_management_notifs;
        this.state.lists.receive_training_management_notifs[0].checked = !!receive_training_management_notifs;
        this.state.lists.receive_expired_docs_notifs[0].checked = !!receive_expired_docs_notifs;
    }, 0);

    const path = this.path + "upload/profile-pic/user";

    let idx = 0;
    return (<FormControls>
        {!shouldSetupPermissions && <>
            {!isNoProjects && <Row
                active
                rendered
                idx={'Orgs'}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                {isConsultant && <SelectClientInput
                    name="client"
                    placeholder="Company..." showAll
                    defaultValue={RenderUtils.selectedClient.call(this)}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}/>
                }
                <SelectProjectInput
                    name="project"
                    placeholder="Project..."
                    showAll
                    defaultValue={RenderUtils.selectedProject.call(this)}
                    className="col-lg-12 form-control" onChange={this.form.onChange}
                />
                <SelectSiteInput
                    name="site"
                    placeholder="Site..."
                    showAll
                    defaultValue={RenderUtils.selectedSite.call(this)}
                    className="col-lg-12 form-control" onChange={this.form.onChange}
                />
            </Row>}
            <BlacklistingRow
                idx={idx += 1}
                item={item}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
                onChange={this.form.onChange}
            />
            <Row
                rendered
                idx={'UserDetails'}
                title={`${idx += 1}. User Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                <ClearableInput name="fname" type="text" placeholder="First Name" defaultValue={fname} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="lname" type="text" placeholder="Last Name" defaultValue={lname} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <div
                    className="row row-input flex w-full-calc-subtract-10 pull-left margin-l-0 margin-t-10 margin-r-10">
                    <SelectCountryCodeInput name="country" type="select" placeholder="Code..."
                                            defaultValue={this.phoneCode} isEditable={this.isLoggedUser}
                                            className="fixed-flex form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="phone" type="number" placeholder="Phone Number"
                                    defaultValue={this.phoneNumber} isEditable={this.isLoggedUser}
                                    footerDesc="Don't enter a leading zero" className="-margin-l-10 form-control"
                                    onChange={this.form.onChange}/>
                </div>
            </Row>
            <Row
                rendered
                idx={'LoginDetails'}
                title={`${idx += 1}. Login Details`}
                onFormOpen={onFormOpen}
                onFormNext={(!Permissions.disallowOther("Notifications Settings") || !Permissions.disallowOther("Permissions")) && onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="username" type="email" placeholder="Username / Email Address"
                                defaultValue={username} isEditable={this.isLoggedUser} required
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type"
                                defaultValue={auth_type} required vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.auth_type}/>
                {this.isLoggedUser && <hr/>}
                {this.isLoggedUser &&
                    <div className="row sec-group pos-relative padding-0 margin-0 min-h-50 margin-t-10">
                        <div className="fixed-center margin-t-5">
                            <Button className="btn btn-primary w-140" text="Change Password"
                                    onClick={this.onChangePassword}/>
                        </div>
                    </div>}
            </Row>
        </>}
        <NotificationsSettingsRow
            idx={idx += 1}
            onFormOpen={onFormOpen}
            onFormBack={onFormBack}
            onFormNext={onFormNext}
            shouldSetupPermissions={shouldSetupPermissions}
            lists={this.state.lists}
            receive_asset_management_notifs={receive_asset_management_notifs}
            receive_chemicals_management_notifs={receive_chemicals_management_notifs}
            receive_contractor_management_notifs={receive_contractor_management_notifs}
            receive_employees_expired_docs_medicals={receive_employees_expired_docs_medicals}
            receive_employees_profile_notifs={receive_employees_profile_notifs}
            receive_incident_management_notifs={receive_incident_management_notifs}
            receive_inspection_management_notifs={receive_inspection_management_notifs}
            receive_non_conformance_management_notifs={receive_non_conformance_management_notifs}
            receive_training_management_notifs={receive_training_management_notifs}
            receive_expired_docs_notifs={receive_expired_docs_notifs}
            onUpdateNotificationPermission={this.onUpdateNotificationPermission}
            onChange={this.form.onChange}
        />
        <PermissionsRow
            idx={idx += 1}
            onFormOpen={onFormOpen}
            onFormBack={onFormBack}
            onFormNext={onFormNext}
            permissions_module_list={permissions_module_list}
            permissions_other_list={permissions_other_list}
            onSelectAllModulePermissions={this.onSelectAllModulePermissions}
            onClearAllModulePermissions={this.onClearAllModulePermissions}
            onSelectAllOtherPermissions={this.onSelectAllOtherPermissions}
            onClearAllOtherPermissions={this.onClearAllOtherPermissions}
            onChange={this.form.onChange}
        />
        {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
        {this.isLoggedUser && <SetupPhoneNumDialog ref="setupPhoneNumDialog" isReauth/>}
    </FormControls>);
};
