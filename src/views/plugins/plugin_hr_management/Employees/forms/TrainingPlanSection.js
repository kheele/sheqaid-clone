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
class TrainingPlanSection extends ASectionSection {

    listName = 'training_plan_list';
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
              name="year"
              title="Year"
              defaultValueKey="year"
              className="col-lg-6"
            />,
            <ProfileField
              name="course"
              title="Course"
              defaultValueKey={item => item.course && item.course.name}
              className="col-lg-6"
            />,
            <ProfileField
              name="completion_status"
              title="Completion Status"
              defaultValueKey="completion_status"
              className="col-lg-6"
            />,
            <ProfileField
              name="result_status"
              title="Result Status"
              defaultValueKey="result_status"
              className="col-lg-6"
            />,
            <ProfileField
              name="result"
              title="Result"
              defaultValueKey="result"
              className="col-lg-12"
            />
        ];
    }

}

export default TrainingPlanSection;