import React from "react";
import {observer} from 'mobx-react';

import StatsPanel from './StatsPanel';

import style from "./DashboardTab.lazy.css";

@observer
class DashboardTab extends React.Component {
//    path;
    pageKey = "DashboardTab";

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
//        this.path = props.path + 'reports/';
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    update() {
        this.refs.statsGroup1.update();
        this.refs.statsGroup2.update();
        this.refs.statsGroup3.update();
        this.refs.statsGroup4.update();
    }

    render() {
        return <div className="DashboardTab row margin-0 h-full">
            <StatsGroup ref="statsGroup1" path={this.props.path + 'screening/'} title="Screenings"/>
            <StatsGroup ref="statsGroup2" path={this.props.path + 'positive/'} title="Positive Cases"/>
            <StatsGroup ref="statsGroup3" path={this.props.path + 'vulnerable/'} title="Vulnerable Cases"/>
            <StatsGroup ref="statsGroup4" path={this.props.path + 'return-to-work/'} title="Return To Work Cases"/>
        </div>;
    }
}

@observer
class StatsGroup extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    update() {
        this.refs.statsPanel.update();
    }
    
    render() {
        const {title, path} = this.props;
//        console.log('StatsGroup', charts_annual)
        const id = title.toLowerCase().replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '-');
        return <div className="Statistics StatsGroup bg-white margin-t-10 col-lg-6">
            <label className="text-center padding-5 margin-b-0">{title} Statitistics</label>
            <div className="content">
                <StatsPanel ref="statsPanel" path={path}/>
            </div>
        </div>;
    }
}

export default DashboardTab;
