import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from 'components/inputs';

import DashboardAll from "./DashboardAll";

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {
//    path;
    pageKey = "DashboardTab";

    @observable state = {
        value: 'DashboardAll'
    };

    constructor(props) {
        super(props);

        this.toggleFilter = this.toggleFilter.bind(this);
    }

    toggleFilter(evt, btn) {
        const {view} = btn.props;
        this.state.value = view;
    }

    update() {
        const {dashboardAll} = this.refs;
        dashboardAll.update();
    }

    render() {
        const {path, onFilter} = this.props;
        const {state} = this;
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            <div className="page-content grid-1 grid-gap-10 nice-scrollbars">
                <DashboardAll ref="dashboardAll" state={state} path={path + "stats"}/>
            </div>
        </div>;
    }
}
//</editor-fold>

export default DashboardTab;
