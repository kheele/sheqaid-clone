import React from "react";
import {observer} from 'mobx-react';

import style from "./SeniorManagementTab.lazy.css";

@observer
class SeniorManagementTab extends React.Component {
    pageKey = "SeniorManagementTab";

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
            <iframe src="https://rhespo.rocket.chat/channel/senior-management?layout=embedded" width="100%" height="100%"/>
        </div>
    }
}

export default SeniorManagementTab;
