import React from "react";
import {observer} from 'mobx-react';

import {execWhen} from '../../../utils/Utils';

import style from "./GeneralTab.lazy.css";

@observer
class GeneralTab extends React.Component {
    pageKey = "GeneralTab";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
        execWhen(() => this.refs.iframe).then(iframe => {
            $(iframe).on('load', () => {
                const contents = $(iframe).contents();
                contents.find('head').append('<style>footer {margin-right: 80px}</style>');
            });
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return <div id={this.pageKey + "-tab"} className={this.pageKey + "-tab"}>
            <iframe ref="iframe" src="https://rhespo.rocket.chat/channel/general?layout=embedded" width="90%" height="100%"/>
        </div>
    }
}

export default GeneralTab;
