import React from "react";
import {observer} from 'mobx-react';

import Dashboard from "components/dashboards/Dashboard";
import {execWhen} from "utils/UtilsFuns";
import * as Grids from "./Stats";

//<editor-fold desc="DashboardAll">
@observer
class DashboardAll extends React.Component {
    key = 'DashboardAll';

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
            path="employees/docs/leaves"
            onClick={onClick}
            {...Grids}
            noEmployees
        />;
    }

}

//</editor-fold>

export default DashboardAll;
