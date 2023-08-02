// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';

import {ClearableInput, UploadButton} from 'components/inputs';
import {AControls, FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewPartCostAndReceiptDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewPartCostAndReceiptDialog extends ANewDialog {
    pageKey = "NewPartCostAndReceiptDialog";
    title = "Create/Edit Asset Part Cost & Receipt";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends AControls {

    // <editor-fold defaultstate="collapsed" desc="mounts">
    get title() {
        return this.item ? 'Edit Asset Part Cost & Receipt' : 'Create Asset Part Cost & Receipt';
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const data = super.onSubmit(e, btn, onSaved);

        console.log(data)

        onSaved(data);
        this.props.close();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={1}
                title="Details"
            >
                <ClearableInput ref="cost" name="cost" type="number" placeholder="Cost"
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <UploadButton name="receipt" type=""buttonTitle="Receipt Document"
                              type={['Photo', 'PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-6"
                              onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewPartCostAndReceiptDialog;
//110