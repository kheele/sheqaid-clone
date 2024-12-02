// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from 'views/plugins/utils';

import {Dates, execWhen} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ClearableInput, SelectAssetTypeInput} from 'components/inputs';
import {THead} from 'components/tables';

import ProfileToolDialog from '../ToolsTab/forms/ProfileToolDialog.js';
import EditToolDialog from '../ToolsTab/forms/EditToolDialog.js';

import style from "./MonitoringPlanTab.lazy.css";
import {CONSTANTS} from "../ToolsTab/forms/AssetComponents";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";
import AssetMonitoringRenderRow from "./AssetMonitoringRenderRow";
import {listAssetMonitoringPlans} from "mutations/listByLogged";

// </editor-fold>

@observer
class MonitoringPlanTab extends React.Component {
    pageKey = "MonitoringPlanTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            manufacturers: [],
            locations: [],
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap']
        },
        loadedSelectLists: false,
        view: 'Asset',
        expiry_date: 'ALL',
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.setView = this.setView.bind(this);
        this.onViewAsset = this.onViewAsset.bind(this);
        this.onViewMonitoringService = this.onViewMonitoringService.bind(this);

        this.onView = this.onView.bind(this);
        this.onAddMonitoringService = this.onAddMonitoringService.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    @computed get isAsset() {
        return this.state.view === "Asset";
    }

    @computed get isFuelUsage() {
        return this.state.view === "Fuel Usage";
    }

    @computed get isWorkingTimeOrDistance() {
        return this.state.view === "Working Time/Distance";
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        const loads = {
            manufacturers: onSelectLoadAssetManufacturers,
            locations: onSelectLoadAssetLocations,
        };
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k] = res.distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {state: {view, expiry_date}} = this;
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            asset_id,
            //
            name,
            reg_num,
            serial_num,
            model,
            condition,
            location,
            manufacturer,
            asset_type,
            status,
        } = filterData || {};

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        return listAssetMonitoringPlans({
            view, expiry_date,
            mon, mon2, mon3,
            //
            asset_id,
            //
            name,
            reg_num,
            serial_num,
            model,
            condition,
            location,
            manufacturer,
            asset_type,
            status,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    //<editor-fold desc="setView">
    async setView({view = 'Asset', expiry_date = 'ALL', load = true}) {
        let ref;
        if (this.refs.viewButtonsRefBox) {
            ref = this.refs.viewButtonsRefBox;
        } else {
            ref = await execWhen(() => this.refs.viewButtonsRefBox);
        }

        ref.setView(view);
        this.state.view = view;
        this.state.expiry_date = expiry_date;

        if (load) {
            this.refs.root.load();
        }
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewAsset">
    onViewAsset(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        console.log("list", this.isAsset, list.slice())
        const dialog = this.refs.root.getDialogByRef('profileDialog');
        if (dialog) {
            if (this.isAsset) {
                dialog.open(item);
            } else {
                const {data: {asset: assetItem}} = item;
                dialog.open(assetItem);
            }
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewMonitoringService">
    onViewMonitoringService(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        // console.log("list", this.isAsset, list.slice())
        const dialog = this.refs.root.getDialogByRef('profileDialog');
        if (dialog) {
            if (this.isAsset) {
                dialog.extraProp('rowIdx', CONSTANTS.MONITORING).open(item);
            } else {
                const {data: {asset: assetItem}} = item;
                dialog.extraProp('rowIdx', CONSTANTS.MONITORING).extraProp('docActiveId', item.id).open(assetItem);
            }
        }
    }

    // </editor-fold>
    //
    onView(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        if (item) {
            this.refs.profileDialog.extraProp('rowIdx', CONSTANTS.MONITORING).open(item);
        }
    }

    onAddMonitoringService(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        if (item) {
            this.refs.editDialog.extraProp('rowIdx', CONSTANTS.MONITORING).open(item);
        }
    }

    renderLeftButtons() {
        return null/*<div className="left-buttons pull-left">
            <Button key="buttonPrintForm" className="btn btn-primary pull-right _888" onClick={this.onPrintForm}>
                <i key="buttonPrintFormIcon" className="fa fa-chart-bar icon-left"/>Print Form
            </Button>
        </div>*/;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={this.onViewAsset} faIconLeft="eye" title="View Asset"/>
            {!this.isAsset &&
                <NavItem action="view" onClick={this.onViewMonitoringService} faIconLeft="eye"
                         title="View Monitoring Service"/>}
            <NavItem action="writable" idx={idx} onClick={this.onAddMonitoringService} faIconLeft="plus"
                     title="Add Monitoring Service"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        if (!this.state.loadedSelectLists) {
            return <div className="col-lg-12 controls flex text-center">Loading...</div>;
        }
        return <div className="col-lg-12 controls -margin-b-35">
            <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-4 form-control"
                                  onChange={onChange}/>
            <ClearableInput name="manufacturer" type="select" placeholder="Manufacturer..."
                            className="col-lg-4 form-control"
                            onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
            <ClearableInput name="location" type="select" placeholder="Location..." className="col-lg-4 form-control"
                            onChange={onChange} values={this.state.lists.locations} returnValue/>
            <ClearableInput name="condition" type="select" placeholder="Condition..."
                            className="col-lg-4 margin-t-10 form-control" onChange={onChange}
                            values={this.state.lists.conditions} returnValue/>
            <ClearableInput name="name" type="text" placeholder="Asset Name"
                            className="col-lg-4 margin-t-10 form-control"
                            onChange={onChange}/>
            {/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
        </div>;
    }

    renderTHead() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const frag = <>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Asset Name</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-140">Reg. No.</div>
            <div className="td fixed-flex min-w-140">Serial No.</div>
        </>;
        if (this.isAsset) {
            return <THead>
                {frag}
                <div className="td fixed-flex min-w-300">Fuel Usage per hr/km</div>
                <div className="td fixed-flex min-w-300">Fuel Usage / Day</div>
                <div className="td fixed-flex min-w-300">Working Time/Distance / Day</div>
                {/*<div className="td fixed-flex min-w-105">Latest On</div>*/}
                {/*<div className="td fixed-flex min-w-240">Stats</div>*/}
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
            </THead>;
        } else if (this.isFuelUsage) {
            return <THead>
                {frag}
                <div className="td fixed-flex min-w-300">Last Fuel Usage</div>
                <div className="td fixed-flex min-w-300">Average Fuel Usage</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
            </THead>;
        } else if (this.isWorkingTimeOrDistance) {
            return <THead>
                {frag}
                {/* <div className="td fixed-flex min-w-300">Last Time/Distance Usage</div>
				<div className="td fixed-flex min-w-260">Opening & Closing Time/Distance</div> */}
                {/* <div className="td fixed-flex min-w-170">Total Working Time/Distance</div> */}
                <div className="td fixed-flex min-w-300">Average Working Time/Distance</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
            </THead>;
        }
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <AssetMonitoringRenderRow key={item.id} idx={n} item={item} view={this.state.view} onClick={onClick}
                                         onView={this.onViewAsset}/>;
    }

    render() {
        const {state, state: {expiry_date}} = this;
        return <>
            <ViewByButtonsBox
                ref="viewButtonsRefBox"
                state={state}
                expiry_date={expiry_date}
                onChange={this.setView}
            />
            <APageListReadWrite
                hasBackBtn={false}
                ref="root"
                page={this}
                createBtnTitle="Create"
                pageId={this.pageKey + "-tab"}
                pageTitle="Monitoring Plan"
                pageTitleSingular="monitoring plan"
                onLoadList={this.onLoadList}
                noAnimation={true}
                renderLeftButtons={this.renderLeftButtons}
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                renderTHead={this.renderTHead}
                renderItem={this.renderItem}>
                <ConfirmDialog ref="removeDialog"/>

                <EditToolDialog ref="editDialog"/>
                <ProfileToolDialog ref="profileDialog"/>
            </APageListReadWrite>
        </>;
    }
}

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

    items = [
        "Asset",
        "Fuel Usage",
        "Working Time/Distance",
    ];

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.setView = this.setView.bind(this);
    }

    // </editor-fold>

    setView(value) {
        execWhen(() => this.viewButtonsRef).then(ref => {
            ref.setView(value);
        });
    }

    render() {
        const {state: {view}, expiry_date, titleSingular, onChange} = this.props;
        return <MKBox
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin='10px 0 0px'
            padding="0 0 10px"
            borderBottom="2px solid #ebebeb"
        >
            <ViewByButtons ref={ref => {
                this.viewButtonsRef = ref;
            }} text="Asset" expiry_date={expiry_date} value={view} items={this.items} onChange={onChange}/>
        </MKBox>
    }
}

// </editor-fold>

export default MonitoringPlanTab;
