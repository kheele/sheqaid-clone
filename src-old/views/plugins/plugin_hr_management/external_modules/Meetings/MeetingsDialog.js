import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../ADialogList";

import Main from '../../../plugin_sheq_assist/06_Communication_And_Participation/Main';

import style from "./MeetingsDialog.lazy.css";

@observer
class MeetingsDialog extends ADialogList {
    pageKey = "MeetingsDialog";
    title = "Meetings";
    
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
        return <Main permissionKey="Meetings" type="Meetings"/>;
    }

}

export default MeetingsDialog;
