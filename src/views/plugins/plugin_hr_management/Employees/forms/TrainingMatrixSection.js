import {observer} from "mobx-react";
import React from "react";
import {computed, extendObservable} from "mobx";
import CreateAndEditBar from "../../CreateAndEditBar";
import {SliderWithChildren} from "components/lists";
import {ProfileField, UploadButton} from "components/inputs";
import NewNextOfKinDialog from "./profile_forms/NewNextOfKinDialog";
import EditNextOfKinDialog from "./profile_forms/EditNextOfKinDialog";
import ASectionSection from "./ASectionSection";
import NewDocLivingAddressDialog from "./profile_forms/NewDocLivingAddressDialog";
import EditDocLivingAddressDialog from "./profile_forms/EditDocLivingAddressDialog";

@observer
class TrainingMatrixSection extends ASectionSection {

    listName = 'training_matrix_list';
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
              name="date_range_start"
              title="Training Date From"
              defaultValueKey={item => item.training && item.training.date_range_start}
              className="col-lg-6"
            />,
            <ProfileField
              name="date_range_end"
              title="Training Date To"
              defaultValueKey={item => item.training && item.training.date_range_end}
              className="col-lg-6"
            />,
            <ProfileField
              name="course"
              title="Course"
              defaultValueKey={item => item.training && item.training.course && item.training.course.name}
              className="col-lg-12"
            />,
            <ProfileField
              name="training_standard"
              title="Training Standard"
              defaultValueKey={item => item.training && item.training.training_standard}
              className="col-lg-12"
            />,
            <ProfileField
              name="unit_standard"
              title="Unit Standard"
              defaultValueKey={item => item.training && item.training.unit_standard}
              className="col-lg-12"
            />,
            <ProfileField
              name="unit_standard_desc"
              title="Unit Standard Description"
              defaultValueKey={item => item.training && item.training.unit_standard_desc}
              className="col-lg-12"
            />,
            <ProfileField
              name="credits"
              title="Credits"
              defaultValueKey={item => item.training && item.training.credits}
              className="col-lg-12"
            />,
            <ProfileField
              name="nqf_level"
              title="NQF Level"
              defaultValueKey={item => item.training && item.training.nqf_level}
              className="col-lg-12"
            />,
            <ProfileField
              name="requirement"
              title="Requirement"
              defaultValueKey={item => item.training && item.training.requirement}
              className="col-lg-12"
            />,
            <ProfileField
              name="provider_requirement"
              title="Provider Requirement"
              defaultValueKey={item => item.training && item.training.provider_requirement}
              className="col-lg-12"
            />,
            <ProfileField
              name="requirement_legal"
              title="Legal Requirement"
              defaultValueKey={item => item.training && item.training.requirement_legal}
              className="col-lg-12"
            />,
            <ProfileField
              name="trainer_external"
              title="Internal / External"
              defaultValueKey={item => item.training && item.training.trainer_external}
              className="col-lg-12"
            />,
            <ProfileField
              name="training_frequency"
              title="Frequency"
              defaultValueKey={item => item.training && item.training.training_frequency}
              className="col-lg-12"
            />,
            <ProfileField
              name="cost"
              title="Total Cost"
              defaultValueKey={item => item.training && item.training.cost}
              className="col-lg-12"
            />,
        ];
    }

}

export default TrainingMatrixSection;