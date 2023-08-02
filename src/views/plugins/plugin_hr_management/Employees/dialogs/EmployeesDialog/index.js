import React from "react";
import {observer} from 'mobx-react';
//
import Employees from "../../Main";

import style from "./EmployeesDialog.lazy.css";
import Dialog from "components/dialogs/Dialog";
import {computed, observable} from "mobx";
import {Button} from "components/inputs";

@observer
class EmployeesDialog extends React.Component {
    path = {path: 'plugin_sheq_assist/employees/list/search_by', data: null};
    pageKey = "EmployeesDialog";

    @observable
    state = {
        list: [],
    }

    constructor(props) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }
    
    open({list, title}){
        return new Promise((resolve, reject) => {
            this.state.list = list;
            this.refs.dialog.open(title);
            resolve();
        });
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} shouldRender={false} className="btn btn-primary cancel" onClick={this.onCancel}>
                <i className="fa fa-times icon-left"/>Cancel
            </Button>
        </React.Fragment>;
    }

    close() {
        const {dialog} = this.refs;
        dialog && dialog.close();
    }

    onCancel(e, btn) {
        this.close();
    }

    render() {
        return (<Dialog
            key={this.pageKey + '-dialog-' + new Date().getTime()}
            ref="dialog"
            className={this.pageKey + '-dialog'}
            topButtons={this.topButtons}
            onCancel={this.onCancel}
            dialog={this}
        >
            <Comp state={this.state}/>
        </Dialog>);
    }

}

@observer
class Comp extends React.Component {
    render() {
        const {state: {list}} = this.props;
        if(list.isEmpty()) return null;

        return <Employees permissionKey="Employees" excludeDashboard excludeRemoved list={list}/>;
    }
}

export default EmployeesDialog;
