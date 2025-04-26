import React from "react";
import {observer} from 'mobx-react';

import {LeaveControls} from "../../Leaves/forms/ProfileDialog";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class ViewTimeoffSection extends AEmployeeSection {
    static isValid = EmployeeProfileSettings.isEmployeeTimeOffViewers;
    pageKey = "TimeoffSection";

    constructor(props) {
        super(props);
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;
        return <LeaveControls item={item} isEmbedded tabsHeight="530px"/>;
    }
}

export default ViewTimeoffSection;