import {computed} from 'mobx';
import {computedFn} from "mobx-utils";

class Manager {
    
    moduleListInstalledLoadBy = computedFn((isDashboard = true) => {
        let {listInstalled} = pluginManager;
        if(isDashboard) {
            listInstalled = listInstalled.filter(v => v.data.key !== 'plugin_hr_management')
        }
        const colors = ['rgb(90, 120, 120)', 'rgb(110, 80, 80)', 'rgb(70, 100, 60)'];
        return listInstalled.map(({id, data, data: {key}}, n) => {
            return data.module_list.filter(({status}) => status === 'Installed').map(v => {
                return {...v, borderColor: colors[n], group: key};
            });
        }).reduce((a1, a2) => [...a1, ...a2], []);
    }, true);

    @computed
    get moduleListInstalledAll() {
        return this.moduleListInstalledLoadBy(false);
    };

    @computed
    get moduleListInstalledDashboard() {
        return this.moduleListInstalledLoadBy(true);
    };

    isInPlugin = computedFn((item, key) => {
        if(!item) return false;
        let {listInstalled} = pluginManager;
        const {id, module, actions} = item;
        const plugin = listInstalled.find(v => v.data.key === key);
        return plugin && plugin.data.module_list.filter(({status}) => status === 'Installed').anyMatch(({key}) => key === module.key);
    }, true);
    
    @computed
    get contractorAllowedModules() {
        return ['_13_2_3_Hazardous_Chemical_Substances', '_17_Incident_Investigation', '_19_Maintenance'];
    }

    @computed
    get employeeDisallowedModules() {
        return [
            '_00_Procedure_for_Document_and_Record_Control',
            '_01_Project_Plan',
            '_02_IMS_Policies',
            '_09_HIRA_And_Opportunities',
            '_13_2_3_Hazardous_Chemical_Substances',
            '_19_Maintenance',
            '__B_Contractors'
        ];
    }

}

const manager = new Manager();
export default manager;