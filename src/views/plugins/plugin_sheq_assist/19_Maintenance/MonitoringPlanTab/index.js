// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import {
	onSelectLoadAssetLocations,
	onSelectLoadAssetManufacturers
} from 'views/plugins/utils';

import {Dates, execWhen} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, Clickable, SelectAssetTypeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ProfileToolDialog from '../ToolsTab/forms/ProfileToolDialog.js';
import EditToolDialog from '../ToolsTab/forms/EditToolDialog.js';

import style from "./MonitoringPlanTab.lazy.css";
import {CONSTANTS} from "../ToolsTab/forms/AssetComponents";
import byLogged from "./Query/List/listAllMonitoringPlansByLogged";
import MKBox from "../../../../../components/MK/MKBox";
import ViewByButtons from "../../../../../components/ViewByButtons";
import assetProfilePic from "../../../../../assets/images/vehicle-image-loading.png";
import {ExpiryButtons, renderExpiryDateSpan} from "../../../../../utils/ComponentUtils";

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
		this.onViewDocuments = this.onViewDocuments.bind(this);
		
		this.onView = this.onView.bind(this);
		this.onAddMonitoringService = this.onAddMonitoringService.bind(this);
		
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
		
		const listByLogged = sockets.of('assets/docs').fn('listByLogged');
		
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
	
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={this.onViewAsset} faIconLeft="eye" title="View Asset"/>
			{!this.isAsset &&
				<NavItem action="view" onClick={this.onViewDocuments} faIconLeft="eye" title="View Monitoring Service"/>}
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
			<ClearableInput name="manufacturer" type="select" placeholder="Manufacturer..." className="col-lg-4 form-control"
			                onChange={onChange} values={this.state.lists.manufacturers} returnValue/>
			<ClearableInput name="location" type="select" placeholder="Location..." className="col-lg-4 form-control"
			                onChange={onChange} values={this.state.lists.locations} returnValue/>
			<ClearableInput name="condition" type="select" placeholder="Condition..."
			                className="col-lg-4 margin-t-10 form-control" onChange={onChange}
			                values={this.state.lists.conditions} returnValue/>
			<ClearableInput name="name" type="text" placeholder="Asset Name" className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange}/>
			{/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
		</div>;
	}
	
	renderTHead() {
		const {isConsultant, hasProjects, isContractor} = storage.is;
		if (this.isAsset) {
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
				<div className="td fixed-flex min-w-30">ID</div>
				<div className="td">Type</div>
				<div className="td">Name</div>
				<div className="td fixed-flex min-w-280">Registration No.</div>
				<div className="td fixed-flex min-w-280">Last Fuel & Mileage Usage</div>
				<div className="td fixed-flex min-w-160">Next Monitoring Date</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
			</THead>;
		}
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {isConsultant, hasProjects, isContractor} = storage.is;
		if (this.isAsset) {
			
			let listName = 'monitoring_plan_list';
			
			let {
				id,
				data: {
					client, project, site,
					status,
					written_off,
					profile_pic: profile_pic_list,
					photo_list,
					responsible_person,
					asset_detail: {
						owning_company,
						name,
						asset_type,
						desc,
						manufacturer,
						model,
						reg_num,
						serial_num,
						location,
						toolkit,
						condition,
						barcode,
						qr_code,
						notes,
					},
					
					[listName]: list,
					[`${listName}_no_expiry_aggregate`]: list_no_expiry_aggregate,
					[`${listName}_expired_aggregate`]: list_expired_aggregate,
					[`${listName}_mon_expiry_aggregate`]: list_mon_expiry_aggregate,
					[`${listName}_2mon_expiry_aggregate`]: list_2mon_expiry_aggregate,
					[`${listName}_3mon_expiry_aggregate`]: list_3mon_expiry_aggregate,
					[`${listName}_4mon_expiry_aggregate`]: list_4mon_expiry_aggregate,
				},
			} = item;
			
			const latest = list.getFirstElement();
			
			let [profile_pic] = profile_pic_list || [];
			if (!profile_pic) {
				profile_pic = (photo_list || [])[0];
			}
			
			return <TRow key={id} className="w-full tr-header">
				<div className="td fixed-flex min-w-50">
					<h6 className="xs-shown font-size-13">ID</h6>
					{id}
				</div>
				<div className="td fixed-flex min-w-80">
					<Clickable idx={idx} viewByImage onClick={onView}>
						{RenderUtils.renderImage(profile_pic && profile_pic.doc, null, '100%', assetProfilePic)}
					</Clickable>
				</div>
				<div className="td">{asset_type}</div>
				<div className="td">{name || 'N/A'}</div>
				<div className="td">{reg_num || 'N/A'}</div>
				<div className="td">{serial_num || 'N/A'}</div>
				<div className="td">{responsible_person && responsible_person.full_name || 'N/A'}</div>
				<div className="td">{responsible_person && responsible_person.job_position && responsible_person.job_position.name || 'N/A'}</div>
				<div className="td"></div>
				<div className="td fixed-flex min-w-105">{latest && renderExpiryDateSpan(latest.expiry)}</div>
				<div className="td fixed-flex flex grid-gap-5 min-w-240">
					<ExpiryButtons item={item} listName={listName}/>
				</div>
				{renderActionsCol && renderActionsCol(item, idx, onClick)}
				{!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
					<ActionsButton idx={idx} isEmployee className="btn btn-primary pull-right min-w-40"
					               onClick={onClick}/>
				</div>}
			</TRow>;
		}
//        const {id, data: {fuel_usage, working_hrs_or_km}} = item;
		const {
			id, data: {
				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
				client, project, site,
				//1 done
				asset_detail: {
					owning_company,
					name,
					asset_type,
					desc,
					manufacturer,
					model,
					reg_num,
					serial_num,
					location,
					toolkit,
					condition,
					barcode,
					qr_code,
					notes,
				},
				//2 done
				photo_list,
				profile_pic: profile_pic_list,
				//3 done
				responsible_person,
				// //4 done
				// doc_list,
				// //5 done
				// purchase_info,
				// //6 done
				// depreciation,
				// //7 done
				monitoring_plan_list,
				// //8 done
				// maintenance_plan_list,
				// //9 done
				// calibration_record_list,
				// //10
				// inspection_template_list = [],
				// inspection_list = [],
			}
		} = item;
		
		const lastMonitoringPlan = (monitoring_plan_list || []).getLastElement();
		const {
			// id,
			working_distance_or_time_list = [],
			fuel_usage_list = [],
		} = lastMonitoringPlan || {};
//
		working_distance_or_time_list.sortBy('date');
		const {
			working_hrs_or_km_opening,
			working_hrs_or_km_closing,
			working_hrs_or_km: working_distance_or_time_total,
			date: working_distance_or_time_date,
		} = working_distance_or_time_list.getLastElement() || {};
		const {
			refilled_fuel,
			current_hrs_or_km,
			working_hrs_or_km: fuel_working_hrs_or_km,
			date: fuelDate,
			receipt,
			cost
		} = fuel_usage_list.getLastElement() || {};
		
		const nextFuelDate = (Dates.parse(fuelDate) || new Date()).addWeeks(1);
		const fuel_usage = fuel_usage_list.filter(v => !!v.refilled_fuel).map(v => v.refilled_fuel).reduce((a, b) => a + b, 0);
		
		const isHours = !['Vehicles', 'Small Plant'].contains(asset_type);
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex min-w-30">{id}</div>
			<div className="td">{asset_type}</div>
			<div className="td">{name}</div>
			<div className="td fixed-flex min-w-280">{reg_num}</div>
			<div className="td fixed-flex min-w-280 flex padding-t-5 padding-b-5 padding-r-10">
				{monitoring_plan_list.isEmpty() && 'N/A'}
				{fuelDate && <span className="text-center">Date<br/>{Dates.formatDate(fuelDate)}</span>}
				{fuel_usage && <span className="text-center">Fuel Used<br/>{fuel_usage}l</span>}
				{fuel_working_hrs_or_km &&
					<span
						className="text-center">{isHours ? 'Time' : 'Distance'}<br/>{fuel_working_hrs_or_km}{isHours ? 'hrs' : 'km'}</span>}
			</div>
			<div className="td fixed-flex min-w-160">{Dates.formatDate(nextFuelDate)}</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	
	render() {
		const {state, state: {expiry_date}} = this;
		return <>
			<ViewByButtonsBox
				ref="viewButtonsRefBox"
				state={state}
				titleSingular="Monitoring Plan"
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

export default MonitoringPlanTab;
