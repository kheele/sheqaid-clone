import React from "react";
import {observer} from 'mobx-react';

import {PluginsView} from 'components/page-lists';
import {Permissions} from 'utils/Utils';
import ItemRenderer from './ItemRenderer';

@observer
class InitViewAdmin extends React.Component {

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

    renderItem(item, idx) {
        const {module: {color, key, svgIconLeft, faIconLeft, title}} = item;

        const {onInfo, onClick} = this.props;
        const {permissions_module_list} = storage.loggedUser.user.data;
        const permissions_mod = (permissions_module_list || []).find(({module: {key: __key}}) => __key === key);
        const allow = Permissions.allow(permissions_mod);

        return <ItemRenderer key={key} idx={idx} item={item} allow={allow} onInfo={onInfo} onClick={onClick}/>;
    }

    render() {
        if (!isAdminApp) return null;

        return <PluginsView
            title=''
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

export default InitViewAdmin;