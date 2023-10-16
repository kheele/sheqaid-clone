// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {
	onSelectLoadAssetLocations,
	onSelectLoadAssetManufacturers
} from 'views/plugins/utils';

import {Dates} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectAssetTypeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ProfileToolDialog from '../ToolsTab/forms/ProfileToolDialog.js';
import EditToolDialog from '../ToolsTab/forms/EditToolDialog.js';

import style from "./MonitoringPlanTab.lazy.css";
import {CONSTANTS} from "../ToolsTab/forms/AssetComponents";
import byLogged from "./Query/List/listAllMonitoringPlansByLogged";

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
		loadedSelectLists: false
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onLoadList = this.onLoadList.bind(this);

		this.onView = this.onView.bind(this);
		this.onAddMonitoringService = this.onAddMonitoringService.bind(this);

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

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			name,
			reg_num,
			serial_num,
			model,
			condition,
			location,
			manufacturer,
			asset_type,
		} = filterData || {};
		
		const limit = 50;
		
		const args = {
			name,
			reg_num,
			serial_num,
			model,
			condition,
			location,
			manufacturer,
			asset_type,
			written_off: false,
			//
			limit,
			//
			exact_orgs: true,
		};
		
		if (!isNew) {
			args.offset = this.refs.root.list.length;
		} else {
			args.offset = 0;
		}
		
		return byLogged(args).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>

	onView(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.profileDialog.extraProp('index', CONSTANTS.MONITORING).open(item);
		}
	}

	onAddMonitoringService(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('index', CONSTANTS.MONITORING).open(item);
		}
	}

	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={this.onView} faIconLeft="eye" title="View"/>
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
		return <THead>
			<div className="td">Type</div>
			<div className="td">Name</div>
			<div className="td fixed-flex min-w-280">Registration No.</div>
			<div className="td fixed-flex min-w-280">Last Fuel & Mileage Usage</div>
			<div className="td fixed-flex min-w-160">Next Monitoring Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
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
		return <TRow key={"item-" + n} className="w-full">
			<div className="td">{asset_type}</div>
			<div className="td">{name}</div>
			<div className="td fixed-flex min-w-280">{reg_num}</div>
			<div className="td fixed-flex min-w-280 flex padding-t-5 padding-b-5 padding-r-10">
				{monitoring_plan_list.isEmpty() && 'N/A'}
				{fuelDate && <span className="text-center">Date<br/>{Dates.formatDate(fuelDate)}</span>}
				{fuel_usage && <span className="text-center">Fuel Used<br/>{fuel_usage}l</span>}
				{fuel_working_hrs_or_km &&
					<span className="text-center">{isHours ? 'Time' : 'Distance'}<br/>{fuel_working_hrs_or_km}{isHours ? 'hrs' : 'km'}</span>}
			</div>
			<div className="td fixed-flex min-w-160">{Dates.formatDate(nextFuelDate)}</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}

	render() {
		return <APageListReadWrite
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
		</APageListReadWrite>;
	}
}

export default MonitoringPlanTab;
