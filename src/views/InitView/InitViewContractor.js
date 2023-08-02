import React from "react";
import {observer} from 'mobx-react';

import {PluginsView} from 'components/page-lists';
import ItemRenderer from './ItemRenderer';

@observer
class InitViewContractor extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterReadonly(modulesDashboard) {
        const {contractorAllowedModules} = moduleManager;
        console.log('modulesDashboard', modulesDashboard.slice());
        return onFilterImpl(modulesDashboard).filter(({module, key}) => {
            key = key || module.key;
            if (key === "__B_Contractors") return false;

            const disallow = !contractorAllowedModules.contains(key);
            return disallow;
        });
    }

    onFilterAll(modulesDashboard) {
        const {contractorAllowedModules} = moduleManager;
        console.log('modulesDashboard all', modulesDashboard.slice());
        return onFilterImpl(modulesDashboard).filter(({module, key}) => {
            key = key || module.key;
            if (key === "__B_Contractors") return false;

            const allow = contractorAllowedModules.contains(key);
            return allow;
        });
    }

    renderItem(item, idx) {
        let {module} = item;
        const {color, key, svgIconLeft, faIconLeft, title} = module || item;
        if (key === "__B_Contractors") return null;

        const {onInfo, onClick} = this.props;

        const {contractorAllowedModules} = moduleManager;
        const allow = contractorAllowedModules.contains(key);
        return <ItemRenderer key={key} idx={idx} item={item} allow={allow} onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        const {is: {isContractorViewIncContractorPack, isEmployee}} = storage;
        if (!isContractorViewIncContractorPack) return null;

        return <PluginsView
            title=''
            onFilterReadonly={this.onFilterReadonly}
            onFilterAll={this.onFilterAll}
            renderModuleItem={this.renderItem}
        />;
    }
}

function onFilterImpl(modulesDashboard) {
    return modulesDashboard;
//    if(plugin.data.key === 'plugin_hr_management') return [];

//     const {selectedClientModules: {list: modules}, selectedClient} = storage.selected;
// //    console.log('permissions_module_list', __modules.map(v => v.key), modules.map(v => v.key))
//     return modules.filter(item => item.key !== 'Dashboard')
//         .filter(item => modulesDashboard.anyMatch(v2 => v2.key === item.key))
//         .map(item => modulesDashboard.find(v2 => v2.key === item.key));
}

export default InitViewContractor;