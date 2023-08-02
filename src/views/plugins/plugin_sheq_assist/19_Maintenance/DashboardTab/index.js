// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {calculateRightPos, getRandomRolor} from 'utils/Utils';
import {Button, Clickable} from 'components/inputs';

import style from "./DashboardTab.lazy.css";
import DashboardAll from "./DashboardAll";

// </editor-fold>

//<editor-fold desc="DashboardTab">
@observer
class DashboardTab extends React.Component {
    static key = 'Dashboard';

    @observable state = {
        value: 'DashboardAll'
    };

    // <editor-fold defaultstate="collapsed" desc="constructor, componentWillMount, componentWillUnmount">
    constructor(props) {
        super(props);

        this.toggleFilter = this.toggleFilter.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    toggleFilter(evt, btn) {
        const {view} = btn.props;
        this.state.value = view;
    }

    update() {
        const {dashboardAll, dashboardAssets, dashboardParts, dashboardJobCards, dashboardMonitoring, dashboardMaintenance, dashboardCalibration} = this.refs;
        dashboardAll.update();
        // dashboardAssets.update();
        // dashboardParts.update();
        // dashboardJobCards.update();
        // dashboardMonitoring.update();
        // dashboardMaintenance.update();
        // dashboardCalibration.update();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {path, onFilter} = this.props;
        const {state} = this;
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            <div className="page-content grid-1 grid-gap-10 nice-scrollbars">
                <div className="flex w-1000 h-35 hor-center margin-t-10 margin-r-10">
                    <ButtonList state={state} onClick={this.toggleFilter}/>
                </div>
                <DashboardAll ref="dashboardAll" state={state}/>
                {/*<DashboardAssets ref='dashboardAssets' state={state} path={path} onFilter={onFilter}/>*/}
                {/*<DashboardParts ref='dashboardParts' state={state} path={path} onFilter={onFilter}/>*/}
                {/*<DashboardJobCards ref='dashboardJobCards' state={state} path={path} onFilter={onFilter}/>*/}
                {/*<DashboardMonitoring ref='dashboardMonitoring' state={state} path={path} onFilter={onFilter}/>*/}
                {/*<DashboardMaintenance ref='dashboardMaintenance' state={state} path={path} onFilter={onFilter}/>*/}
                {/*<DashboardCalibration ref='dashboardCalibration' state={state} path={path} onFilter={onFilter}/>*/}
            </div>
        </div>;
    }

    // </editor-fold>
}
//</editor-fold>

//<editor-fold desc="ButtonList">
@observer
class ButtonList extends React.Component {

    render() {
        const {state: {value}, onClick} = this.props;
        return <React.Fragment>
            <Button className={`btn btn-primary no-border border-radius-0 border-radius-l-20${value !== 'DashboardAll' ? ' bg-grey' : ''}`} view='DashboardAll' text="All Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardAssets' ? ' bg-grey' : ''}`} view='DashboardAssets' text="Asset Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardParts' ? ' bg-grey' : ''}`} view='DashboardParts' text="Part Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardJobCards' ? ' bg-grey' : ''}`} view='DashboardJobCards' text="Job Card Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardMonitoring' ? ' bg-grey' : ''}`} view='DashboardMonitoring' text="Monitoring Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0${value !== 'DashboardMaintenance' ? ' bg-grey' : ''}`} view='DashboardMaintenance' text="Maintenance Dashboard" onClick={onClick}/>
            <Button className={`btn btn-primary no-border border-radius-0 border-radius-r-20${value !== 'DashboardCalibration' ? ' bg-grey' : ''}`} view='DashboardCalibration' text="Calibration Dashboard" onClick={onClick}/>
        </React.Fragment>;
    }
}
//</editor-fold>

@observer
class ADashboard extends React.Component {

    @observable state = {
        list: [],
        loadStatus: null
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
    }
    // </editor-fold>

    componentDidMount() {
        this.update();
    }

    update() {
        this.state.loadStatus = "LOADING";
        neonBinding.events.emit(`${this.props.path}${this.path}/list`).then(list => {
            this.state.list = list;
            this.state.loadStatus = "SUCCESS";
        }).catch(err => {
            this.state.loadStatus = "ERROR";
        });
    }

}

@observer
class DashboardAssets extends ADashboard {
    key = 'DashboardAssets';
    path = 'tools';

    render() {
        const {state: {value}, path, onFilter} = this.props;
        if(value !== this.key) return null;

        return <React.Fragment>
            <div className="top-stats flex grid-gap-10">
                <ContentCondition ref="contentCondition" state={this.state} path={path} onFilter={onFilter}/>
                <ContentStatus ref="contentStatus" state={this.state} path={path} onFilter={onFilter}/>
            </div>

            <ContentAssetType ref="contentAssetType" state={this.state} path={path} onFilter={onFilter}/>

            <ContentAssetTypeVSCondition ref="contentAssetTypeVSCondition" state={this.state} path={path}
                                         onFilter={onFilter}/>
            <ContentAssetTypeVSStatus ref="contentAssetTypeVSStatus" state={this.state} path={path}
                                      onFilter={onFilter}/>
        </React.Fragment>;
    }
}

@observer
class DashboardParts extends ADashboard {
    key = 'DashboardParts';
    path = 'parts';

    render() {
        const {state: {value}, path, onFilter} = this.props;
        if(value !== this.key) return null;

        return <React.Fragment>

        </React.Fragment>;
    }
}

@observer
class DashboardJobCards extends ADashboard {
    key = 'DashboardJobCards';
    path = 'job-cards';

    render() {
        const {state: {value}, path, onFilter} = this.props;
        if(value !== this.key) return null;

        return <React.Fragment>

        </React.Fragment>;
    }
}

@observer
class DashboardMonitoring extends ADashboard {
    key = 'DashboardMonitoring';
    path = 'monitoring-plan';

    render() {
        const {state: {value}, path, onFilter} = this.props;
        if(value !== this.key) return null;

        return <React.Fragment>

        </React.Fragment>;
    }
}

@observer
class DashboardMaintenance extends ADashboard {
    key = 'DashboardMaintenance';
    path = 'maintanance-plan';

    render() {
        const {state: {value}, path, onFilter} = this.props;
        if(value !== this.key) return null;

        return <React.Fragment>

        </React.Fragment>;
    }
}

@observer
class DashboardCalibration extends ADashboard {
    key = 'DashboardCalibration';
    path = 'calibration-record';

    render() {
        const {state: {value}, path, onFilter} = this.props;
        if(value !== this.key) return null;

        return <React.Fragment>

        </React.Fragment>;
    }
}

// <editor-fold defaultstate="collapsed" desc="AContent">
@observer
class AContent extends React.Component {

    asset_types = [
        'Electrical Tools',
        'Electronics',
        'Machinery',
        'Fire Fighting Equipment',
        'Furniture',
        'Vehicles',
        'Plant',
        'Small Plant',
        'Hand Tools',
        'Office Equipment',
        'Miscellaneous',
        'Other Tools'
    ];

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    @computed get list() {
        return this.props.state.list;
    }

    @computed get loadStatus() {
        return this.props.state.loadStatus;
    }

}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentCondition">
@observer
class ContentCondition extends AContent {
    key = "condition";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    @computed get newList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "New");
    }

    @computed get goodList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Good");
    }

    @computed get fairList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Fair");
    }

    @computed get poorList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Poor");
    }

    @computed get scrapList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Scrap");
    }

    @computed get unknownList() {
        const {list} = this;
        return list.filter(({data}) => !data.condition);
    }

    render() {
        const {loadStatus} = this;
        if (!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if (loadStatus === "ERROR") {

        }

        const {onFilter: onClick} = this.props;

        const group = {key: 'condition'};

        return <React.Fragment>
            <div className="AContent margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="AContent-main-title margin-0 min-h-20 text-center">Stats by Condition</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <div className="margin-0 grid-3 grid-gap-5 fixed-flex">
                            <Stats
                                value={this.newList}
                                title='New Condition' group={group}
                                hoverText={getConditionDesc('newList')}
                                onClick={onClick}
                            />
                            <Stats
                                value={this.goodList}
                                title='Good Condition' group={group}
                                hoverText={getConditionDesc('goodList')}
                                onClick={onClick}
                            />
                            <Stats
                                value={this.fairList}
                                title='Fair Condition' group={group}
                                hoverText={getConditionDesc('fairList')}
                                onClick={onClick}
                            />
                            <Stats
                                value={this.poorList}
                                title='Poor Condition' group={group}
                                hoverText={getConditionDesc('poorList')}
                                onClick={onClick}
                            />
                            <Stats
                                value={this.scrapList}
                                title='Scrap Condition' group={group}
                                hoverText={getConditionDesc('scrapList')}
                                onClick={onClick}
                            />
                            <Stats
                                value={this.unknownList}
                                title='Unknown Condition' group={group}
                                hoverText={getConditionDesc('unknownList')}
                                onClick={onClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentStatus">
@observer
class ContentStatus extends AContent {
    key = "status";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    @computed get inStorageList() {
        const {list} = this;
        return list.filter(({data}) => data.status === "In Storage");
    }

    @computed get checkedOutList() {
        const {list} = this;
        return list.filter(({data}) => !data.written_off && data.status === "Checked Out");
    }

    @computed get loanedOutList() {
        const {list} = this;
        return list.filter(({data}) => data.status === "Loaned Out");
    }

    @computed get outForRepairList() {
        const {list} = this;
        return list.filter(({data}) => data.status === "Out For Repair");
    }

    @computed get writtenOffList() {
        const {list} = this;
        return list.filter(({data}) => data.written_off);
    }

    @computed get unknownList() {
        const {list} = this;
        return list.filter(({data}) => !data.status);
    }

    render() {
        const {loadStatus} = this;
        if (!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if (loadStatus === "ERROR") {

        }

        const {onFilter: onClick} = this.props;

        const group = {key: 'status'};

        return <React.Fragment>
            <div className="AContent margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="AContent-main-title margin-0 min-h-20 text-center">Stats by Status</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <div className="margin-0 grid-3 grid-gap-5 fixed-flex">
                            <Stats value={this.inStorageList} title='In Storage' group={group}
                                   onClick={onClick}/>
                            <Stats value={this.checkedOutList} title='Checked Out' group={group}
                                   onClick={onClick}/>
                            <Stats value={this.loanedOutList} title='Loaned Out' group={group}
                                   onClick={onClick}/>
                            <Stats value={this.outForRepairList} title='Out For Repair' group={group}
                                   onClick={onClick}/>
                            <Stats value={this.writtenOffList} title='Written Off' group={group}
                                   onClick={onClick}/>
                            <Stats value={this.unknownList} title='Unknown Status' group={group}
                                   onClick={onClick}/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentAssetType">
@observer
class ContentAssetType extends AContent {
    key = "asset_type";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    renderItem(asset_type, n) {
        const onFilter = asset_type => {
            return ({data}) => data.asset_type === asset_type;
        };

        const {onFilter: onClick} = this.props;

        const group = {key: 'asset_type', asset_type};

        return <div className="panel-left margin-0 padding-b-5 fixed-flex">
            <div className="margin-0 grid-1 grid-gap-5 fixed-flex">
                <Stats value={this.list.filter(onFilter(asset_type))} title={asset_type} group={group}
                       onClick={onClick}/>
            </div>
        </div>;
    }

    render() {
        const {loadStatus} = this;
        if (!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if (loadStatus === "ERROR") {

        }

        return <React.Fragment>
            <div className="AContent ContentAssetType margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="AContent-main-title margin-0 min-h-20 text-center">Stats by Asset Type</h4>
                <div className="margin-0 grid-6 grid-gap-10">
                    {this.asset_types.map(this.renderItem)}
                </div>
            </div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentAssetTypeVSCondition">
@observer
class ContentAssetTypeVSCondition extends AContent {
    key = "asset_type";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    @computed get newList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "New");
    }

    @computed get goodList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Good");
    }

    @computed get fairList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Fair");
    }

    @computed get poorList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Poor");
    }

    @computed get scrapList() {
        const {list} = this;
        return list.filter(({data}) => data.condition === "Scrap");
    }

    @computed get unknownList() {
        const {list} = this;
        return list.filter(({data}) => !data.condition);
    }

    renderItem(asset_type, n) {
        const onFilter = asset_type => {
            return ({data}) => data.asset_type === asset_type;
        };

        const {onFilter: onClick} = this.props;

        const group = {key: 'condition', asset_type};

        return <div className="panel-left margin-0 padding-b-5 fixed-flex">
            <h4 className="margin-0 min-h-25 text-center font-weight-bold font-size-14">{asset_type}</h4>
            <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                <Stats
                    value={this.newList.filter(onFilter(asset_type))}
                    title='New Condition' group={group}
                    hoverText={getConditionDesc('newList')}
                    onClick={onClick}
                />
                <Stats
                    value={this.goodList.filter(onFilter(asset_type))}
                    title='Good Condition' group={group}
                    hoverText={getConditionDesc('goodList')}
                    onClick={onClick}
                />
                <Stats
                    value={this.fairList.filter(onFilter(asset_type))}
                    title='Fair Condition' group={group}
                    hoverText={getConditionDesc('fairList')}
                    onClick={onClick}
                />
                <Stats
                    value={this.poorList.filter(onFilter(asset_type))}
                    title='Poor Condition' group={group}
                    hoverText={getConditionDesc('poorList')}
                    onClick={onClick}
                />
                <Stats
                    value={this.scrapList.filter(onFilter(asset_type))}
                    title='Scrap Condition' group={group}
                    hoverText={getConditionDesc('scrapList')}
                    onClick={onClick}
                />
                <Stats
                    value={this.unknownList.filter(onFilter(asset_type))}
                    title='Unknown Condition' group={group}
                    hoverText={getConditionDesc('unknownList')}
                    onClick={onClick}
                />
            </div>
        </div>;
    }

    render() {
        const {loadStatus} = this;
        if (!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if (loadStatus === "ERROR") {

        }

        return <React.Fragment>
            <div className="AContent margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="AContent-main-title margin-0 min-h-20 text-center">Stats by Asset Type VS Condition</h4>
                <div className="margin-0 grid-4 grid-gap-10">
                    {this.asset_types.map(this.renderItem)}
                </div>
            </div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentAssetTypeVSStatus">
@observer
class ContentAssetTypeVSStatus extends AContent {
    key = "status";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    @computed get inStorageList() {
        const {list} = this;
        return list.filter(({data}) => data.status === "In Storage");
    }

    @computed get checkedOutList() {
        const {list} = this;
        return list.filter(({data}) => !data.written_off && data.status === "Checked Out");
    }

    @computed get loanedOutList() {
        const {list} = this;
        return list.filter(({data}) => data.status === "Loaned Out");
    }

    @computed get outForRepairList() {
        const {list} = this;
        return list.filter(({data}) => data.status === "Out For Repair");
    }

    @computed get writtenOffList() {
        const {list} = this;
        return list.filter(({data}) => data.written_off);
    }

    @computed get unknownList() {
        const {list} = this;
        return list.filter(({data}) => !data.status);
    }

    renderItem(asset_type, n) {
        const onFilter = asset_type => {
            return ({data}) => data.asset_type === asset_type;
        };

        const {onFilter: onClick} = this.props;

        const group = {key: 'status', asset_type};

        return <div className="panel-left margin-0 padding-b-5 fixed-flex">
            <h4 className="margin-0 min-h-25 text-center font-weight-bold font-size-14">{asset_type}</h4>
            <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                <Stats value={this.inStorageList.filter(onFilter(asset_type))} title='In Storage' group={group}
                       onClick={onClick}/>
                <Stats value={this.checkedOutList.filter(onFilter(asset_type))} title='Checked Out' group={group}
                       onClick={onClick}/>
                <Stats value={this.loanedOutList.filter(onFilter(asset_type))} title='Loaned Out' group={group}
                       onClick={onClick}/>
                <Stats value={this.outForRepairList.filter(onFilter(asset_type))} title='Out For Repair' group={group}
                       onClick={onClick}/>
                <Stats value={this.writtenOffList.filter(onFilter(asset_type))} title='Written Off' group={group}
                       onClick={onClick}/>
                <Stats value={this.unknownList.filter(onFilter(asset_type))} title='Unknown Status' group={group}
                       onClick={onClick}/>
            </div>
        </div>;
    }

    render() {
        const {loadStatus} = this;
        if (!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if (loadStatus === "ERROR") {

        }

        return <React.Fragment>
            <div className="AContent margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="AContent-main-title margin-0 min-h-20 text-center">Stats by Asset Type VS Status</h4>
                <div className="margin-0 grid-4 grid-gap-10">
                    {this.asset_types.map(this.renderItem)}
                </div>
            </div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {

    @observable state = {
        value: null,
        loading: true
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onInfo = this.onInfo.bind(this);
    }

    // </editor-fold>

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;
        if (value instanceof Promise) {
            this.state.value = await value;
        } else {
            this.state.value = value;
        }
        this.state.loading = false;
    }

    onClick(evt, el) {
        if (evt.target.tagName.toLowerCase() === 'i') {
            return;
        }

        const {value} = this.state;

        const {props: {group, title, onClick}} = this;
        onClick && onClick({group, title, value});
    }

    onInfo(evt, el) {
        const {props: {title, hoverText}} = this;

        const target = el.getDOMNode();
        const jq = $(target);
        const w = jq.outerWidth();
        const h = jq.outerHeight();
        const {top} = jq.offset();
        const right = calculateRightPos(target);
        popover.settings({
            style: {position: 'fixed !important', width: 300},
            fixedCenter: true,
            isDialog: true,
            contentNode: <div>
                <label className="w-full">{title}</label>
                {hoverText}
            </div>
        }).open();
    }

    render() {
        const {props: {title, className = "", hoverText}} = this;
        const {value, loading} = this.state;
//        console.log('value', value)
        const style = {background: getRandomRolor()};
        return <Clickable onClick={this.onClick}>
            <div style={style} className={"padding-10 Statistics " + className}>
                <label className="text-center w-full margin-b-10">{title}</label>
                {hoverText && <Clickable onClick={this.onInfo}>
                    <i className="fa fa-info"/>
                </Clickable>}
                <div className="content">
                    {loading && <CircularProgress/>}
                    {!loading && ((isArray(value) || isObservableArray(value)) ? value.length : value)}
                </div>
            </div>
        </Clickable>;
    }
}

// </editor-fold>

const getConditionDesc = (key) => {
    return {
        newList: 'An item that is in excellent condition, can function perfectly for its intended purpose without modification, and does not require repair or abnormal maintenance at the time of inspection or in the foreseeable future.',
        goodList: 'An item that has been modified or repaired and is in use at or near its fully specified use, but due to age and/or use effects, minor repairs may be required. In the foreseeable future, it will be used to some extent below the fully specified utilization.',
        fairList: 'An item is used for less than full purpose at some point due to aging and the effects of use, and in the near future general repairs will be required, and in some cases minor elements will need to be replaced to increase usability at or near the original specifications.',
        poorList: 'An item can only be used at some point below the specified full utilization and cannot achieve full functionality in its current state without major repairs and/or replacement of critical elements in the near future.',
        scrapList: 'An item is no longer usable and cannot be used to the extent practical, regardless of the degree of repair or modification. This condition applies to  equipment that has been used for up to 100% of its useful life, or that is technically or functionally 100% obsolete.',
        unknownList: 'An item status is not classified.',
    }[key];
};

export default DashboardTab;
