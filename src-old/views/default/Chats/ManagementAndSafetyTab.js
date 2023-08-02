import React from "react";
import {observer} from 'mobx-react';

import style from "./ManagementAndSafetyTab.lazy.css";

@observer
class ManagementAndSafetyTab extends React.Component {
    pageKey = "ManagementAndSafetyTab";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return <div id={this.pageKey + "-tab"} className={this.pageKey + "-tab"}>
            <iframe src="https://rhespo.rocket.chat/channel/management-and-safety?layout=embedded" width="100%" height="100%"/>
        </div>
    }
}

export default ManagementAndSafetyTab;
