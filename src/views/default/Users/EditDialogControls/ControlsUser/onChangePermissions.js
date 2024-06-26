// <editor-fold defaultstate="collapsed" desc="imports">
import updatePermissionAction from "mutations/all/PermissionAction/updatePermissionAction";
import insertPermissionAction from "mutations/all/PermissionAction/insertPermissionAction";
import insertPermissionModule from "mutations/all/PermissionModule/insertPermissionModule";
import updatePermissionOther from "mutations/all/PermissionOther/updatePermissionOther";
import insertPermissionOther from "mutations/all/PermissionOther/insertPermissionOther";
import updatePermissionModule from "mutations/all/PermissionModule/updatePermissionModule";

// </editor-fold>

export default async function (el, name, val) {
    if (val) {
        let {
            item: {id: user_id, data: old_data, data: {permissions_other_list, permissions_module_list}}
        } = this;

        const {list, item, action, oldVal, newVal, onComplete} = val;

        // console.log('onChangePermissions', name, val)
        if (name === 'permissions_other_list') {
            //insertPermissionOther{id, actions, key, user, contractor_user},
            //updatePermissionOther{id, actions_id, key_id, user_id, contractor_user_id}
            let {id, key, actions} = item;
            if (id) {
                if (actions.id) {
                    actions = await updatePermissionAction(actions);
                } else {
                    actions = await insertPermissionAction(actions);
                }
                updatePermissionOther({id, actions_id: actions.id}).then(onComplete);
            } else {
                insertPermissionOther({
                    actions: {data: actions},
                    key_id: key.id,
                    user_id,
                    // contractor_user_id: ,
                }).then(onComplete);
            }
        } else {
            //insertPermissionModule{id, actions, module, user, contractor_user},
            //updatePermissionModule{id, actions_id, module_id, user_id, contractor_user_id}
            let {id, module, actions} = item;
            if (id) {
                if (actions.id) {
                    // console.log(1)
                    actions = await updatePermissionAction(actions);
                } else {
                    // console.log(2)
                    actions = await insertPermissionAction(actions);
                }
                updatePermissionModule({id, actions_id: actions.id}).then(onComplete);
            } else {
                // console.log(3)
                insertPermissionModule({
                    actions: {data: actions},
                    module_id: module.id,
                    user_id,
                    // contractor_user_id: ,
                }).then(onComplete);
            }
        }
    }

};
