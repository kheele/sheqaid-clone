import {observer} from "mobx-react";
import React from "react";
import {computed, extendObservable} from "mobx";
import CreateAndEditBar from "../../CreateAndEditBar";
import {SliderWithChildren} from "components/lists";
import {ProfileField, UploadButton} from "components/inputs";
import NewDependantDialog from "./profile_forms/NewDependantDialog";
import EditDependantDialog from "./profile_forms/EditDependantDialog";
import NewDocLivingAddressDialog from "./profile_forms/NewDocLivingAddressDialog";
import EditDocLivingAddressDialog from "./profile_forms/EditDocLivingAddressDialog";

@observer
class ASectionSection extends React.Component {

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onCreate = this.onCreate.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.itemAdded = this.itemAdded.bind(this);
	}

	//</editor-fold>

	//<editor-fold desc="onCreate">
	onCreate(evt, btn) {
		const {type} = btn.props;

		let dialog;
		if(type) {
			dialog = this.refs.newDialog.extraProp('type', type);
		} else {
			dialog = this.refs.newDialog;
		}

		dialog.open(this.props.item).then(newItem => {
			if (newItem && newItem.data) {
				const newData = newItem.data;
				this.itemAdded(newData);
			}

			// const {tabWrapper, tabWrapper: {index}} = this.refs;
			// if (index === 0) {
			//     tabWrapper.updateDashboard();
			// } else if (index === 1) {
			//     tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === newData.id));
			// }
		});
	}

	//</editor-fold>

	//<editor-fold desc="onEdit">
	onEdit(evt, btn) {
		const {type} = btn.props;

		const {list} = this;

		const {sliderIndex = 0} = this.refs.slider;
		let updateItem = list[sliderIndex];
		console.log('onEdit', sliderIndex, updateItem)
		updateItem = {id: updateItem.id, data: updateItem};

		let dialog;
		if(type) {
			dialog = this.refs.editDialog.extraProp('type', type);
		} else {
			dialog = this.refs.editDialog;
		}

		dialog.open(updateItem).then(editedItem => {
			if (editedItem && editedItem.data) {
				extendObservable(updateItem, editedItem.data);
			}
		});
	}

	//</editor-fold>

	//<editor-fold desc="itemAdded">
	itemAdded(newItemData) {
		const {itemData} = this;
		if (itemData) {
			const {listName} = this;
			const {[listName]: list} = itemData;
			if (list) {
				list.push(newItemData);
			} else {
				itemData[listName] = [newItemData];
			}
		}
	}

	//</editor-fold>

	//<editor-fold desc="list">
	@computed get list() {
		const {isNew} = this.props;
		if(isNew) {
			return [null];
		}

		const {itemData} = this;
		const {listName} = this;
		const {[listName]: list} = itemData || {};
		return list || [];
	}

	//</editor-fold>

	//<editor-fold desc="itemData">
	@computed get itemData() {
		const {item} = this.props;
		return item && item.data;
	}

	//</editor-fold>

	//<editor-fold desc="render">
	render() {
		const {props: {onChange}, type, list, itemRenderer, NewDialog, EditDialog} = this;

		return <>
			<CreateAndEditBar type={type} onEdit={this.onEdit} onCreate={this.onCreate} list={list}/>
			<SliderWithChildren
				ref="slider"
				title="Details"
				rowClassName="padding-l-10 padding-v-10"
				indexFilter={v => !v || v.is_default}
				list={list}
			>
				{itemRenderer}
			</SliderWithChildren>

			<NewDialog ref="newDialog"/>
			<EditDialog ref="editDialog"/>
		</>;
	}

	//</editor-fold>
}

export default ASectionSection;