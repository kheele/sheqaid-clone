import React from "react";
import {observer} from 'mobx-react';

import ATab from '../ATab';

import style from "../InspectionTab/InspectionTab.lazy.css";

@observer
class InspectionTab extends React.Component {
    pageKey = "InspectionTab";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {item, permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Inspections",
            pageTitleSingular: "inspection",
            type: "Inspection",
            fn: 'listUpcomingByLogged',
            item,
            permissionKey,
            isUpcoming: true,
        };
        return <ATab {...props}/>;
    }
}

export default InspectionTab;
