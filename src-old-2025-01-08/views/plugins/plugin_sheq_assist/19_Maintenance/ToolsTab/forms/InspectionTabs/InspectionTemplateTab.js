import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import MKBox from "components/MK/MKBox";

//<editor-fold desc="InspectionTemplateTab">
@observer
class InspectionTemplateTab extends React.Component {
    pageKey = "InspectionTemplateTab";
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
                    inspection_template_list = [],
                }
            }
        } = this.props;

        return <MKBox className="InspectionHistoryTab row margin-0 h-full">

        </MKBox>;
    }
}

//</editor-fold>

export default InspectionTemplateTab;
