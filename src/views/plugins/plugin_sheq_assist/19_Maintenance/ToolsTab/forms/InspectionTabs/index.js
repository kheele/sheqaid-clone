import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Tabs} from "components/tabs";
import DashboardTab from "./DashboardTab";
// import InspectionsScheduleTab from "./InspectionsScheduleTab";
// import InspectionTemplateTab from "./InspectionTemplateTab";
// import InspectionHistoryTab from "./InspectionHistoryTab";
import TemplatesTab from "views/plugins/plugin_sheq_assist/Inspections/TemplatesTab";
import InspectionTodayTab from "views/plugins/plugin_sheq_assist/Inspections/InspectionTodayTab";
import InspectionUnansweredTab from "views/plugins/plugin_sheq_assist/Inspections/InspectionUnansweredTab";
import InspectionUpcomingTab from "views/plugins/plugin_sheq_assist/Inspections/InspectionUpcomingTab";
import InspectionsActiveTab from "views/plugins/plugin_sheq_assist/Inspections/InspectionsActiveTab";
import InspectionsCompletedTab from "views/plugins/plugin_sheq_assist/Inspections/InspectionsCompletedTab";

// <editor-fold defaultstate="collapsed" desc="TabWrapper">
@observer
class TabWrapper extends React.Component {

    @observable
    state = {
        index: 0,
        sliderIndex: null,
    };

    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onCarouselChange = this.onCarouselChange.bind(this);
        this.updateDashboard = this.updateDashboard.bind(this);
        this.moveToSlide = this.moveToSlide.bind(this);
    }

    componentDidMount() {
        this.onChange(this.props.tabIndex || 0);
    }

    onChange(index) {
        const {state, props: {onChange}} = this;
        state.index = index;
        onChange && onChange(index);
    }

    onCarouselChange(index) {
        this.state.sliderIndex = index;
    }

    get index() {
        return this.state.index;
    }

    @computed get sliderIndex() {
        return this.state.sliderIndex;
    }

    updateDashboard() {
        setTimeout(() => {
            const ref = this.refs.mainTabs.getTabByRef("dashboard");
            ref && ref.update();
        });
    }

    moveToSlide(index) {
        setTimeout(() => {
            const ref = this.refs.mainTabs.getTabByRef("slider");
            ref && ref.move(index);
        });
    }

    render() {
        const {
            permissionKey,
            tabsHeight,
            isEmbedded,
            item, item: {
                id, data: {
                    inspection_template_list = [],
                    inspection_list = [],
                }
            }
        } = this.props;

        const {isEmployee} = storage.is;

        return (<Tabs
            key="tabs"
            ref="mainTabs"
            tabsHeight={tabsHeight}
            permissionKey={permissionKey}
            index={this.state.index}
            className={isEmbedded ? "Embedded-Tabs" : ""}
            onChange={this.onChange}
        >
            {/*<DashboardTab*/}
            {/*	ref="dashboardTab"*/}
            {/*	title="Dashboard"*/}
            {/*	item={item}*/}
            {/*	topStatsSize={120}*/}
            {/*/>*/}

            <InspectionTodayTab ref="inspectionTodayTab" title="Today's" item={item}/>
            <InspectionUnansweredTab ref="inspectionUnansweredTab" title="Unanswered" item={item}/>
            <InspectionUpcomingTab ref="inspectionUpcomingTab" title="Upcoming" item={item}/>
            <InspectionsActiveTab ref="inspectionsActiveTab" title="Active" item={item}/>
            <InspectionsCompletedTab ref="inspectionsCompletedTab" title="Completed" item={item}/>
            {!isEmployee && <TemplatesTab ref="forms" title="Templates" item={item}/>}
        </Tabs>);
    }
}

// </editor-fold>

export default TabWrapper;
