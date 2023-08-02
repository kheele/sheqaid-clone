// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';

import {ProfileField, UploadButton} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../components/dialogs';

import style from "./ProfilePartCostAndReceiptDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfilePartCostAndReceiptDialog extends AProfileDialog {
    pageKey = "ProfilePartCostAndReceiptDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Asset Part Cost & Receipt";
    }

    //
    // get topButtonsHiddenDelete() {
    //     return true;
    // }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
    }

    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            item: {
                //1. Details
                cost,
                receipt
            }
        } = this;

        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={1}
                title="Details"
            >
                <ProfileField ref="cost" name="cost" title="Cost" value={cost}
                              className="col-lg-12"/>

                <UploadButton name="receipt" className="" buttonTitle="Receipt Document"
                              type={['Photo', 'PDF', 'Word']}
                              showOnlyIcon
                              defaultValue={receipt}
                              className="col-lg-12"
                              readonly
                />
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default ProfilePartCostAndReceiptDialog;
