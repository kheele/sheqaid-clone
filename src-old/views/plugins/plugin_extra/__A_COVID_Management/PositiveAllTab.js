import React from "react";
import {observer} from 'mobx-react';

import NewPositiveDialog from './dialogs/NewPositiveDialog';
//import ProfilePositiveDialog from './dialogs/ProfilePositiveDialog';
import EmployeePositiveDialog from './dialogs/EmployeePositiveDialog';

import ATab from './ATab_1';
import ATabEmployee from './ATabEmployee';

import style from "./PositiveAllTab.lazy.css";

@observer
class PositiveAllTab extends React.Component {
    path;
    pageKey = "PositiveAllTab";

    constructor(props) {
        super(props);

        this.path = props.path;
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Positive Cases (All)",
            pageTitleSingular: "positive case (all)",
            path: this.path,
            permissionKey
        };
        let Elem;
        if(!storage.is.isEmployee) {
            Elem = ATab;
            props.NewDialog = NewPositiveDialog;
            props.EmployeeDialog = EmployeePositiveDialog;
        } else {
            Elem = ATabEmployee;
        }
        return <div className="row margin-0 pos-absolute flex">
            <Elem {...props}/>
        </div>;
    }
}

export default PositiveAllTab;
