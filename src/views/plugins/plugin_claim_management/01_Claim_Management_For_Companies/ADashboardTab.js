import React from "react";
import {observer} from 'mobx-react';

import StatsPanel from './StatsPanel';

@observer
class ADashboardTab extends React.Component {

    constructor(props, style) {
        super(props);
        
        this.style = style;

        this.update = this.update.bind(this);
    }

    componentWillMount() {
        this.style.use();
    }

    componentWillUnmount() {
        this.style.unuse();
    }
    
    update() {
//        this.refs.statsGroup1.update();
//        this.refs.statsGroup2.update();
//        this.refs.statsGroup3.update();
//        this.refs.statsGroup4.update();
    }

    render() {
        return <div className={this.className + " ADashboardTab row margin-0 h-full"}>
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

export default ADashboardTab;
