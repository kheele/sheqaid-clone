import React from "react";
import {observer} from 'mobx-react';

import {WarningControls} from "../../Warnings/forms/ProfileDialog";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class ViewWarningSection extends AEmployeeSection {
    static isValid = EmployeeProfileSettings.isEmployeeWarningViewers;
    pageKey = "WarningSection";

    constructor(props) {
        super(props);
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;
        return <WarningControls item={item} isEmbedded tabsHeight="530px"/>;
    }
}

export default ViewWarningSection;