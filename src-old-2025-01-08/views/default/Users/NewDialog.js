// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {ANewDialog} from 'components/dialogs';

import {ControlsContractor, ControlsUser} from './NewDialogControls';

import style from "./NewDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "User";
    title = "Create User";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        const {isNewContractorUser} = this.props;
        if(isNewContractorUser) {
            return ControlsContractor;
        }
        const {isContractor} = storage.is;
        return isContractor ? ControlsContractor : ControlsUser;
    }
}

// </editor-fold>

export default NewDialog;
