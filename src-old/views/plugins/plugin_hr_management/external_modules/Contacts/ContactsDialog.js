import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../ADialogList";

import Main from '../../../plugin_sheq_assist/16_Emergency_Preparedness/Main';

import style from "./ContactsDialog.lazy.css";

@observer
class ContactsDialog extends ADialogList {
    pageKey = "ContactsDialog";
    title = "Contacts";
    
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
        return <Main permissionKey="Contacts" type="Contacts"/>;
    }

}

export default ContactsDialog;
