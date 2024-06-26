// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {
    NewUserModulePermissionsByClaim,
    NewUserModulePermissionsByExtra,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsBySHEQ,
    NewUserOtherPermissions
} from 'components/common-modules/ANewUserPermissions';
import {FormControls, Row} from "components/FormComponents";
import {Button} from "components/inputs";
import {Permissions} from "utils/Utils";

// </editor-fold>

@observer
class PermissionsRow extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (Permissions.disallowOther("Permissions")) {
            return null;
        }

        const {
            idx,
            onFormOpen,
            onFormBack,
            onFormNext,
            permissions_module_list,
            permissions_other_list,
            onSelectAllModulePermissions,
            onClearAllModulePermissions,
            onSelectAllOtherPermissions,
            onClearAllOtherPermissions,
            onChange,
        } = this.props;

        return <Row
            rendered
            idx={'Permissions'}
            title={`${idx}. Permissions`}
            onFormOpen={onFormOpen}
            onFormBack={onFormBack}
        >
            <FormControls>
                <Row
                    rendered
                    idx={'SHEQManagementModulePermissions'}
                    title={idx + ".1. SHEQ Management Module Permissions"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                            text="Select All"
                            actionRef="NewUserModulePermissionsBySHEQ" onClick={onSelectAllModulePermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                            actionRef="NewUserModulePermissionsBySHEQ" onClick={onClearAllModulePermissions}/>
                    <hr className="pull-left"/>
                    <NewUserModulePermissionsBySHEQ
                        ref="NewUserModulePermissionsBySHEQ"
                        name="permissions_modules_sheq"
                        selectedList={permissions_module_list}
                        onChange={onChange}
                    />
                </Row>
                <Row
                    rendered
                    idx={'HRManagementModulePermissions'}
                    title={idx + ".2. HR Management Module Permissions"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                            text="Select All"
                            actionRef="NewUserModulePermissionsByHR" onClick={onSelectAllModulePermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                            actionRef="NewUserModulePermissionsByHR" onClick={onClearAllModulePermissions}/>
                    <hr className="pull-left"/>
                    <NewUserModulePermissionsByHR ref="NewUserModulePermissionsByHR" name="permissions_modules_hr"
                                                  selectedList={permissions_module_list}
                                                  onChange={onChange}/>
                </Row>
                <Row
                    rendered
                    idx={'ClaimManagementModulePermissions'}
                    title={idx + ".3. Claims Management Module Permissions"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                            text="Select All"
                            actionRef="NewUserModulePermissionsByClaim"
                            onClick={onSelectAllModulePermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                            actionRef="NewUserModulePermissionsByClaim" onClick={onClearAllModulePermissions}/>
                    <hr className="pull-left"/>
                    <NewUserModulePermissionsByClaim ref="NewUserModulePermissionsByClaim"
                                                     name="permissions_modules_claims"
                                                     selectedList={permissions_module_list}
                                                     onChange={onChange}/>
                </Row>
                <Row
                    rendered
                    idx={'ExtraModulePermissions'}
                    title={idx + ".4. Extra Module Permissions"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                            text="Select All"
                            actionRef="NewUserModulePermissionsByExtra"
                            onClick={onSelectAllModulePermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                            actionRef="NewUserModulePermissionsByExtra" onClick={onClearAllModulePermissions}/>
                    <hr className="pull-left"/>
                    <NewUserModulePermissionsByExtra ref="NewUserModulePermissionsByExtra"
                                                     name="permissions_modules_extra"
                                                     selectedList={permissions_module_list}
                                                     onChange={onChange}/>
                </Row>
                <Row
                    rendered
                    idx={'OtherPermissions'}
                    title={idx + ".5. Other Permissions"}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                            text="Select All"
                            onClick={onSelectAllOtherPermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                            onClick={onClearAllOtherPermissions}/>
                    <hr className="pull-left"/>
                    <NewUserOtherPermissions
                        ref="otherPermissionsRef"
                        name="permissions_other_list"
                        selectedList={permissions_other_list}
                        onChange={onChange}
                    />
                </Row>
            </FormControls>
        </Row>;
    }

    // </editor-fold>
}

export default PermissionsRow;
