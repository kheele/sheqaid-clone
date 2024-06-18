import React from "react";
import {observer} from 'mobx-react';

import {LeaveControls} from "../../Leaves/forms/ProfileDialog";
import Settings from "../../../../../utils/Settings";

@observer
class ViewTimeoffSection extends React.Component {
    static isValid = Settings.isEmployeeTimeOffViewers;
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