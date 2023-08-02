import React from "react";
import {observer} from 'mobx-react';

//import NewDialog from '../../common/documents/NewDialog';
//import ProfileDialog from '../../common/documents/ProfileDialog';
//import EditDialog from '../../common/documents/EditDialog';
import ATab from './ATab';

import style from "./RegisterTab.lazy.css";

@observer
class RegisterTab extends React.Component {
    path;
    pageKey = "RegisterTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'register/';
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
            pageTitle: "Registers",
            pageTitleSingular: "register",
            path: this.path,
            permissionKey
        };
        return <div className="row margin-0 pos-absolute flex">
            <ATab {...props}/>
        </div>;
    }
}

export default RegisterTab;
