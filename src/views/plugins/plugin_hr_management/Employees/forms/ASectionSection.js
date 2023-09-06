import {observer} from "mobx-react";
import React from "react";
import {computed, extendObservable, observable} from "mobx";
import CreateAndEditBar from "../../CreateAndEditBar";
import {SliderWithChildren} from "components/lists";
import {ProfileField, UploadButton} from "components/inputs";
import NewDependantDialog from "./profile_forms/NewDependantDialog";
import EditDependantDialog from "./profile_forms/EditDependantDialog";
import NewDocLivingAddressDialog from "./profile_forms/NewDocLivingAddressDialog";
import EditDocLivingAddressDialog from "./profile_forms/EditDocLivingAddressDialog";

@observer
class ASectionSection extends React.Component {

	@observable
	state = {
		newList: [],
	};

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onCreate = this.onCreate.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.itemAdded = this.itemAdded.bind(this);
	}

	//</editor-fold>

	//<editor-fold desc="onCreate">
	onCreate(evt, btn) {
		const {type} = this;

		let dialog;
		if (type) {
			dialog = this.refs.newDialog.extraProp('type', type);
		} else {
			dialog = this.refs.newDialog;
		}

		if (this.isNewEmployee) {
			dialog.open().then(newItem => {
				if (newItem) {
					console.log(type, newItem)
					this.itemAdded(newItem);
				}

				// const {tabWrapper, tabWrapper: {index}} = this.refs;
				// if (index === 0) {
				//     tabWrapper.updateDashboard();
				// } else if (index === 1) {
				//     tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === newData.id));
				// }
			});
		} else {
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
	}

	//</editor-fold>

	//<editor-fold desc="onEdit">
	onEdit(evt, btn) {
		const {type} = btn.props;

		const {list, isNewEmployee} = this;

		if (isNewEmployee) {
			const {state: {newList}} = this;
			const {sliderIndex = 0} = this.refs.slider;
			let updateItem = newList[sliderIndex];
			console.log('onEdit', sliderIndex, updateItem)
//
			let dialog;
			if (type) {
				dialog = this.refs.editDialog.extraProp('type', type);
			} else {
				dialog = this.refs.editDialog;
			}

			dialog.open({data: updateItem}).then(editedItem => {
				if (editedItem) {
					extendObservable(updateItem, editedItem);
				}
			});
		} else {
			const {sliderIndex = 0} = this.refs.slider;
			let updateItem = list[sliderIndex];
			console.log('onEdit', sliderIndex, updateItem)
			updateItem = {id: updateItem.id, data: updateItem};

			let dialog;
			if (type) {
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
	}

	//</editor-fold>

	//<editor-fold desc="onRemove">
	onRemove(evt, btn) {
		const {list, isNewEmployee, onUpdate, listName, props: {onChange}} = this;

		confirmDialog.open('Are you sure you want to remove the record').then(res => {
			if (res) {
				const {sliderIndex = 0} = this.refs.slider;

				if (isNewEmployee) {
					const {state: {newList}} = this;
					newList.removeAt(sliderIndex);
					onChange && onChange(newList, listName, this);
					infoDialog.open("Record successfully removed.");
					infoDialog.close(2000);
				} else {
					const removeItem = list[sliderIndex];

					onUpdate && onUpdate({id: removeItem.id, removed: true}).then(res => {
						if (res) {
							list.removeAt(sliderIndex);
							infoDialog.open("Record successfully removed.");
							infoDialog.close(2000);
						} else {
							infoDialog.open("Sorry! The record couldn't be removed. Please try again later.");
						}
					});
				}
			}
		});
	}
	//</editor-fold>

	//<editor-fold desc="itemAdded">
	itemAdded(newItemData) {
		const {state: {newList}, props: {onChange}, listName} = this;
		const {itemData} = this;
		if (itemData) {
			const {[listName]: list} = itemData;
			if (list) {
				list.push(newItemData);
			} else {
				itemData[listName] = [newItemData];
			}
		} else {
			newList.push(newItemData);
			onChange && onChange(newList, listName, this);
		}
	}

	//</editor-fold>

	@computed get isNewEmployee() {
		const {isNewEmployee} = this.props;
		return isNewEmployee;
	}

	//<editor-fold desc="list">
	@computed get list() {
		if (this.isNewEmployee) {
			return this.state.newList;
		}

		const {itemData, listName} = this;
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
		const {props: {onChange, isEmbedded, isNewEmployee}, type, list, itemRenderer, NewDialog, EditDialog} = this;

		return <>
			<CreateAndEditBar
				type={type}
				onRemove={this.onRemove}
				onEdit={this.onEdit}
				onCreate={this.onCreate}
				list={list}
				isEmbedded={isEmbedded}
			/>
			<SliderWithChildren
				ref="slider"
				title="Details"
				rowClassName="padding-l-10 padding-v-10"
				indexFilter={v => !v || v.is_default}
				list={list}
			>
				{itemRenderer}
			</SliderWithChildren>

			<NewDialog ref="newDialog" isNewEmployee={isNewEmployee}/>
			<EditDialog ref="editDialog" isNewEmployee={isNewEmployee}/>
		</>;
	}

	//</editor-fold>
}

export default ASectionSection;