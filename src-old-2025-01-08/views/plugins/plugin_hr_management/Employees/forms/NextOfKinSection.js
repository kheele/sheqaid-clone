import {observer} from "mobx-react";
import React from "react";
import {ProfileField} from "components/inputs";
import NewNextOfKinDialog from "./profile_forms/NewNextOfKinDialog";
import EditNextOfKinDialog from "./profile_forms/EditNextOfKinDialog";
import {ASectionSection} from "components/FormComponents";
import {updateEmployeeNextOfKin} from "mutations/update";

@observer
class NextOfKinSection extends ASectionSection {

    listName = 'next_of_kin_list';
    onUpdate = updateEmployeeNextOfKin;
    NewDialog = NewNextOfKinDialog;
    EditDialog = EditNextOfKinDialog;

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);
    }

    //</editor-fold>

    get itemRenderer() {
        return [
            <ProfileField
                name="fname"
                title="First Name"
                defaultValueKey="fname"
                className="col-lg-6"
            />,
            <ProfileField
                name="lname"
                title="Last Name"
                defaultValueKey="lname"
                className="col-lg-6"
            />,
            <ProfileField
                name="phone1"
                title="1) Phone No."
                defaultValueKey="phone1"
                className="col-lg-6"
            />,
            <ProfileField
                name="phone2"
                title="2) Phone No."
                defaultValueKey="phone2"
                className="col-lg-6"
            />,
            <ProfileField
                name="relationship"
                title="Relationship"
                defaultValueKey="relationship"
                className="col-lg-12"
            />
        ];
    }

}

export default NextOfKinSection;