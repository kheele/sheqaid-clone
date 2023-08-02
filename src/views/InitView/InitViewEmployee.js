import React from "react";
import {observer} from 'mobx-react';

import {PluginsView} from 'components/page-lists';
import ItemRenderer from './ItemRenderer';

@observer
class InitViewEmployee extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterEmployeeOnly(modulesDashboard) {
        const {employeeDisallowedModules} = moduleManager;
        return onFilterImpl(modulesDashboard).filter(({module: {key}}) => {
            const allow = !employeeDisallowedModules.contains(key);
            return allow;
        });
    }

    renderItem(item, idx) {
        const {onInfo, onClick} = this.props;
        return <ItemRenderer key={item.key} idx={idx} item={item} allow onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        const {is: {isEmployee}} = storage;
        if (!isEmployee) return null;

        return <PluginsView
            title=''
            onFilterEmployeeOnly={this.onFilterEmployeeOnly}
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

export default InitViewEmployee;