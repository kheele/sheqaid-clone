class Permissions {
    //<editor-fold desc="hasModule, isValidPerm, isModulePerm, isOtherPerm">
    static hasModule(key) {
        const {
            selected: {selectedClientModules: {list: module_list}},
            list: {permissionOtherKeys}
        } = storage;
        return module_list.anyMatch(({key: __key, module}) => {
                if (module) return module.key === key;
                return __key === key;
            }) ||
            permissionOtherKeys.anyMatch(({id, value}) => value === key);
    }

    static isValidPerm(perm) {
        if (!perm) return false;
        if (perm.module || (perm.key && !perm.key.value)) {
            return Permissions.hasModule(perm.module.key);
        } else if (perm.key && perm.key.value) {
            return Permissions.hasModule(perm.key.value);
        }
    }

    static isModulePerm(perm) {
        if (!Permissions.isValidPerm(perm))
            return false;
        const {selectedClientModules: {list: module_list}} = storage.selected;
        return (perm.module || perm.key) && module_list.anyMatch(({key: __key, module}) => {
            const key = perm.key || perm.module.key;
            if (module) return module.key === key;
            return __key === key;
        });
    }

    static isOtherPerm(perm) {
        if (!Permissions.isValidPerm(perm))
            return false;
        const {list: {permissionOtherKeys}} = storage;
        return perm.key && permissionOtherKeys.anyMatch(({id, value}) => value === perm.key.value);
    }

    //</editor-fold>

    //<editor-fold desc="allow, disallow">
    static allow(perm) {
        if (perm && (Permissions.isOtherPerm(perm) || Permissions.isModulePerm(perm))) {
//            const {selectedClientModules: {list}} = storage.selected;
            const {isConsultant, isNoProjects} = storage.is;
            const {create, view, edit, remove, share, print} = perm.actions;
//            console.log('allow', perm.key, create || view || edit || remove || share || print)
            return create || view || edit || remove || share || print;
        }

        return false;
    }

    static disallow(perm) {
        if (perm && (Permissions.isOtherPerm(perm) || Permissions.isModulePerm(perm))) {
//            const {selectedClientModules: {list}} = storage.selected;
            const {isConsultant, isNoProjects} = storage.is;
            const {create, view, edit, remove, share, print} = perm.actions;
//            console.log('disallow', perm.key, !create && !view && !edit && !remove && !share && !print)
            return !create && !view && !edit && !remove && !share && !print;
        }

        return true;
    }

    //</editor-fold>

    //<editor-fold desc="allowType, disallowType">
    static allowType(perm, type) {
        if (Permissions.isOtherPerm(perm) || Permissions.isModulePerm(perm)) {
//            const {selectedClientModules: {list}} = storage.selected;
            const {isConsultant, isNoProjects} = storage.is;
//            console.log('allowType', perm.key, type, perm.actions[type])
            return perm.actions[type];
        }

        return false;
    }

    static disallowType(perm, type) {
        return !Permissions.allowType(perm, type);
    }

    //</editor-fold>

    //<editor-fold desc="allow*">
    static allowCreate(perm) {
        return Permissions.allowType(perm, "create");
    }

    static allowView(perm) {
        return Permissions.allowType(perm, "view");
    }

    static allowEdit(perm) {
        return Permissions.allowType(perm, "edit");
    }

    static allowRemove(perm) {
        return Permissions.allowType(perm, "remove");
    }

    static allowShare(perm) {
        return Permissions.allowType(perm, "share");
    }

    static allowPrint(perm) {
        return Permissions.allowType(perm, "print");
    }

    //</editor-fold>

    //<editor-fold desc="disallow*">
    static disallowCreate(perm) {
        return Permissions.disallowType(perm, "create");
    }

    static disallowView(perm) {
        return Permissions.disallowType(perm, "view");
    }

    static disallowEdit(perm) {
        return Permissions.disallowType(perm, "edit");
    }

    static disallowRemove(perm) {
        return Permissions.disallowType(perm, "remove");
    }

    static disallowShare(perm) {
        return Permissions.disallowType(perm, "share");
    }

    static disallowPrint(perm) {
        return Permissions.disallowType(perm, "print");
    }

    //</editor-fold>

    //<editor-fold desc="allowOther, allowMod, disallowOther, disallowMod">
    static allowOther(key) {
        if (!key) return;
        const {permissions_other_list} = storage.loggedUser.user.data;
        const perm = (permissions_other_list || []).find(({key: {value}}) => value === key);
        return Permissions.allow(perm);
    }

    static allowMod(key) {
        if (!key) return;
        const {permissions_module_list} = storage.loggedUser.user.data;
        const perm = (permissions_module_list || []).find(({key: __key, module}) => {
            if (module) return module.key === key;
            return __key === key;
        });
        return Permissions.allow(perm);
    }

    static disallowOther(key) {
        if (!key) return;
        const {permissions_other_list} = storage.loggedUser.user.data;
        const perm = (permissions_other_list || []).find(({key: {value}}) => value === key);
        return Permissions.disallow(perm);
    }

    static disallowMod(key) {
        if (!key) return;
        const {permissions_module_list} = storage.loggedUser.user.data;
        const perm = (permissions_module_list || []).find(({key: __key, module}) => {
            if (module) return module.key === key;
            return __key === key;
        });
        return Permissions.disallow(perm);
    }

    //</editor-fold>

    //<editor-fold desc="allowTypeOther, disallowTypeOther, allowTypeMod, disallowTypeMod">
    static allowTypeOther(key, type) {
        if (!key) return;
        const {permissions_other_list} = storage.loggedUser.user.data;
        const perm = (permissions_other_list || []).find(({key: {value}}) => value === key);
        return Permissions.allowType(perm, type);
    }

    static disallowTypeOther(key, type) {
        if (!key) return;
        return !Permissions.allowTypeOther(key, type);
    }

    static allowTypeMod(key, type) {
        if (!key) return;
        const {permissions_module_list} = storage.loggedUser.user.data;
        // console.log('allowTypeMod', key, type);
        const perm = (permissions_module_list || []).find(({key: __key, module}) => {
            if (module) return module.key === key;
            return __key === key;
        });
        // console.log('allowTypeMod perm', perm);
        return Permissions.allowType(perm, type);
    }

    static disallowTypeMod(key, type) {
        if (!key) return;
        return !Permissions.allowTypeMod(key, type);
    }

    //</editor-fold>

    //<editor-fold desc="allow*Other">
    static allowCreateOther(key) {
        return Permissions.allowTypeOther(key, "create");
    }

    static allowViewOther(key) {
        return Permissions.allowTypeOther(key, "view");
    }

    static allowEditOther(key) {
        return Permissions.allowTypeOther(key, "edit");
    }

    static allowRemoveOther(key) {
        return Permissions.allowTypeOther(key, "remove");
    }

    static allowShareOther(key) {
        return Permissions.allowTypeOther(key, "share");
    }

    static allowPrintOther(key) {
        return Permissions.allowTypeOther(key, "print");
    }

    //</editor-fold>

    //<editor-fold desc="disallow*Other">
    static disallowCreateOther(key) {
        return Permissions.disallowTypeOther(key, "create");
    }

    static disallowViewOther(key) {
        return Permissions.disallowTypeOther(key, "view");
    }

    static disallowEditOther(key) {
        return Permissions.disallowTypeOther(key, "edit");
    }

    static disallowRemoveOther(key) {
        return Permissions.disallowTypeOther(key, "remove");
    }

    static disallowShareOther(key) {
        return Permissions.disallowTypeOther(key, "share");
    }

    static disallowPrintOther(key) {
        return Permissions.disallowTypeOther(key, "print");
    }

    //</editor-fold>

    //<editor-fold desc="allow*Mod">
    static allowCreateMod(key) {
        return Permissions.allowTypeMod(key, "create");
    }

    static allowViewMod(key) {
        return Permissions.allowTypeMod(key, "view");
    }

    static allowEditMod(key) {
        return Permissions.allowTypeMod(key, "edit");
    }

    static allowRemoveMod(key) {
        return Permissions.allowTypeMod(key, "remove");
    }

    static allowShareMod(key) {
        return Permissions.allowTypeMod(key, "share");
    }

    static allowPrintMod(key) {
        return Permissions.allowTypeMod(key, "print");
    }

    //</editor-fold>

    //<editor-fold desc="disallow*Mod">
    static disallowCreateMod(key) {
        return Permissions.disallowTypeMod(key, "create");
    }

    static disallowViewMod(key) {
        return Permissions.disallowTypeMod(key, "view");
    }

    static disallowEditMod(key) {
        return Permissions.disallowTypeMod(key, "edit");
    }

    static disallowRemoveMod(key) {
        return Permissions.disallowTypeMod(key, "remove");
    }

    static disallowShareMod(key) {
        return Permissions.disallowTypeMod(key, "share");
    }

    static disallowPrintMod(key) {
        return Permissions.disallowTypeMod(key, "print");
    }

    //</editor-fold>

}

export default Permissions;
