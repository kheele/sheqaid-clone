import {observer} from "mobx-react";
import React from "react";
import {computed, extendObservable} from "mobx";
import {CreateAndEditBar} from "components/FormComponents";
import {SliderWithChildren} from "components/lists";
import {ProfileField, UploadButton} from "components/inputs";
import NewNextOfKinDialog from "./profile_forms/NewNextOfKinDialog";
import EditNextOfKinDialog from "./profile_forms/EditNextOfKinDialog";
import {ASectionSection} from "components/FormComponents";
import NewDocLivingAddressDialog from "./profile_forms/NewDocLivingAddressDialog";
import EditDocLivingAddressDialog from "./profile_forms/EditDocLivingAddressDialog";

@observer
class TrainingCourseSection extends ASectionSection {

    listName = 'training_course_list';
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
              name="name"
              title="Course Name"
              defaultValueKey="name"
              className="col-lg-12"
            />,
            <ProfileField
              name="unit_standard"
              title="Unit Standard"
              defaultValueKey="unit_standard"
              className="col-lg-12"
            />,
            <ProfileField
              name="unit_standard_desc"
              title="Unit Standard Description"
              defaultValueKey="unit_standard_desc"
              className="col-lg-12"
            />,
        ];
    }

}

export default TrainingCourseSection;