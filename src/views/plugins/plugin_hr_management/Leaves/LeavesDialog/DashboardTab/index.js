import React from "react";
import {observer} from 'mobx-react';

import style from "./DashboardTab.lazy.css";
import DashboardAll from "./DashboardAll";
import {PageTitle} from "../../../../../../components";

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {
    pageKey = "DashboardTab";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    update() {
        const {dashboardAll} = this.refs;
        dashboardAll.update();
    }

    render() {
        const {path, onFilter, renderTopActions, onClick} = this.props;
        const {state} = this;
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            {renderTopActions && <PageTitle>
                {renderTopActions}
            </PageTitle>}
            <div className="page-content grid-1 grid-gap-10 nice-scrollbars">
                <DashboardAll ref="dashboardAll" state={state} path={path + "stats"} onClick={onClick}/>
            </div>
        </div>;
    }
}

//</editor-fold>

export default DashboardTab;
