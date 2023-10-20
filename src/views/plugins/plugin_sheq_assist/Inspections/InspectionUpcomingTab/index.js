import React from "react";
import {observer} from 'mobx-react';

import ATab from '../ATab';

import style from "../InspectionTab/InspectionTab.lazy.css";
import byLogged from "./Query/List/listAllInspectionByLogged";

@observer
class InspectionTab extends React.Component {
    pageKey = "InspectionTab";

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        const limit = 50;

        const args = {
            name,
            //
            limit,
            //
            exact_orgs: true,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    render() {
        const {permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Inspections",
            pageTitleSingular: "inspection",
            onLoadList: this.onLoadList,
            type: "Inspection",
            permissionKey,
            isUpcoming: true,
        };
        return <ATab {...props}/>;
    }
}

export default InspectionTab;
