import React from "react";
import {observer} from 'mobx-react';

import AMeetingTab from "./AMeetingTab.js";

@observer
class SafetyMeetingTab extends AMeetingTab {
    path;

    constructor(props) {
        super(props);

        this.path = props.path + 'safety-meeting/';
        this.meetingType = "Safety";
    }
}

export default SafetyMeetingTab;
