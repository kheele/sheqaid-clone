import React from "react";
import {observer} from 'mobx-react';

import {PluginsView} from 'components/page-lists';
import {Permissions} from 'utils/Utils';
import ItemRenderer from './ItemRenderer';

@observer
class InitViewClientOrNonConsultant extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    onFilterAll(modulesDashboard) {
        return onFilterImpl(modulesDashboard).filter(({module: {key}}) => {
            const {permissions_module_list} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_module_list || []).find(({module: {key: __key}}) => __key === key);
            const allow = Permissions.allow(permissions_mod);
            return allow;
        });
    }

    onFilterReadonly(modulesDashboard) {
        return onFilterImpl(modulesDashboard).filter(({module: {key}}) => {
            const {permissions_module_list} = storage.loggedUser.user.data;
            const permissions_mod = (permissions_module_list || []).find(({module: {key: __key}}) => __key === key);
            const disallow = Permissions.disallow(permissions_mod);
            return disallow;
        });
    }

    renderItem(item, idx) {
        const {module: {color, key, svgIconLeft, faIconLeft, title}} = item;
        if (key === "_06_Communication_And_Participation" || key === "_09_HIRA_And_Opportunities" || key === "_16_Emergency_Preparedness"
          || key === "_01_Project_Plan" || key === "_02_IMS_Policies") return null;

        const {onInfo, onClick} = this.props;
        const {permissions_module_list} = storage.loggedUser.user.data;
        const permissions_mod = (permissions_module_list || []).find(({module: {key: __key}}) => __key === key);
        const allow = Permissions.allow(permissions_mod);

        return <ItemRenderer key={key} idx={idx} item={item} allow={allow} onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        const {selected: {selectedClient}, is: {isConsultant, isEmployee, isContractorViewIncContractorPack}} = storage;
        if (isEmployee || isContractorViewIncContractorPack) return null;
        if (isConsultant && !selectedClient) return null;
//        if(!isConsultant) return null;

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

export default InitViewClientOrNonConsultant;