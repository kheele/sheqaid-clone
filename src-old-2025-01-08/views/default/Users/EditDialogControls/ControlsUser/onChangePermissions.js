// <editor-fold defaultstate="collapsed" desc="imports">
import {upsertPermissionModule, upsertPermissionOther} from "mutations/upsert";

// </editor-fold>

export default async function (el, name, val) {
    if (val) {
        let {
            item: {id: user_id, data: old_data, data: {permissions_other_list, permissions_module_list}}
        } = this;

        const {list, item, action, oldVal, newVal, onComplete} = val;

        // console.log('onChangePermissions', name, val)
        if (name === 'permissions_other_list') {
            let {id, key, actions} = item;
            upsertPermissionOther({
                id,
                actions,
                key,
                user_id,
                // contractor_user_id,
            }).then(onComplete);
        } else {
            //insertPermissionModule{id, actions, module, user, contractor_user},
            //updatePermissionModule{id, actions_id, module_id, user_id, contractor_user_id}
            let {id, module, actions} = item;
            upsertPermissionModule({
                id,
                actions,
                module,
                user_id,
                // contractor_user_id,
            }).then(onComplete);
        }
    }

};
