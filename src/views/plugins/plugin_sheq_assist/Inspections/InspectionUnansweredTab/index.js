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
        const {item: asset} = this.props;
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        const today = Dates.formatDateSQL(new Date());

        const listByLogged = sockets.of('inspections').fn('listUnansweredByLogged');

        return listByLogged({
            asset_id: asset && asset.id,
            //
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
        const {item, permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Inspections",
            pageTitleSingular: "inspection",
            onLoadList: this.onLoadList,
            type: "Inspection",
            item,
            permissionKey,
            unanswered: true,
        };
        return <ATab {...props}/>;
    }
}

export default InspectionTab;
