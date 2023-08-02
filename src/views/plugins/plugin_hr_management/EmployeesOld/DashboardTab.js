import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Clickable} from 'components/inputs';
import {RenderDashboardButtonsForExpiryOnly} from 'utils/ComponentUtils';

import CountUtils, {
    onCountActiveEmployees,
    onCountDepartments,
    onCountJobPositions,
    onCountRemovedEmployees,
    onCountSupervisors,
    onCountTeams
} from '../CountUtils';

import style from "./DashboardTab.lazy.css";

@observer
class DashboardTab extends React.Component {
    pageKey = "DashboardTab";

    constructor(props) {
        super(props);
        
        this.update = this.update.bind(this);

        this.renderTile = this.renderTile.bind(this);        
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    update() {
        
    }
    
    renderTile({key, compRef, text, titleBG, noExpiry}) {
        const {onViewDialog} = this.props;
        const onCount = CountUtils['onCount' + key];
        return <Tile key={key} compRef={compRef} className="bg-white" countClassName={`color-white ${titleBG}`} title={text} onCount={onCount} onClick={onViewDialog}>
            {!noExpiry && <RenderDashboardButtonsForExpiryOnly onCount={onCount}/>}
        </Tile>;
    }
    
    @computed
    get tiles() {
        return this.props.elements.filter(({c}) => c === 'allowed').map(this.renderTile);
    }
    
    render() {
        const {
            onViewActiveTab,
            onViewRemovedTab,
            
            onViewTeams,
            onViewDepartments,
            onViewJobPositions,  
            onViewSupervisors
        } = this.props;
        
        const {loggedUser} = storage;
        const {isContractor, isContractorView} = storage.is;
        
        return <div className="DashboardTab row margin-0 h-full">
            <div className="stats-count grid-6 grid-gap-10 margin-b-10">
                <Tile className="bg-8b5d5d" titleClassName="color-white" countClassName="bg-white color-8b5d5d" title="Active Employees" onCount={onCountActiveEmployees} onClick={onViewActiveTab}/>
                <Tile className="bg-645d8b" titleClassName="color-white" countClassName="bg-white color-645d8b" title="Removed Employees" onCount={onCountRemovedEmployees} onClick={onViewRemovedTab}/>
                <Tile className="bg-5d8b63" titleClassName="color-white" countClassName="bg-white color-5d8b63" title="Teams" onCount={onCountTeams} onClick={onViewTeams}/>
                <Tile className="bg-9f4287" titleClassName="color-white" countClassName="bg-white color-9f4287" title="Departments" onCount={onCountDepartments} onClick={onViewDepartments}/>
                <Tile className="bg-7a7a7a" titleClassName="color-white" countClassName="bg-white color-7a7a7a" title="Job Positions" onCount={onCountJobPositions} onClick={onViewJobPositions}/>
                <Tile className="bg-b9a519" titleClassName="color-white" countClassName="bg-white color-b9a519" title="Supervisors" onCount={onCountSupervisors} onClick={onViewSupervisors}/>
            </div>
            
            <div className="stats-count grid-4 grid-gap-10 margin-b-10">
                {this.tiles}
            </div>
        </div>;
    }
}

@observer
class Tile extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        const {className, titleClassName = '', countClassName = '', compRef, title, count, onClick, onCount, children} = this.props;
        return <div className={`Tile flex-center grid-1 grid-gap-10 padding-10 border-radius-3 ${className}`}>
                <h4 className={`margin-0 font-size-15 ${titleClassName}`}>{title}</h4>
                <TileCounter countClassName={countClassName} compRef={compRef} onCount={onCount} onClick={onClick}/>
                {children}
            </div>;
    }
}

@observer
class TileCounter extends React.Component {
    @observable state = {
        count: null
    };
    
    componentDidMount() {
        const {onCount} = this.props;
        onCount('ALL').then(count => {
            this.state.count = count;
            console.log('TileCounter', count)
        });
    }
    
    @computed get count() {
        return this.state.count;
    }
    
    render() {
        const {compRef, onClick, countClassName} = this.props;
        const {count} = this;
        const className = count ? 'loaded' : 'loading';
        return <Clickable compRef={compRef} onClick={onClick}>
            <div className={`Counter w-90 h-90 padding-0 circled margin-auto font-size-26 flex-center grid-1 border-radius-3 ${className} ${countClassName}`}>
                {count}
            </div>
        </Clickable>;
    }
}

export default DashboardTab;
//222