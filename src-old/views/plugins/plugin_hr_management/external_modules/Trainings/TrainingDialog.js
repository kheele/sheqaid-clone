import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../ADialogList";

import Main from '../../../plugin_sheq_assist/05_Training/Main';

import style from "./TrainingDialog.lazy.css";

@observer
class TrainingDialog extends ADialogList {
    pageKey = "TrainingDialog";
    title = "Training";
    
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    renderPage() {
        const {onLoadList, isRemoved} = this.props;
        return <Main permissionKey="05_Training"/>;
    }

}

export default TrainingDialog;
