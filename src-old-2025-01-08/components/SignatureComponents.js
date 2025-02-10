// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Row} from "./FormComponents";
import {Button, ClearableInput, SelectEmployeeInput} from "./inputs";
import Form from "../utils/Form";
// </editor-fold>

//<editor-fold desc="SignatureListRow">
@observer
class SignatureListRow extends React.Component {

    render() {
        const {idx, pluginKey, module, onSetSignatureSettings, onFormOpen, onFormBack} = this.props;
        const {['hasModuleSignatureSettings' + pluginKey]: hasModuleSignatureSettings} = storage.is;
        const hasSignatureSettings = hasModuleSignatureSettings(module);

        return <Row
            rendered
            idx={idx}
            title={`${idx}. Signature List`}
            onFormOpen={onFormOpen}
            onFormBack={onFormBack}
        >
            <RowShow hasSignatureSettings={hasSignatureSettings} pluginKey={pluginKey} module={module}/>
            <RowHide hasSignatureSettings={hasSignatureSettings} onSetSignatureSettings={onSetSignatureSettings}/>
        </Row>;
    }

}

//</editor-fold>

//<editor-fold desc="RowShow">
@observer
class RowShow extends React.Component {

    constructor() {
        super();
        this.form = new Form();
    }

    render() {
        const {hasSignatureSettings} = this.props;
        if (!hasSignatureSettings) return null;

        const {pluginKey, module: _module} = this.props;
        const {['findModuleSignatureSettings' + pluginKey]: findModuleSignatureSettings} = storage.find;
        const signatureSettings = findModuleSignatureSettings(_module);
        const {
            id,
            data: {
                plugin, module,
                is_employee_owning,
                signature_settings_list,
            }
        } = signatureSettings;

        return <>
            {is_employee_owning && <>
                <SelectEmployeeInput ref="signed_by" name="signed_by" placeholder="Signed By..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="signed_by_expiry_date" name="signed_by_expiry_date" type="date" placeholder="Signature Expiry Date..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </>}
            {signature_settings_list && <>

            </>}
        </>;
    }

}

//</editor-fold>

//<editor-fold desc="RowHide">
@observer
class RowHide extends React.Component {

    render() {
        const {hasSignatureSettings, onSetSignatureSettings} = this.props;
        if (hasSignatureSettings) return null;

        return <>
            <p className="text-center font-size-16 margin-t-20 margin-l-10 margin-r-20 padding-10 border-radius-20 bg-eee color_red">
                No Signature Settings have been set for this module
            </p>
            <Button className="btn btn-primary margin-20 w-200 hor-center border-radius-20" text="Signature Settings"
                    onClick={onSetSignatureSettings}/>
        </>;
    }

}

//</editor-fold>

export {
    SignatureListRow
};