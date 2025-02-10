import React from "react";
import {observer} from 'mobx-react';

import AMeetingTab from "./AMeetingTab.js";

@observer
class ManagementMeetingTab extends AMeetingTab {
    path;

    constructor(props) {
        super(props);

        this.path = props.path + 'management-meeting/';
        this.meetingType = "Management";
    }
}

export default ManagementMeetingTab;
