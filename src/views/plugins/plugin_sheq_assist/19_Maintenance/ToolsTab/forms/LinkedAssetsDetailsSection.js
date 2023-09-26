import {observer} from "mobx-react";
import React from "react";
import {ProfileField, UploadButton} from "components/inputs";
import {ASectionSection} from "components/FormComponents";
import NewToolDialog from "./NewToolDialog";
import EditToolDialog from "./EditToolDialog";
import {computed} from "mobx";
import updateAsset from "mutations/all/Asset/updateAsset";

@observer
class LinkedAssetsDetailsSection extends ASectionSection {

	onUpdate = updateAsset;
	NewDialog = NewToolDialog;
	EditDialog = EditToolDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	get listName() {
		return this.props.listName;
	}

	//<editor-fold desc="list">
	@computed get list() {
		if (this.isNewEmployee) {
			return this.state.newList;
		}

		const {itemData, listName} = this;
		const {[listName]: list} = itemData || {};
		if(listName === 'asset_parent_list') {
			return (list || []).map((
				{
					parent_asset: {id, asset_detail, photo_list, profile_pic, responsible_person, status, written_off}
				}
			) => ({
				...asset_detail,
				id, //Asset ID must override spread asset_detail
				photo_list, profile_pic, responsible_person, status, written_off
			}));
		}
		if(listName === 'asset_children_list') {
			return (list || []).map((
				{
					child_asset: {id, asset_detail, photo_list, profile_pic, responsible_person, status, written_off}
				}
			) => ({
				...asset_detail,
				id, //Asset ID must override spread asset_detail
				photo_list, profile_pic, responsible_person, status, written_off
			}));
		}
		return [];
	}
	//</editor-fold>

	get itemRenderer() {
		return [
			<ProfileField
				name="owning_company"
				placeholder="Owning Company Name"
				valKey="owning_company"
				className="col-lg-12"
			/>,
			<ProfileField
				name="name"
				placeholder="Asset Name"
				valKey="name"
			/>,
			<ProfileField
				name="asset_type"
				placeholder="Asset Type"
				valKey="asset_type"
			/>,
			<ProfileField
				name="desc"
				type="textarea"
				placeholder="Description"
				valKey="desc"
				className="col-lg-12"
			/>,

			<ProfileField
				name="manufacturer"
				placeholder="Manufacturer"
				valKey="manufacturer"
				className="col-lg-4"
			/>,
			<ProfileField
				name="model"
				placeholder="Model"
				valKey="model"
				className="col-lg-4"
			/>,
			<ProfileField
				name="reg_num"
				placeholder="Registration No."
				valKey="reg_num"
				className="col-lg-4"
			/>,

			<ProfileField
				name="serial_num"
				placeholder="Serial No."
				valKey="serial_num"
				className="col-lg-4"
			/>,
			<ProfileField
				name="location"
				placeholder="Location"
				valKey="location"
				className="col-lg-4"
			/>,
			<ProfileField
				name="toolkit"
				placeholder="Toolkit"
				valKey="toolkit"
				className="col-lg-4"
			/>,

			<ProfileField
				name="condition"
				placeholder="Condition"
				valKey="condition"
				className="col-lg-4"
			/>,
			<ProfileField
				name="barcode"
				placeholder="Barcode"
				valKey="barcode"
				className="col-lg-4"
			/>,
			<ProfileField
				name="qr_code"
				placeholder="QR Code"
				valKey="qr_code"
				className="col-lg-4"
			/>,

			<ProfileField
				name="responsible_person"
				placeholder="Responsible Person"
				valKey="responsible_person"
				renderer={v => v.full_name}
				className="col-lg-12"
			/>,
		];
	}

}

export default LinkedAssetsDetailsSection;