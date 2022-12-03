import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Dialog from '../../components/dialogs/Dialog';
import Tabs from '../../components/tabs/Tabs';
import PluginsInstalledTab from './PluginsInstalledTab.js';
import PluginsNotInstalledTab from './PluginsNotInstalledTab.js';
import PluginsNewTab from './PluginsNewTab.js';
import PluginsUpcomingTab from './PluginsUpcomingTab.js';

import style from "./PluginHubDialog.lazy.css";

@observer
class PluginHubDialog extends React.Component {
    pageKey = "PluginHubDialog";
    @observable
    state = {index: 0, isLoaded: false};

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    open(tabIdx) {
        if (!!tabIdx) this.state.index = tabIdx;
        return this.refs.dialog.open("Plugins Hub");
    }

    close() {
        this.refs.dialog.close();
    }

    render() {
        return (<Dialog key={this.pageKey + '-dialog'} ref="dialog" className={this.pageKey}>
            <Tabs key="tabs" index={this.state.index}>
                <PluginsInstalledTab title="Installed"/>
                <PluginsNotInstalledTab title="Not Installed"/>
                <PluginsNewTab title="New"/>
                <PluginsUpcomingTab title="Upcoming"/>
            </Tabs>
        </Dialog>);
    }
}

export default PluginHubDialog;