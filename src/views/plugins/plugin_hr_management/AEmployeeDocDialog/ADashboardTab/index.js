import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import style from "./DashboardTab.lazy.css";
import TopGridCounter from "./TopGridCounter";
import GridReportsLineChart from "./GridReportsLineChart";
import MKBox from "components/MK/MKBox";
import {findDOMNode} from "react-dom";
import {execWhen} from "utils/UtilsFuns";

@observer
class DashboardTab extends React.Component {
    pageKey = "DashboardTab";

    @observable state = {
        data: DATA_LOAD_STATUS.LOADING,
        hidden: false,
    };

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        this.update();
    }

    hide() {
        this.state.hidden = true;
    }

    show() {
        this.state.hidden = false;
    }

    update() {
        const {state} = this;
        state.data = DATA_LOAD_STATUS.LOADING;

        this.props.loadDashboard().then(res => {
            console.log('res', res)
            state.data = res;
        }).catch(err => {
            console.error(err);
            state.data = DATA_LOAD_STATUS.ERROR;
        });
    }

    async getDOMNode() {
        return execWhen(() => findDOMNode(this));
    }

    render() {
        if(this.state.hidden) {
            return null;
        }

        const {hidden} = this.props;
        const {data} = this.state;
        if(isNullable(data) || data === DATA_LOAD_STATUS.LOADING) {
            return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
                <CircularProgress />
            </div>;
        }

        if(data === DATA_LOAD_STATUS.ERROR) {
            return null;
        }

        const {topStats, bottomStats} = data;

        const {
            titlePlural,
            topStatsSize,
            onViewDialog,

            onViewActiveTab, onViewRemovedTab,
            onViewExpired, onViewNoExpiry, onViewMonExpiry, onView2MonExpiry, onView3MonExpiry, onView4MonExpiry,
        } = this.props;

        return <MKBox className="DashboardTab row margin-0 h-full" sx={hidden ? {position: "absolute", zIndex: "-1", top: "-4000px"} : {}}>
            <TopGridCounter
                ref="topStats"
                titlePlural={titlePlural}
                data={topStats.data}
                topStatsSize={topStatsSize}
                onViewActiveTab={onViewActiveTab}
                onViewRemovedTab={onViewRemovedTab}
                onViewExpired={onViewExpired}
                onViewNoExpiry={onViewNoExpiry}
                onViewMonExpiry={onViewMonExpiry}
                onView2MonExpiry={onView2MonExpiry}
                onView3MonExpiry={onView3MonExpiry}
                onView4MonExpiry={onView4MonExpiry}
            />
            <GridReportsLineChart
                ref="gridReportsLineChart"
                data={bottomStats}
                onViewDialog={onViewDialog}
            />
        </MKBox>;
    }
}

export default DashboardTab;
//222