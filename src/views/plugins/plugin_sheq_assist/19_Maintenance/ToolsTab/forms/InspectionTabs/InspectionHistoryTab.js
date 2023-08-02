import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import MKBox from "components/MK/MKBox";

//<editor-fold desc="InspectionHistoryTab">
@observer
class InspectionHistoryTab extends React.Component {
    pageKey = "InspectionHistoryTab";

    @observable state = {
        data: DATA_LOAD_STATUS.LOADING,
    };

    constructor(props) {
        super(props);

    }

    render() {
        const {
            item: {
                id, data: {
                    inspection_history_list = [],
                }
            }
        } = this.props;

        return <MKBox className="InspectionHistoryTab row margin-0 h-full">

        </MKBox>;
    }
}

//</editor-fold>

export default InspectionHistoryTab;
