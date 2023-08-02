
class Permissions {
    static hasModule(key) {
        const {selectedClientModules: {list}} = storage.selected;
        return list.anyMatch(v => v.key === key) || defaultOtherPermissions.anyMatch(v => v.key === key);
    }

    static isValidPerm(perm) {
        return perm && Permissions.hasModule(perm.key);
    }

    static isModulePerm(perm) {
        if (!Permissions.isValidPerm(perm))
            return false;
        const {selectedClientModules: {list}} = storage.selected;
        return list.anyMatch(v => v.key === perm.key);
    }

    static isOtherPerm(perm) {
        if (!Permissions.isValidPerm(perm))
            return false;
        return defaultOtherPermissions.anyMatch(v => v.key === perm.key);
    }

    static allow(perm) {
        if (Permissions.isOtherPerm(perm) || Permissions.isModulePerm(perm)) {
//            const {selectedClientModules: {list}} = storage.selected;
            const {isConsultant, isNoProjects} = storage.is;
            const {create, view, edit, remove, share, print} = perm.actions;
//            console.log('allow', perm.key, create || view || edit || remove || share || print)
            return create || view || edit || remove || share || print;
        }

        return false;
    }

    static disallow(perm) {
        if (Permissions.isOtherPerm(perm) || Permissions.isModulePerm(perm)) {
//            const {selectedClientModules: {list}} = storage.selected;
            const {isConsultant, isNoProjects} = storage.is;
            const {create, view, edit, remove, share, print} = perm.actions;
//            console.log('disallow', perm.key, !create && !view && !edit && !remove && !share && !print)
            return !create && !view && !edit && !remove && !share && !print;
        }

        return true;
    }

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
}

export default Permissions;
