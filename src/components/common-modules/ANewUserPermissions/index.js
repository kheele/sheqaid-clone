// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import ANewUserPermissions from "./ANewUserPermissions";
import NewUserModulePermissions from "./NewUserModulePermissions";
import NewUserOtherPermissions from "./NewUserOtherPermissions";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsBySHEQ">
@observer
class NewUserModulePermissionsBySHEQ extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_sheq_assist", plugin: "permissionsSHEQ"});
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsByHR">
@observer
class NewUserModulePermissionsByHR extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_hr_management", plugin: "permissionsHR"});
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsByClaim">
@observer
class NewUserModulePermissionsByClaim extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_claim_management", plugin: "permissionsClaim"});
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewUserModulePermissionsByExtra">
@observer
class NewUserModulePermissionsByExtra extends ANewUserPermissions {
    constructor(props) {
        super(props, {key: "plugin_extra", plugin: "permissionsExtra"});
    }
}

// </editor-fold>

export {
    NewUserModulePermissions,
    NewUserModulePermissionsBySHEQ,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsByClaim,
    NewUserModulePermissionsByExtra,
    NewUserOtherPermissions
};