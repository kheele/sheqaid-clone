import React from "react";
import {observer} from 'mobx-react';

//import NewDialog from '../../common/documents/NewDialog';
//import ProfileDialog from '../../common/documents/ProfileDialog';
//import EditDialog from '../../common/documents/EditDialog';
import ATab from './ATab';

import style from "./InspectionTab.lazy.css";

@observer
class InspectionTab extends React.Component {
    path;
    pageKey = "InspectionTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'inspection/';
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
            pageTitle: "Inspections",
            pageTitleSingular: "inspection",
            path: this.path,
            type: "Inspection",
            permissionKey
        };
        return <div className="row margin-0 pos-absolute flex">
            <ATab {...props}/>
        </div>;
    }
}

export default InspectionTab;
