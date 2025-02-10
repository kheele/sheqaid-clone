import React from "react";
import {observer} from 'mobx-react';

import style from "./UsersTab.lazy.css";

@observer
class UsersTab extends React.Component {
    pageKey = "UsersTab";

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
            <iframe src="https://rhespo.rocket.chat/channel/support-livechat-offline?layout=embedded" width="100%" height="100%"/>
        </div>
    }
}

export default UsersTab;
