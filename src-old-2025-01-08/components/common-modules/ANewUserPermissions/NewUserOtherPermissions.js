// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, toJS} from 'mobx';
import ANewUserPermissions from "./ANewUserPermissions";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserOtherPermissions">
@observer
class NewUserOtherPermissions extends ANewUserPermissions {

    constructor(props) {
        super(props);

        let {selectedList, readonly} = this.props;

        const {list: {permissionOtherKeys}} = storage;//{id, value}
        let defaultList = [...permissionOtherKeys].map(key => {
            return {
                key,
                actions: {
                    create: false, edit: false, view: false, remove: false, share: false
                },
            };
        });//{id, key: {id, value}, actions}

        // console.log('NewUserOtherPermissions defaultList', defaultList.slice())

        if (selectedList) {
            // console.log('NewUserOtherPermissions selectedList', selectedList.slice())

            const defaultPermissionOtherKeys = defaultList.map(({id, key: {value}, actions}) => value);
            selectedList = selectedList.filter(({id, key: {value}, actions}) => {
                return defaultPermissionOtherKeys.contains(value);
            }).map(v => {
                if (!('create' in v.actions)) {
                    extendObservable(v.actions, {create: false});
                }
                if (!('edit' in v.actions)) {
                    extendObservable(v.actions, {edit: false});
                }
                if (!('view' in v.actions)) {
                    extendObservable(v.actions, {view: false});
                }
                if (!('remove' in v.actions)) {
                    extendObservable(v.actions, {remove: false});
                }
                if (!('share' in v.actions)) {
                    extendObservable(v.actions, {share: false});
                }
                return v;
            });
            const newList = defaultList.filter(({id, key: {value}, actions}) => {
                return selectedList.noneMatch(({key: {value: __value}}) => __value === value);
            });
            // selectedList.sortBy('status');
            selectedList.sortBy('key.value');
            this.state.list = [...newList, ...selectedList];
        } else {
            // defaultList.sortBy('status');
            defaultList.sortBy('key.value');
            this.state.list = defaultList;////{id: null, key: {id, value}, actions}
        }

        if (!readonly) {
            // const {onChange, name} = props;
            // onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);
        }
//        console.log('NewUserOtherPermissions', this.state.list.slice())
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="defaultOtherPermissions">
window.defaultOtherPermissions = [
    //
    'Sectors',
    //
    'Clients', //done
    'Projects', //done
    'Sites', //done
    //
    'Users', //done
    //
    'Blacklisting',
    'Permissions',
    'Notifications Settings',
    //
    'Appointments', //done
    'Job Positions', //done
    'Departments', //done
    'Teams', //done
//    'Planned Job Observations', //done
    //
    'Quick Incident',
    'Contractor Documents', //done
    //
    'Document Categories',
//    'Audit Logs', //done: only view
//    'Settings'
].map(title => {
    return {key: title, desc: title, actions: {create: false, edit: false, view: false, remove: false, share: false}};
});
// </editor-fold>

export default NewUserOtherPermissions;