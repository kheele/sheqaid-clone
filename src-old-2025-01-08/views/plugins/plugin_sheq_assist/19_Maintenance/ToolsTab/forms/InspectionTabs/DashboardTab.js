import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import MKBox from "components/MK/MKBox";

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {
    pageKey = "DashboardTab";

    @observable state = {
        data: DATA_LOAD_STATUS.LOADING,
        hidden: false,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            item: {
                id, data: {
                    inspection_template_list = [],
                    inspection_list = [],
                    inspection_history_list = [],
                }
            }
        } = this.props;

        return <MKBox className="DashboardTab row margin-0 h-full">
            {/*<TopGridCounter*/}
            {/*  ref="topStats"*/}
            {/*  titlePlural={titlePlural}*/}
            {/*  data={topStats.data}*/}
            {/*  topStatsSize={topStatsSize}*/}
            {/*  onViewActiveTab={onViewActiveTab}*/}
            {/*  onViewRemovedTab={onViewRemovedTab}*/}
            {/*  onViewExpired={onViewExpired}*/}
            {/*  onViewNoExpiry={onViewNoExpiry}*/}
            {/*  onViewMonExpiry={onViewMonExpiry}*/}
            {/*  onView2MonExpiry={onView2MonExpiry}*/}
            {/*  onView3MonExpiry={onView3MonExpiry}*/}
            {/*  onView4MonExpiry={onView4MonExpiry}*/}
            {/*/>*/}
            {/*<GridReportsLineChart*/}
            {/*  ref="gridReportsLineChart"*/}
            {/*  data={bottomStats}*/}
            {/*  onViewDialog={onViewDialog}*/}
            {/*/>*/}
        </MKBox>;
    }
}

//</editor-fold>

export default DashboardTab;
