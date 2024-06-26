import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Clickable} from 'components/inputs';

import style from "./DashboardTab.lazy.css";
import TopGridCounter from "./TopGridCounter";
import GridGraphsVerticalBarChart from "./GridGraphsVerticalBarChart";
import siteStore from "mutations/all/Site";
import projectStore from "mutations/all/Project";
import clientStore from "mutations/all/Client";
import companyStore from "mutations/all/Company";
import {CircularProgress} from "@mui/material";
import contractorStore from "../../../../../mutations/all/Contractor";

@observer
class DashboardTab extends React.Component {
    pageKey = "DashboardTab";

    @observable state = {
        data: DATA_LOAD_STATUS.LOADING,
    };

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
        this.load = this.load.bind(this);
    }

    @computed get tiles() {
        return this.props.elements.filter(({c}) => c === 'allowed');
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const {state} = this;
        state.data = DATA_LOAD_STATUS.LOADING;

        this.load().then(res => {
            console.log('res', res && res.data)
            if (res) {
                state.data = res.data || res;
            }
        }).catch(err => {
            console.error(err);
            state.data = DATA_LOAD_STATUS.ERROR;
        });
    }

    load() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractorView} = storage.is;
        if (isContractorView) {
            const {is: {isContractor,}, loggedContractor} = storage;
            let {selectedContractorSite, selectedContractorClient} = storage.selected;

            return contractorStore.findByIdHRDashboardStatsByLogged(loggedContractor);
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRDashboardStatsByLogged();
            }
        }
    };

    render() {
        const {data} = this.state;
        if (isNullable(data) || data === DATA_LOAD_STATUS.LOADING) {
            return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
                <CircularProgress/>
            </div>;
        }

        if (data === DATA_LOAD_STATUS.ERROR) {
            return null;
        }

        const {
            onViewDialog,
            onViewActiveTab, onViewRemovedTab,
            onViewTeams, onViewDepartments, onViewJobPositions, onViewJobCategories, onViewSupervisors
        } = this.props;

        console.log('this.tiles', this.tiles);

        return <div className="DashboardTab row margin-0 h-full">
            <TopGridCounter
                ref="topStats"
                data={data}
                onViewActiveTab={onViewActiveTab}
                onViewRemovedTab={onViewRemovedTab}
                onViewTeams={onViewTeams}
                onViewDepartments={onViewDepartments}
                onViewJobPositions={onViewJobPositions}
                onViewJobCategories={onViewJobCategories}
                onViewSupervisors={onViewSupervisors}
            />
            <GridGraphsVerticalBarChart
                ref="gridGraphsVerticalBarChart"
                data={data}
                list={this.tiles}
                onViewDialog={onViewDialog}
            />
        </div>;
    }
}

@observer
class Tile extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            className,
            titleClassName = '',
            countClassName = '',
            compRef,
            title,
            count,
            onClick,
            value,
            onCount,
            children
        } = this.props;
        return <div className={`Tile flex-center grid-1 grid-gap-10 padding-10 border-radius-3 ${className}`}>
            <h4 className={`margin-0 font-size-15 ${titleClassName}`}>{title}</h4>
            <TileCounter countClassName={countClassName} compRef={compRef} onCount={onCount} value={value}
                         onClick={onClick}/>
            {children}
        </div>;
    }
}

@observer
class TileCounter extends React.Component {
    @observable state = {
        count: null
    };

    @computed get count() {
        return this.state.count;
    }

    componentDidMount() {
        const {onCount, value} = this.props;
        if (isNumber(value)) {
            this.state.count = value;
        } else if (isFunction(onCount)) {
            onCount('ALL').then(count => {
                this.state.count = count;
                // console.log('TileCounter', count)
            });
        } else {
            this.state.count = "N/A";
        }
    }

    render() {
        const {compRef, onClick, countClassName} = this.props;
        const {count} = this;
        const className = count ? 'loaded' : 'loading';
        return <Clickable compRef={compRef} onClick={onClick}>
            <div
                className={`Counter w-90 h-90 padding-0 circled margin-auto font-size-26 flex-center grid-1 border-radius-3 ${className} ${countClassName}`}>
                {count}
            </div>
        </Clickable>;
    }
}

export default DashboardTab;
//222
