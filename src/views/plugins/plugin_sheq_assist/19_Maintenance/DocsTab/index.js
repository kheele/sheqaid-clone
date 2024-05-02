// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from 'views/plugins/utils';

import {CalculationUtils, Dates, execWhen} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput, SelectAssetInput, SelectAssetTypeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

// import ProfileToolDialog from '../ToolsTab/forms/ProfileToolDialog.js';
// import EditToolDialog from '../ToolsTab/forms/EditToolDialog.js';

import ExportAssetDocsDialog from '../dialogs/ExportAssetDocsDialog';

import style from "./DocsTab.lazy.css";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";
import AssetDocsRenderRow from "./AssetDocsRenderRow";
import {renderLeftButtonsForExpiryOnly} from "utils/ComponentUtils";
import ExportAssetsDialog from "../dialogs/ExportAssetsDialog";
import ProfileToolDialog from "../ToolsTab/forms/ProfileToolDialog";
import {CONSTANTS} from "../ToolsTab/forms/AssetComponents";

// </editor-fold>

@observer
class DocsTab extends React.Component {
	
	pageKey = "DocsTab";
	
	// <editor-fold defaultstate="collapsed" desc="state">
	@observable
	state = {
		lists: {
			manufacturers: [],
			locations: [],
			conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap'],
			type: [
				'Clearance Certificate',
				'Vehicle Registration Certificate',
				'Work Manual',
				'Work Procedure',
				'Break Test Report',
				'Certificate of Fitness (C.O.F)',
				'Invoice',
				'Vehicle License',
				'LUX Test Report',
			]
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
		this.onViewDocuments = this.onViewDocuments.bind(this);

		this.onExport = this.onExport.bind(this);

		this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
		// this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
		this.renderTHead = this.renderTHead.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="componentWillMount, componentMount, componentWillUnmount">
	componentWillMount() {
		style.use();
	}
	
	componentDidMount() {
		const loads = {manufacturers: onSelectLoadAssetManufacturers, locations: onSelectLoadAssetLocations};
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

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {state: {view, expiry_date}} = this;
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			type,
			title,
			asset_id,
			//
			name,
			reg_num,
			serial_num,
			model,
			manufacturer,
			location,
			asset_type,
			condition,
			status,
		} = filterData || {};
		//
		// const args = {
		// 	written_off: false,
		// };

		const mon = Dates.formatDateSQL(new Date().addMonths(1));
		const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
		const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

		const listByLogged = sockets.of('assets/docs').fn('listByLogged');

		return listByLogged({
			view, expiry_date,
			mon, mon2, mon3,
			//
			type,
			title,
			asset_id,
			//
			name,
			reg_num,
			serial_num,
			model,
			manufacturer,
			location,
			asset_type,
			condition,
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

	// <editor-fold defaultstate="collapsed" desc="onViewDocuments">
	onViewDocuments(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		// console.log("list", this.isAsset, list.slice())
		const dialog = this.refs.root.getDialogByRef('profileDialog');
		if (dialog) {
			if (this.isAsset) {
				dialog.extraProp('rowIdx', CONSTANTS.DOCUMENTS).open(item);
			} else {
				const {data: {asset: assetItem}} = item;
				dialog.extraProp('rowIdx', CONSTANTS.DOCUMENTS).extraProp('docActiveId', item.id).open(assetItem);
			}
		}
	}

	// </editor-fold>
//
	// <editor-fold defaultstate="collapsed" desc="actions">
	onExport(e, btn) {
		this.refs.exportAssetDocsDialog.open();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
	renderDefaultLeftButtons() {
		const {onSignatures} = this.props;
		const {isContractorView} = storage.is;

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

	//<editor-fold desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={this.onViewAsset} faIconLeft="eye" title="View Asset"/>
			{!this.isAsset && <NavItem action="view" onClick={this.onViewDocuments} faIconLeft="eye" title="View Documents"/>}
			{/*<NavItem action="writable" idx={idx} onClick={this.onAddMaintenanceService} faIconLeft="plus"*/}
			{/*         title="Add Maintenance Service"/>*/}
		</Options>;
	}
	//</editor-fold>

	//<editor-fold desc="renderFilterNode">
	renderFilterNode(onChange) {
		if (!this.state.loadedSelectLists) {
			return <div className="col-lg-12 controls flex text-center">Loading...</div>;
		}
		return <div className="col-lg-12 controls -margin-b-35">
			<SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-4 form-control"
			                      onChange={onChange}/>
			<ClearableInput name="name" type="text" placeholder="Asset Name" className="col-lg-4 form-control"
			                onChange={onChange}/>
			<SelectAssetInput name="asset" placeholder="Asset..." className="col-lg-4 form-control"
			                      onChange={onChange}/>
			
			<ClearableInput name="manufacturer" type="select" placeholder="Manufacturer..." className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
			<ClearableInput name="location" type="select" placeholder="Location..." className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange} values={this.state.lists.locations} returnValue/>
			<ClearableInput name="model" type="text" placeholder="Model" className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange}/>
			
			<ClearableInput name="reg_num" type="text" placeholder="Registration No."
							className="col-lg-4 margin-t-10 form-control"
							onChange={onChange}/>
			<ClearableInput name="serial_num" type="text" placeholder="Serial No."
							className="col-lg-4 margin-t-10 form-control"
							onChange={onChange}/>
			<ClearableInput name="condition" type="select" placeholder="Condition..."
							className="col-lg-4 margin-t-10 form-control" onChange={onChange}
							values={this.state.lists.conditions} returnValue/>
			
			<ClearableInput name="title" type="text" placeholder="Document Title"
							className="col-lg-4 margin-t-10 form-control" onChange={onChange}/>
			<ClearableInput name="type" type="select" placeholder="Document Type..."
							className="col-lg-4 margin-t-10 form-control" onChange={onChange}
							values={this.state.lists.type} returnValue/>

			{/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
		</div>;
	}
	//</editor-fold>

	//<editor-fold desc="renderTHead">
	renderTHead() {
		const {isConsultant, hasProjects, isContractor} = storage.is;
		if(this.isAsset) {
			return <THead>
				<div className="td fixed-flex min-w-50">ID</div>
				<div className="td fixed-flex min-w-80">Photo</div>
				<div className="td">Asset Type</div>
				<div className="td">Asset</div>
				<div className="td">Reg. No.</div>
				<div className="td">Serial No.</div>
				<div className="td">Responsible Person</div>
				<div className="td">Job Position</div>
				{hasProjects && <div className="td sm-hidden">Location</div>}
				<div className="td fixed-flex min-w-105">Latest On</div>
				<div className="td fixed-flex min-w-240">Stats</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
			</THead>;
		} else {
			return <THead>
				<div className="td fixed-flex min-w-50">ID</div>
				<div className="td fixed-flex min-w-80">Photo</div>
				<div className="td">Asset Type</div>
				<div className="td">Asset</div>
				<div className="td">Reg. No.</div>
				<div className="td">Serial No.</div>
				<div className="td">Document Title</div>
				<div className="td">Document Type</div>
				<div className="td fixed-flex min-w-105">Date</div>
				<div className="td fixed-flex min-w-105">Expiry Date</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
			</THead>;
		}
	}
	//</editor-fold>

	//<editor-fold desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		return <AssetDocsRenderRow key={item.id} idx={n} item={item} view={this.state.view} onClick={onClick} onView={this.onViewAsset}/>;
	}
	//</editor-fold>

	//<editor-fold desc="render">
	render() {
		const {state, state: {expiry_date}} = this;
		const {onSignatures} = this.props;
		return <>
			<ViewByButtonsBox
				ref="viewButtonsRefBox"
				state={state}
				titleSingular="Document"
				expiry_date={expiry_date}
				onChange={this.setView}
			/>
			<APageListReadWrite
				hasBackBtn={false}
				ref="root"
				page={this}
				createBtnTitle="Create"
				pageId={this.pageKey + "-tab"}
				pageTitle="Documents"
				pageTitleSingular="document"
				onLoadList={this.onLoadList}
				noAnimation={true}
				renderDefaultLeftButtons={this.renderDefaultLeftButtons}
				renderLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
				renderPopoverOptions={this.renderPopoverOptions}
				renderFilterNode={this.renderFilterNode}
				renderTHead={this.renderTHead}
				renderItem={this.renderItem}>
				<ConfirmDialog ref="removeDialog"/>

				{/*<EditToolDialog ref="editDialog"/>*/}
				<ProfileToolDialog ref="profileDialog"/>
				<ExportAssetDocsDialog ref="exportAssetDocsDialog"/>
			</APageListReadWrite>
		</>;
	}
	//</editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

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
			}} text="Asset" expiry_date={expiry_date} value={view} name={titleSingular} onChange={onChange}/>
		</MKBox>
	}
}

// </editor-fold>

export default DocsTab;
