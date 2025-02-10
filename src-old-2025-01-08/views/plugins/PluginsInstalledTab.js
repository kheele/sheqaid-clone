import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APluginsTab from './APluginsTab.js';
import {ModuleRenderer} from 'components/FormComponents';

import style from "./PluginsInstalledTab.lazy.css";

@observer
class PluginsInstalledTab extends APluginsTab {
    path;
    pageKey = "PluginsInstalledTab";
    isInstalled = true;

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        installed_permissions_modules: []
    };
    // </editor-fold>

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
//        this.state.installed_permissions_modules.push();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onFilter(list) {
        return list.filter(item => item.key !== 'Dashboard' && item.status === 'Installed');
    }
    
    renderItem(item, n) {      
        return <ModuleRenderer item={item} idx={n} isInstalled={this.isInstalled} isInstallable={true}>
            <InstallEachBtn state={this.state} item={item}/>
        </ModuleRenderer>;
    }
}

// <editor-fold defaultstate="collapsed" desc="InstallEachBtn">
@observer
class InstallEachBtn extends React.Component {
    render() {
        const {state, item} = this.props;
        const {installed_permissions_modules} = state;
        const isInstalled = installed_permissions_modules.anyMatch(v => v.key === item.key);
        if (isInstalled) {
            return <React.Fragment>
                <i className="fa fa-minus"/> Uninstall
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <i className="fa fa-plus"/> Install
            </React.Fragment>;
        }
    }
}
// </editor-fold>

export default PluginsInstalledTab;
