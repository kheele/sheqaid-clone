import React from "react";
import {observer} from 'mobx-react';
//
import Employees from "../Main";

import style from "./EmployeesDialog.lazy.css";
import Dialog from "components/dialogs/Dialog";

@observer
class EmployeesDialog extends React.Component {
    path = {path: 'plugin_sheq_assist/employees/list/search_by', data: null};
    pageKey = "EmployeesDialog";

    constructor(props) {
        super(props);
    }
    
    open(key, value){
        this.path.data = {key, value};
        return new Promise((resolve, reject) => {
            // if(list) {
            //     this.state.defaultList = list;
            // }
            this.refs.dialog.open('Employees (' + value + ')');
            resolve();
        });
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return (<Dialog key={this.pageKey + '-dialog-' + new Date().getTime()} ref="dialog" className={this.pageKey + '-dialog'}>
            <Employees />
        </Dialog>);
    }

}

export default EmployeesDialog;
