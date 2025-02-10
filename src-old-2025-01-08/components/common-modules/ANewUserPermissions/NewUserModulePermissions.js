// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';
import ANewUserPermissions from "./ANewUserPermissions";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissions">
@observer
class NewUserModulePermissions extends ANewUserPermissions {

    constructor(props) {
        super(props);

        let {selectedList} = this.props;

        const {selectedClientModules: {permissions: defaultList}} = storage.selected;

        if (selectedList) {
            selectedList = selectedList.map(v => {
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
            const newList = defaultList.filter(({key, desc, actions}) => {
                return selectedList.noneMatch(v => {
                    return key === v.key;
                });
            });
            selectedList.sortBy('status');
            selectedList.sortBy('desc');
            this.state.list = [...newList, ...selectedList];

        } else {
            defaultList.sortBy('status');
            defaultList.sortBy('desc');
            this.state.list = defaultList;
        }
    }
}

// </editor-fold>

export default NewUserModulePermissions;