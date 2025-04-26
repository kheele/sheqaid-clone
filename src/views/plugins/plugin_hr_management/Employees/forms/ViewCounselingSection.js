import React from "react";
import {observer} from 'mobx-react';

import {CounselingControls} from "../../Counselings/forms/ProfileDialog";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class ViewCounselingSection extends AEmployeeSection {
    static isValid = EmployeeProfileSettings.isEmployeeCounselingViewers;
    pageKey = "CounselingSection";

    constructor(props) {
        super(props);
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;
        return <CounselingControls item={item} isEmbedded tabsHeight="530px"/>;
    }
}

export default ViewCounselingSection;