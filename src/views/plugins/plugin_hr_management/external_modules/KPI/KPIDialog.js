import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../ADialogList";

import Main from 'views/plugins/plugin_sheq_assist/06_Communication_And_Participation/Main';

import style from "./KPIDialog.lazy.css";

@observer
class KPIDialog extends ADialogList {
    pageKey = "KPIDialog";
    title = "KPI";
    
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
        return <Main permissionKey="KPI" type="KPI"/>;
    }

}

export default KPIDialog;
