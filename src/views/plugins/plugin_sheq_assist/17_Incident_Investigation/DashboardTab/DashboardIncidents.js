import React from "react";
import {observer} from 'mobx-react';

import Dashboard from "components/dashboards/Dashboard";
import {execWhen} from "utils/UtilsFuns";
import * as Grids from "./Stats";

//<editor-fold desc="DashboardIncidents">
@observer
class DashboardIncidents extends React.Component {
    key = 'DashboardIncidents';

    constructor(props) {
        super(props);
    }

    update() {
        execWhen(() => this.refs.dashboard).then(ref => {
            ref.update();
        });
    }

    render() {
        const {onClick} = this.props;
        return <Dashboard
            ref="dashboard"
            path="incidents"
            onClick={onClick}
            {...Grids}
            noEmployees
        />;
    }

}

//</editor-fold>

export default DashboardIncidents;
