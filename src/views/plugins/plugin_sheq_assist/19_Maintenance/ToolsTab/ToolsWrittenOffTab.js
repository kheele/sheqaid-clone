// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {
	onSelectLoadAssetLocations,
	onSelectLoadAssetManufacturers
} from 'views/plugins/utils';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput, Clickable, SelectAssetTypeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ProfileToolWrittenOffDialog from '../ToolsTab/forms/ProfileToolWrittenOffDialog.js';
import byLogged from "./Query/List/listAllToolsByLogged";

import style from "./ToolsWrittenOffTab.lazy.css";
import assetProfilePic from "assets/images/vehicle-image-loading.png";

// </editor-fold>

@observer
class ToolsWrittenOffTab extends React.Component {
	pageKey = "ToolsWrittenOffTab";

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

		this.renderFilterNode = this.renderFilterNode.bind(this);
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
		} = filterData || {};

		const limit = 50;

		const args = {
			name,
			written_off: true,
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

	//<editor-fold desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			{/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
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

	//</editor-fold>

	//<editor-fold desc="renderTHead">
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-80">Photo</div>
			<div className="td">Type</div>
			<div className="td">Name</div>
			<div className="td">Manufacturer</div>
			<div className="td fixed-flex min-w-100">Reg No.</div>
			<div className="td fixed-flex min-w-160">Serial No.</div>
			<div className="td fixed-flex min-w-80">Condition</div>
			<div className="td fixed-flex min-w-100">Status</div>
			<div className="td fixed-flex min-w-70 padding-l-0 padding-r-0"></div>
		</THead>;
	}

	//</editor-fold>

	//<editor-fold desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {
			id, data: {
				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/,
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
				//4 done
				doc_list,
				//5 done
				purchase_info,
				//6 done
				depreciation,
				//7 done
				monitoring_plan_list,
				//8 done
				maintenance_plan_list,
				//9 done
				calibration_record_list,
				//10
				inspection_template_list = [],
				inspection_list = [],
			}
		} = item;

		let [profile_pic] = profile_pic_list || [];
		if(!profile_pic) {
			profile_pic = (photo_list || [])[0];
		}

		return <TRow key={id}>
			<div className="td fixed-flex min-w-80">
				<Clickable idx={n} onClick={this.refs.root.onView}>
					{RenderUtils.renderImage(profile_pic && profile_pic.doc, null, '100%', assetProfilePic)}
				</Clickable>
			</div>
			<div className="td">{asset_type}</div>
			<div className="td">{name || 'N/A'}</div>
			<div className="td">{manufacturer || 'N/A'}</div>
			<div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
			<div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
			<div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
			<div className="td fixed-flex min-w-100">{status}</div>
			<div className="td fixed-flex min-w-60 padding-l-0 padding-r-0">
				<Button idx={n} className="btn btn-primary pull-right w-40" onClick={onClick}>
					<i className="fa fa-bars"/>
				</Button>
			</div>
		</TRow>;
	}

	//</editor-fold>

	//<editor-fold desc="render">
	render() {
		return <APageListReadWrite
			hasBackBtn={false}
			ref="root"
			page={this}
			pageId={this.pageKey + "-tab"}
			pageTitle="Tools Written Off"
			pageTitleSingular="tool written off"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>

			<ProfileToolWrittenOffDialog ref="profileDialog"/>
		</APageListReadWrite>;
	}

	//</editor-fold>
}

/*
 scan with phone qr/bar code
 Date, Surname, Name, Type of tools, Quantity, Reason, Employee Signature
 management approval/disaproval()
 */

export default ToolsWrittenOffTab;
