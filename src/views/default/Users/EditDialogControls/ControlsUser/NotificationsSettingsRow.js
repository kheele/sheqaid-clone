// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Row} from "components/FormComponents";
import {ClearableInput} from "components/inputs";
import {Permissions} from "utils/Utils";

// </editor-fold>

@observer
class NotificationsSettingsRow extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (Permissions.disallowOther("Notifications Settings")) {
            return null;
        }

        const {
            idx,
            onFormOpen,
            onFormBack,
            onFormNext,
            shouldSetupPermissions,
            lists,
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
            onUpdateNotificationPermission,
            onChange,
        } = this.props;

        return <Row
            rendered
            idx={'NotificationsSettings'}
            title={`${idx}. Notifications Settings`}
            className="NotificationsSettings-row"
            onFormOpen={onFormOpen}
            onFormNext={!Permissions.disallowOther("Permissions") && onFormNext}
            onFormBack={!shouldSetupPermissions && onFormBack}
        >
            <ClearableInput name="receive_asset_management_notifs" type="checkbox"
                            defaultValue={receive_asset_management_notifs} required
                            className="col-lg-12 form-control margin-b-0" vertical onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_asset_management_notifs} returnValue/>
            <ClearableInput name="receive_chemicals_management_notifs" type="checkbox"
                            defaultValue={receive_chemicals_management_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_chemicals_management_notifs} returnValue/>
            <ClearableInput name="receive_contractor_management_notifs" type="checkbox"
                            defaultValue={receive_contractor_management_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_contractor_management_notifs} returnValue/>
            <ClearableInput name="receive_employees_expired_docs_medicals" type="checkbox"
                            defaultValue={receive_employees_expired_docs_medicals} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_employees_expired_docs_medicals} returnValue/>
            <ClearableInput name="receive_employees_profile_notifs" type="checkbox"
                            defaultValue={receive_employees_profile_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_employees_profile_notifs} returnValue/>
            <ClearableInput name="receive_incident_management_notifs" type="checkbox"
                            defaultValue={receive_incident_management_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_incident_management_notifs} returnValue/>
            <ClearableInput name="receive_inspection_management_notifs" type="checkbox"
                            defaultValue={receive_inspection_management_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_inspection_management_notifs} returnValue/>
            <ClearableInput name="receive_non_conformance_management_notifs" type="checkbox"
                            defaultValue={receive_non_conformance_management_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_non_conformance_management_notifs} returnValue/>
            <ClearableInput name="receive_training_management_notifs" type="checkbox"
                            defaultValue={receive_training_management_notifs} required
                            className="col-lg-12 form-control margin-t-5 margin-b-10" vertical
                            onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_training_management_notifs} returnValue/>

            <hr className="margin-v-10"/>

            <ClearableInput name="receive_expired_docs_notifs" type="checkbox"
                            defaultValue={receive_expired_docs_notifs} required
                            className="col-lg-12 form-control margin-b-10" onChange={onChange}
                            onUpdate={onUpdateNotificationPermission}
                            values={lists.receive_expired_docs_notifs} returnValue/>
        </Row>;
    }

    // </editor-fold>
}

export default NotificationsSettingsRow;
