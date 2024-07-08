//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {
    SelectModuleClaimsInput,
    SelectModuleExtraInput,
    SelectModuleHRInput,
    SelectModuleSHEQInput,
} from "../../inputs";
//</editor-fold>

//<editor-fold desc="SelectModule">
@observer
class SelectModule extends React.Component {
    render() {
        const {state: {plugin}, defaultValue, readonly, onChange} = this.props;

        if (!plugin) {
            return null;
        }

        const {data: {key}} = plugin;

        console.log('plugin', plugin, defaultValue)

        let node = [<hr/>];
        if (key === 'plugin_sheq_assist') {
            node.push(<SelectModuleSHEQInput name="module" defaultValue={defaultValue} readonly={readonly}
                                             className="col-lg-12"
                                             onChange={onChange}/>);
        } else if (key === 'plugin_hr_management') {
            node.push(<SelectModuleHRInput name="module" defaultValue={defaultValue} readonly={readonly}
                                           className="col-lg-12"
                                           onChange={onChange}/>);
        } else if (key === 'plugin_extra') {
            node.push(<SelectModuleExtraInput name="module" defaultValue={defaultValue} readonly={readonly}
                                              className="col-lg-12"
                                              onChange={onChange}/>);
        } else if (key === 'plugin_claim_management') {
            node.push(<SelectModuleClaimsInput name="module" defaultValue={defaultValue} readonly={readonly}
                                               className="col-lg-12"
                                               onChange={onChange}/>);
        } else {
            return null;
        }

        return <>{node}</>;
    }
}

//</editor-fold>

export default SelectModule;
