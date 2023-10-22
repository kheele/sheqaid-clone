import React from "react";
import {observer} from 'mobx-react';

import ATab from '../ATab';

import style from "../InspectionTab/InspectionTab.lazy.css";
import {Dates} from "utils/Dates";

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
        const listByLogged = sockets.of('inspections').fn('listUpcomingByLogged');

        const today = Dates.formatDateSQL(new Date());

        return listByLogged({
            today,
            //
            name,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
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
