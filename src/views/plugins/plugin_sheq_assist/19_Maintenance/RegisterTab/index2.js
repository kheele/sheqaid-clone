// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {onSelectLoadAssetLocations, onSelectLoadAssetManufacturers} from 'views/plugins/utils';

import {CalculationUtils, Dates} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectAssetTypeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ProfileToolDialog from '../ToolsTab/forms/ProfileToolDialog.js';
import EditToolDialog from '../ToolsTab/forms/EditToolDialog.js';

import style from "./RegisterTab.lazy.css";
import {CONSTANTS} from "../ToolsTab/forms/AssetComponents";
import byLogged from "./Query/List/listAllMaintanancePlansByLogged";
import MKBox from "../../../../../components/MK/MKBox";

// </editor-fold>

@observer
class RegisterTab extends React.Component {
	
	pageKey = "RegisterTab";
	
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
		this.onAddMaintenanceService = this.onAddMaintenanceService.bind(this);
		
		this.onPrintForm = this.onPrintForm.bind(this);
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
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
	
	onPrintForm() {
		this.refs.newMaintanancePlanPrintDialog.open();
	}
	
	onView(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.profileDialog.extraProp('rowIdx', CONSTANTS.MAINTENANCE).open(item);
		}
	}
	
	onAddMaintenanceService(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('rowIdx', CONSTANTS.MAINTENANCE).open(item);
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
			<NavItem action="view" onClick={this.onView} faIconLeft="eye" title="View"/>
			<NavItem action="writable" idx={idx} onClick={this.onAddMaintenanceService} faIconLeft="plus"
			         title="Add Maintenance Service"/>
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
			<div className="td fixed-flex min-w-30">ID</div>
			<div className="td">Type</div>
			<div className="td">Name</div>
			<div className="td fixed-flex min-w-280">Registration No.</div>
			<div className="td fixed-flex min-w-220">Last Service</div>
			<div className="td fixed-flex min-w-220">Next Service</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
//        const {id, data: {service_date, service_hrs_or_km, next_service_hrs_or_km, reason_for_service}} = item;
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
            // monitoring_plan_list,
            // //8 done
            maintenance_plan_list,
            // //9 done
            // calibration_record_list,
            // //10
            // inspection_template_list = [],
            // inspection_list = [],
        }
		} = item;
		
		//8 done
		const lastMaintenancePlan = (maintenance_plan_list || []).getLastElement();
		const {
			// id,
			next_service_hrs_or_km,
			plan_list = [],
		} = lastMaintenancePlan || {};
		
		plan_list.sortBy('service_date');
		const {
			reason_for_service,
			service,
			service_hrs_or_km,
			service_date,
		} = plan_list.getLastElement() || {};
		
		const isHours = !['Vehicles', 'Small Plant'].contains(asset_type);
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex min-w-30">{id}</div>
			<div className="td">{asset_type}</div>
			<div className="td">{name || 'N/A'}</div>
			<div className="td fixed-flex min-w-280">{reg_num}</div>
			<div className="td fixed-flex min-w-220 flex flex padding-t-5 padding-b-5 padding-r-10">
				{plan_list.isEmpty() && 'N/A'}
				{service_date && <span className="text-center">Date<br/>{Dates.formatDate(service_date)}</span>}
				{service_hrs_or_km &&
					<span className="text-center">{isHours ? 'Time' : 'Distance'}<br/>{service_hrs_or_km}{isHours ? 'hrs' : 'km'}</span>}
			</div>
			<div className="td fixed-flex min-w-220 flex padding-t-5 padding-b-5">
				<MKBox sx={{background: '#ddd', borderRadius: '0'}} className="text-center">
					Total {isHours ? 'Time' : 'Distance'}<br/>
					{next_service_hrs_or_km}{isHours ? 'hrs' : 'km'}
				</MKBox>
				<MKBox sx={{background: '#ddd', borderRadius: '0'}} className="text-center">
					{isHours ? 'Time' : 'Distance'} left<br/>
					{CalculationUtils.getTimeOrDistanceLeftToNextService(item)}{isHours ? 'hrs' : 'km'}
				</MKBox>
			</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-60">
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
			pageTitle="Asset Register"
			pageTitleSingular="asset register"
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
		</APageListReadWrite>;
	}
}

export default RegisterTab;
