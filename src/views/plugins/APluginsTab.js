import React from "react";
import {observer} from 'mobx-react';

import {PluginsView} from '../../components/page-lists';
import {Permissions} from '../../utils/Utils';
import {ModuleRenderer} from '../../components/FormComponents';

@observer
class APluginsTab extends React.Component {
    path;
    className = "APluginsTab";

    constructor(props) {
        super(props);

        this.onFilter = this.onFilter.bind(this);
        this.onFilterAll = this.onFilterAll.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        setTimeout(function () {
            const {pluginsView} = this.refs;
            pluginsView && pluginsView.showScrollbars();
        }.bind(this), 0);
    }

    componentWillUnmount() {
        const {pluginsView} = this.refs;
        pluginsView && pluginsView.removeScrollbars();
    }
    
    onFilterAll(list) {
        const {isContractor, isContractorView} = storage.is;
        const {contractorAllowedModules} = moduleManager;
        return this.onFilter(list).filter(item => {
            if((isContractor || isContractorView) && item.key === "__B_Contractors") return true;
            const {permissions_modules} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_modules || []).find(v => v.key === item.key);
            const disallow = Permissions.disallow(permissions_mod) || (isContractorView && !contractorAllowedModules.contains(item.key));
            return !disallow;
        });
    }
    
    renderItem(item, n) {
        const {isInstalled, isInstallable} = this;
        return <ModuleRenderer item={item} idx={n} isInstalled={isInstalled} isInstallable={isInstallable}/>;
    }

    render() {
        return <PluginsView 
            ref="pluginsView" 
            title={this.props.title + ' Plugins'} 
            onFilterAll={this.onFilterAll} 
            renderModuleItem={this.renderItem} 
            className={this.className + ' ' + this.pageKey}
        />;
    }
}

export default APluginsTab;