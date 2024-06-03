// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';

import {
	onSelectLoadAssetLocations,
	onSelectLoadAssetManufacturers
} from 'views/plugins/utils';

import { Dates, execWhen } from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
	ActionsButton,
	Button,
	ClearableInput,
	Clickable,
	SelectAssetInput,
	SelectAssetTypeInput
} from 'components/inputs';
import { THead, TRow } from 'components/tables';

import ProfileToolDialog from '../ToolsTab/forms/ProfileToolDialog.js';
import EditToolDialog from '../ToolsTab/forms/EditToolDialog.js';

import style from "./CalibrationRecordTab.lazy.css";
import { CONSTANTS } from "../ToolsTab/forms/AssetComponents";
import MKBox from "../../../../../components/MK/MKBox";
import ViewByButtons from "../../../../../components/ViewByButtons";
import assetProfilePic from "../../../../../assets/images/vehicle-image-loading.png";
import { ExpiryButtons, renderExpiryDateSpan, renderLeftButtonsForExpiryOnly } from "../../../../../utils/ComponentUtils";
import AssetCalibrationRecordRenderRow from "./AssetCalibrationRecordRenderRow";

// </editor-fold>

@observer
class CalibrationRecordTab extends React.Component {

	pageKey = "CalibrationRecordTab";

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
		this.onViewCalibrationService = this.onViewCalibrationService.bind(this);

		this.onView = this.onView.bind(this);
		this.onAddCalibrationService = this.onAddCalibrationService.bind(this);

		this.onPrintForm = this.onPrintForm.bind(this);
		// this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
		this.renderTHead = this.renderTHead.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
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

	// </editor-fold>

	@computed get isAsset() {
		return this.state.view === "Asset";
	}

	@computed get isUpcoming() {
		return this.state.view === "Upcoming Calibrations";
	}

	@computed get isPast() {
		return this.state.view === "Past Calibrations";
	}

	@computed get isHistory() {
		return this.state.view === "Calibration History";
	}

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const { state: { view, expiry_date } } = this;
		const { page, lastItem, filterData, filtered, isNew } = params;
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

		const listByLogged = sockets.of('assets/calibration-records').fn('listByLogged');

		return listByLogged({
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
	async setView({ view = 'Asset', expiry_date = 'ALL', load = true }) {
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
		const { idx } = el.props;
		const { list } = this.refs.root;
		const item = list[idx];
		console.log("list", this.isAsset, list.slice())
		const dialog = this.refs.root.getDialogByRef('profileDialog');
		if (dialog) {
			if (this.isAsset) {
				dialog.open(item);
			} else {
				const { data: { asset: assetItem } } = item;
				dialog.open(assetItem);
			}
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onViewCalibrationService">
	onViewCalibrationService(e, el) {
		const { idx } = el.props;
		const { list } = this.refs.root;
		const item = list[idx];
		// console.log("list", this.isAsset, list.slice())
		const dialog = this.refs.root.getDialogByRef('profileDialog');
		if (dialog) {
			if (this.isAsset) {
				dialog.extraProp('rowIdx', CONSTANTS.CALIBRATION).open(item);
			} else {
				const { data: { asset: assetItem } } = item;
				dialog.extraProp('rowIdx', CONSTANTS.CALIBRATION).extraProp('docActiveId', item.id).open(assetItem);
			}
		}
	}

	// </editor-fold>
	//
	onPrintForm() {
		this.refs.newCalibrationRecordPrintDialog.open();
	}

	onView(e, el) {
		const { idx } = el.props;
		const { list } = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.profileDialog.extraProp('rowIdx', CONSTANTS.CALIBRATION).open(item);
		}
	}

	onAddCalibrationService(e, el) {
		const { idx } = el.props;
		const { list } = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('rowIdx', CONSTANTS.CALIBRATION).open(item);
		}
	}

	// <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
	renderDefaultLeftButtons() {
		return null;

		const { onSignatures } = this.props;
		const { isContractorView } = storage.is;

		//        const {permissions_other} = storage.loggedUser.user.data;
		//        //
		//        const permissions_other_Medicals = (permissions_other || []).find(v => v.key === "Medicals");
		//        const c_Medicals = Permissions.allow(permissions_other_Medicals) ? "allowed" : "disallowed";

		//        const writable = storage.is.isContractor || !isContractorView;
		return <>
			<Button className="btn btn-primary pull-right" onClick={this.onExport}>
				Export
			</Button>
			{/*<Button className="btn btn-primary pull-right" onClick={onSignatures}>*/}
			{/*	Signatures*/}
			{/*</Button>*/}
		</>;
	}

	// </editor-fold>

	renderPopoverOptions(idx, { onView, onEdit, onRemove, Options }) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={this.onViewAsset} faIconLeft="eye" title="View Asset" />
			{!this.isAsset &&
				<NavItem action="view" onClick={this.onViewCalibrationService} faIconLeft="eye" title="View Calibration Service" />}
			<NavItem action="writable" idx={idx} onClick={this.onAddCalibrationService} faIconLeft="plus"
				title="Add Calibration Service" />
		</Options>;
	}

	renderFilterNode(onChange) {
		if (!this.state.loadedSelectLists) {
			return <div className="col-lg-12 controls flex text-center">Loading...</div>;
		}
		return <div className="col-lg-12 controls -margin-b-35">
			<SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-4 form-control"
				onChange={onChange} />
			<ClearableInput name="name" type="text" placeholder="Asset Name" className="col-lg-4 form-control"
				onChange={onChange} />
			<SelectAssetInput name="asset" placeholder="Asset..." className="col-lg-4 form-control"
				onChange={onChange} />

			<ClearableInput name="manufacturer" type="select" placeholder="Manufacturer..." className="col-lg-4 margin-t-10 form-control"
				onChange={onChange} values={this.state.lists.manufacturers} returnValue />
			<ClearableInput name="location" type="select" placeholder="Location..." className="col-lg-4 margin-t-10 form-control"
				onChange={onChange} values={this.state.lists.locations} returnValue />
			<ClearableInput name="model" type="text" placeholder="Model" className="col-lg-4 margin-t-10 form-control"
				onChange={onChange} />

			<ClearableInput name="reg_num" type="text" placeholder="Registration No."
				className="col-lg-4 margin-t-10 form-control"
				onChange={onChange} />
			<ClearableInput name="serial_num" type="text" placeholder="Serial No."
				className="col-lg-4 margin-t-10 form-control"
				onChange={onChange} />
			<ClearableInput name="condition" type="select" placeholder="Condition..."
				className="col-lg-4 margin-t-10 form-control" onChange={onChange}
				values={this.state.lists.conditions} returnValue />

			{/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
		</div>;
	}

	renderTHead() {
		const { isConsultant, hasProjects, isContractor } = storage.is;
		const frag = <>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td fixed-flex min-w-80">Photo</div>
			<div className="td fixed-flex min-w-140">Asset Type</div>
			<div className="td">Asset</div>
			<div className="td">Location</div>
			<div className="td fixed-flex min-w-140">Reg. No.</div>
			<div className="td fixed-flex min-w-140">Serial No.</div>
		</>;
		if (this.isAsset) {
			return <THead>
				{frag}
				<div className="td fixed-flex min-w-140">Last Calibration</div>
				<div className="td fixed-flex min-w-160">Previous Schedule</div>
				<div className="td fixed-flex min-w-140">Next Calibration</div>
				<div className="td fixed-flex min-w-240">Stats</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
			</THead>;
		} else if (this.isUpcoming) {
			return <THead>
				{frag}
				<div className="td fixed-flex min-w-160">Calibration Interval</div>
				<div className="td fixed-flex min-w-140">Next Calibration</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
			</THead>;
		} else if (this.isPast) {
			return <THead>
				{frag}
				<div className="td fixed-flex min-w-140">Date Scheduled</div>
				<div className="td fixed-flex min-w-140">Completed On</div>
				<div className="td fixed-flex min-w-140">Days Completed</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
			</THead>;
		} else if (this.isHistory) {
			return <THead>
				{frag}
				<div className="td">Calibrating Company</div>
				<div className="td fixed-flex min-w-160">Reference Standard</div>
				<div className="td fixed-flex min-w-140">Certificate No.</div>
				<div className="td fixed-flex min-w-140">Calibration Date</div>
				<div className="td fixed-flex min-w-140">Date Scheduled</div>
				<div className="td fixed-flex min-w-140">Days Completed</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
			</THead>;
		}

		return null;
	}

	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		return <AssetCalibrationRecordRenderRow key={item.id} idx={n} item={item} view={this.state.view} onClick={onClick} onView={this.onViewAsset} />;
	}

	render() {
		const { state, state: { expiry_date } } = this;
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
				pageTitle="Calibration Record"
				pageTitleSingular="calibration record"
				onLoadList={this.onLoadList}
				noAnimation={true}
				renderDefaultLeftButtons={this.renderDefaultLeftButtons}
				renderLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
				renderPopoverOptions={this.renderPopoverOptions}
				renderFilterNode={this.renderFilterNode}
				renderTHead={this.renderTHead}
				renderItem={this.renderItem}>
				<ConfirmDialog ref="removeDialog" />

				<EditToolDialog ref="editDialog" />
				<ProfileToolDialog ref="profileDialog" />
			</APageListReadWrite>
		</>;
	}
}

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

	items = [
		"Asset",
		"Calibration History",
		"Past Calibrations",
		"Upcoming Calibrations",
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
		const { state: { view }, expiry_date, titleSingular, onChange } = this.props;
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
			}} text="Asset" expiry_date={expiry_date} value={view} items={this.items} onChange={onChange} />
		</MKBox>
	}
}

// </editor-fold>

export default CalibrationRecordTab;
