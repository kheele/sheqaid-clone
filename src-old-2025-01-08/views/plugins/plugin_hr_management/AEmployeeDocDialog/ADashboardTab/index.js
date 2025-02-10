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
import {TabledTopPanel} from "components/tables";
import {Button} from "components/inputs";

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
            console.log('loadDashboard res', res)
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
        if (this.state.hidden) {
            return null;
        }

        const {hidden} = this.props;
        const {data} = this.state;
        if (isNullable(data) || data === DATA_LOAD_STATUS.LOADING) {
            return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
                <CircularProgress/>
            </div>;
        }

        if (data === DATA_LOAD_STATUS.ERROR) {
            return null;
        }

        const {topStats, bottomStats} = data;

        const {
            titlePlural,
            topStatsSize,
            hasSignatures,
            onViewDialog,
            onNewDialog,
            onSignatures,
            onExport,

            renderTopActions,

            onViewActiveTab, onViewRemovedTab,
            onViewExpired, onViewNoExpiry, onViewMonExpiry, onView2MonExpiry, onView3MonExpiry, onView4MonExpiry,
        } = this.props;

        const {isContractorViewVisited, isEmployee} = storage.is;

        return <MKBox className="DashboardTab row margin-0 h-full">
            <MKBox key="pageTitle" className="page-title" sx={{position: 'absolute', top: '-92px', right: '10px'}}>
                <TabledTopPanel ref="tabledTopPanel">
                    <Button
                        ref="buttonCreate"
                        key="buttonCreate"
                        shouldRender={!isEmployee && !isContractorViewVisited}
                        className="btn btn-primary pull-right top-btn-nav__create"
                        onClick={onNewDialog}
                    >
                        <i key="buttonCreateIcon" className="fa fa-plus icon-left"/>Create
                    </Button>
                    <Button className="btn btn-primary pull-right" onClick={onExport}>
                        Export
                    </Button>
                    {hasSignatures && <Button className="btn btn-primary pull-right" onClick={onSignatures}>
                        Signatures
                    </Button>}
                    {renderTopActions}
                </TabledTopPanel>
            </MKBox>
            <TopGridCounter
                ref="topStats"
                titlePlural={titlePlural}
                data={topStats}
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
