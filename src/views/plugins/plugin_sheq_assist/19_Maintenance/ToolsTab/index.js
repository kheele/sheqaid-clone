// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {
	onSelectLoadAssetLocations,
	onSelectLoadAssetManufacturers
} from 'views/plugins/utils';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput, SelectAssetTypeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import WrittenOffDialog from '../dialogs/WrittenOffDialog.js';
import NewToolDialog from './forms/NewToolDialog.js';
import EditToolDialog from './forms/EditToolDialog.js';
import ProfileToolDialog from './forms/ProfileToolDialog.js';
import CheckInToolDialog from '../dialogs/CheckInToolDialog.js';
import CheckOutToolDialog from '../dialogs/CheckOutToolDialog.js';

import ExportAssetsDialog from '../dialogs/ExportAssetsDialog.js';

import style from "./ToolsTab.lazy.css";

import ProfilePDFReader from '../printers/ProfilePDFReader';
import {CONSTANTS} from "./forms/AssetComponents";
import byLogged from "./Query/List/listAllToolsByLogged";

// </editor-fold>
@observer
class ToolsTab extends React.Component {

	pageKey = "ToolsTab";

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

		this.onFilter = this.onFilter.bind(this);

		this.onAddMonitoringService = this.onAddMonitoringService.bind(this);
		this.onAddMaintenanceService = this.onAddMaintenanceService.bind(this);
		this.onAddCalibrationService = this.onAddCalibrationService.bind(this);

		this.onStartInspection = this.onStartInspection.bind(this);
		this.onCreateInspection = this.onCreateInspection.bind(this);

		this.onExport = this.onExport.bind(this);

		this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
		this.onChangeStatus = this.onChangeStatus.bind(this);
		this.onWriteOffTools = this.onWriteOffTools.bind(this);

		this.renderFilterNode = this.renderFilterNode.bind(this);
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);

		this.renderItem = this.renderItem.bind(this);
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

	onFilter({group, title, value}) {
		// alert(title)
	}

	// <editor-fold defaultstate="collapsed" desc="actions">
	onExport(e, btn) {
		this.refs.exportAssetsDialog.open();
	}

	async onSaveAsPDF(e, btn) {
		const {idx} = btn.props;
		const item = this.refs.root.list[idx];
		this.refs.pdfReader.open(item);
	}

	onChangeStatus(e, btn) {
		const open = item => {
			let {checkOutToolDialog, checkInToolDialog} = this.refs;
			let dlg;
			if (item) {
				const {status} = item.data;
				if (status === 'In Storage') {
					dlg = 'Out';
				} else if (status === 'Checked Out') {
					//            checkInToolDialog.open(item);
					dlg = 'In';
				} else if (status === 'Loaned Out') {
					//             checkInToolDialog.open(item);
					dlg = 'In';
				} else if (status === 'Out For Repair') {
					//            checkInToolDialog.open(item);
					dlg = 'In';
				} else {
					dlg = 'Out';
				}
			} else {
				if (btn.props.action === 'In Storage') {
					dlg = 'In';
				} else {
					dlg = 'Out';
					checkOutToolDialog = checkOutToolDialog.extraProp('status', btn.props.action);
				}
			}
			if (dlg === 'Out') {
				item && (checkOutToolDialog = checkOutToolDialog.extraProp('item', item));
				checkOutToolDialog.open(res => {
					list.filter(v => !!res[v.id]).forEach(v => {
						if (!v.data.register_list) v.data.register_list = [];
						v.data.register_list.push(res[v.id]);
					});
				});
			} else {
				item && (checkInToolDialog = checkInToolDialog.extraProp('item', item));
				checkInToolDialog.open(res => {
					list.filter(v => !!res[v.id]).forEach(v => {
						if (!v.data.register_list) v.data.register_list = [];
						v.data.register_list.push(res[v.id]);
					});
				});
			}
		};
		if (btn.props.action) {
			open();
		} else {
			let idx = btn.props.idx;
			const {list} = this.refs.root;
			const item = list[idx];
			if (item) {
				open(item);
			}
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

	onAddMaintenanceService(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('index', CONSTANTS.MAINTENANCE).open(item);
		}
	}

	onAddCalibrationService(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('index', CONSTANTS.CALIBRATION).open(item);
		}
	}

	onStartInspection(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('index', CONSTANTS.CALIBRATION).open(item);
		}
	}

	onCreateInspection(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		if (item) {
			this.refs.editDialog.extraProp('index', CONSTANTS.CALIBRATION).open(item);
		}
	}

	onWriteOffTools(e, el) {
		if (el && 'idx' in el.props) {
			let idx = el.props.idx;
			const {list} = this.refs.root;
			const item = list[idx];
			if (item) {
				this.refs.writtenOffDialog.extraProp('item', item).open();
			}
		} else {
			this.refs.writtenOffDialog.open();
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee || isContractorView;
		return !isReadonly && <div className="left-buttons pull-left">
			<Button className="btn btn-primary pull-right" onClick={this.onExport}>
				Export
			</Button>
			<Button className="btn btn-primary pull-right _888" action="In Storage" onClick={this.onChangeStatus}>
				Check In
			</Button>
			<Button className="btn btn-primary pull-right _888" action="Checked Out" onClick={this.onChangeStatus}>
				Check Out
			</Button>
			<Button className="btn btn-primary pull-right _888" action="Loaned Out" onClick={this.onChangeStatus}>
				Loan Out
			</Button>
			<Button className="btn btn-primary pull-right _888" action="Out For Repair" onClick={this.onChangeStatus}>
				Out For Repair
			</Button>
			<Button className="btn btn-primary pull-right _888" onClick={this.onWriteOffTools}>
				Write Off
			</Button>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		const item = this.refs.root.list[idx];
		const {id, data: {inspection_template_list = [], inspection_list = [],}} = item;
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
			<hr action="writable"/>
			<NavItem action="writable" idx={idx} onClick={this.onAddMonitoringService} faIconLeft="plus"
			         title="Add Monitoring Service"/>
			<NavItem action="writable" idx={idx} onClick={this.onAddMaintenanceService} faIconLeft="plus"
			         title="Add Maintenance Service"/>
			<NavItem action="writable" idx={idx} onClick={this.onAddCalibrationService} faIconLeft="plus"
			         title="Add Calibration Service"/>
			<hr action="writable"/>
			{inspection_template_list.isNotEmpty() && <NavItem action="writable" idx={idx} onClick={this.onStartInspection} faIconLeft="plus"
			         title="Start Inspection"/>}
			{inspection_template_list.isEmpty() && <NavItem action="writable" idx={idx} onClick={this.onCreateInspection} faIconLeft="plus"
			         title="Create Inspection"/>}
			<hr action="writable"/>
			<NavItem action="writable" idx={idx} onClick={this.onWriteOffTools} faIconLeft="ban" title="Write Off"/>
			<hr action="writable"/>
			<NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
		</Options>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFilterNode">
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
			<ClearableInput name="reg_num" type="text" placeholder="Registration No." className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange}/>
			<ClearableInput name="serial_num" type="text" placeholder="Serial No." className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange}/>
			<ClearableInput name="model" type="text" placeholder="Model" className="col-lg-4 margin-t-10 form-control"
			                onChange={onChange}/>
			{/*<Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>*/}
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHead">
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td fixed-flex min-w-80">Photo</div>
			<div className="td">Type</div>
			<div className="td">Name</div>
			<div className="td">Manufacturer</div>
			<div className="td fixed-flex min-w-100">Reg No.</div>
			<div className="td fixed-flex min-w-160">Serial No.</div>
			<div className="td fixed-flex min-w-80">Condition</div>
			<div className="td fixed-flex min-w-100">Status</div>
			<div className="td fixed-flex min-w-170 padding-l-0 padding-r-0"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		if (!('statusVal' in item.data)) {
			item.data.statusVal = computed(() => {
				const {status} = item.data;
				// console.log(item.id, 'status', status)
				if (status === 'In Storage') {
					return 'Check Out';
				} else if (status === 'Checked Out') {
					return 'Check In';
				} else if (status === 'Loaned Out') {
					return 'Check In';
				} else if (status === 'Out For Repair') {
					return 'Check In';
				}
				return 'Check Out';
			});
		}
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
				// maintenance_plan_list,
				// //9 done
				// calibration_record_list,
				// //10
				// inspection_template_list = [],
				// inspection_list = [],
			}
		} = item;

		const statusValFinal = statusVal.get ? statusVal.get() : statusVal;

		let [profile_pic] = profile_pic_list || [];
		if(!profile_pic) {
			profile_pic = (photo_list || [])[0];
		}

		// console.log('Assets', item)
		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td fixed-flex min-w-80">{RenderUtils.renderImage(profile_pic)}</div>
			<div className="td">{asset_type}</div>
			<div className="td">{name || 'N/A'}</div>
			<div className="td">{manufacturer || 'N/A'}</div>
			<div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
			<div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
			<div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
			<div className="td fixed-flex min-w-100">{status}</div>
			<div className="td fixed-flex min-w-170 flex-center padding-l-0 padding-r-0">
				<Button idx={n} className="btn btn-primary pull-right w-100 margin-r-5"
				        onClick={this.onChangeStatus}>{statusValFinal}</Button>
				<Button idx={n} className="btn btn-primary pull-right w-40" onClick={onClick}>
					<i className="fa fa-bars"/>
				</Button>
			</div>
		</TRow>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		return <APageListReadWrite
			hasBackBtn={false}
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={this.pageKey + "-tab"}
			pageTitle="Assets"
			pageTitleSingular="asset"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>

			<NewToolDialog ref="newDialog"/>
			<EditToolDialog ref="editDialog"/>
			<ProfileToolDialog ref="profileDialog"/>

			<WrittenOffDialog ref="writtenOffDialog"/>
			<CheckInToolDialog ref="checkInToolDialog"/>
			<CheckOutToolDialog ref="checkOutToolDialog"/>
			<ExportAssetsDialog ref="exportAssetsDialog"/>
			<ProfilePDFReader ref="pdfReader"/>
		</APageListReadWrite>;
	}

	// </editor-fold>
}

/*
 tool: name, barcode/qrcode, category
 Date, Surname, Name, Type of tools, Quantity, Employee Signature
 */
export default ToolsTab;
