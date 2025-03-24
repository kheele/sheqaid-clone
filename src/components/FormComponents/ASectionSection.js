//<editor-fold desc="imports">
import {observer} from "mobx-react";
import React from "react";
import {computed, extendObservable, observable} from "mobx";
import CreateAndEditBar from "./CreateAndEditBar";
import {SliderWithChildren} from "../lists";

//</editor-fold>

@observer
class ASectionSection extends React.Component {

    @observable
    state = {
        newList: [],
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onView = this.onView.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.itemAdded = this.itemAdded.bind(this);
    }

    //</editor-fold>

    //<editor-fold desc="isNewEmployee">
    @computed get isNewEmployee() {
        const {isNewEmployee} = this.props;
        return isNewEmployee;
    }

    get isRemovedItem() {
        const {
            props: {onChange, onInsert, onUpdate, isEmbedded, isNewEmployee, embeddedEmployee, item_id_key},
        } = this;
        if (!embeddedEmployee) return false;
        let {data, removed, written_off} = embeddedEmployee;
        removed = removed || data && data.removed;
        written_off = written_off || data && data.written_off;
        return removed || written_off;
    }

    //</editor-fold>

    //<editor-fold desc="isMaxReached">
    @computed get isMaxReached() {
        if (!this.maxList) {
            return false;
        }

        const {maxList, list} = this;
        return list.length === maxList;
    }

    //</editor-fold>

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

    //<editor-fold desc="item">
    @computed get item() {
        return this.props.item;
    }

    //</editor-fold>

    //<editor-fold desc="itemData">
    @computed get itemData() {
        const {item} = this;
        return item && item.data;
    }

    //</editor-fold>

    componentDidMount() {
        const {formData, defaultValue} = this.props;
        console.log('ASectionSection', formData);
        if (this.isNewEmployee) {
            if (defaultValue || (formData && formData[this.listName])) {
                this.state.newList = defaultValue || formData[this.listName];
            }
        }
    }

    //</editor-fold>

    //<editor-fold desc="onView">
    onView(evt, btn) {
        const {type} = btn.props;

        const {list, isNewEmployee} = this;

        const {sliderIndex = 0} = this.refs.slider;
        let item = list[sliderIndex];
        console.log('onView', sliderIndex, item)

        let dialog;
        if (type) {
            dialog = this.refs.profileDialog.extraProp('type', type);
        } else {
            dialog = this.refs.profileDialog;
        }

        dialog.open(item);
    }

    //</editor-fold>

    //<editor-fold desc="onCreate">
    onCreate(evt, btn) {
        const {type, isMaxReached} = this;

        if (isMaxReached) {
            return infoDialog.open(`Maximum of ${this.maxList} items are allowed.`);
        }

        let dialog;
        if (type) {
            dialog = this.refs.newDialog.extraProp('type', type);
        } else {
            dialog = this.refs.newDialog;
        }

        if (this.isNewEmployee) {
            dialog.open().then(newItem => {
                if (newItem) {
                    if (type) {
                        newItem.type = type;
                    }
                    this.itemAdded(newItem);
                }
            });
        } else {
            dialog.open(this.props.item).then(newItem => {
                if (newItem && newItem.data) {
                    const newData = newItem.data;
                    this.itemAdded(newData);
                }
            });
        }
    }

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
        const {state: {newList}, props: {onChange}, type} = this;
        let {listName} = this;
        const {itemData} = this;
        if (itemData) {
            const {[listName]: list} = itemData;
            if (list) {
                list.push(newItemData);
                this.updateIndexes();
                console.log(itemData, newItemData);
            } else {
                extendObservable(itemData, {[listName]: [newItemData]});
                console.log(listName, itemData, newItemData);
            }
        } else {
            newList.push(newItemData);
            this.updateIndexes();

            if (type) {
                listName = `${listName}__${type}`;
            }
            onChange && onChange(newList, listName, this);
        }
    }

    //</editor-fold>

    //<editor-fold desc="updateIndexes">
    updateIndexes() {
        const {slider} = this.refs;
        setTimeout(() => slider.moveEnd());
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {
            props: {onChange, onInsert, onUpdate, isEmbedded, isNewEmployee, embeddedEmployee, item_id_key},
            type,
            list,
            listName,
            itemRenderer,
            NewDialog,
            EditDialog,
            ProfileDialog
        } = this;

        return <>
            {!this.isRemovedItem && <CreateAndEditBar
                type={type}
                onView={ProfileDialog && this.onView}
                onRemove={this.onRemove}
                onEdit={this.onEdit}
                onCreate={this.onCreate}
                list={list}
                isEmbedded={isEmbedded}
            />}
            <SliderWithChildren
                ref="slider"
                title="Details"
                rowClassName="padding-l-10 padding-v-10"
                indexFilter={v => !v || v.is_default}
                list={list}
            >
                {itemRenderer}
            </SliderWithChildren>

            {!this.isRemovedItem && <>
                <NewDialog ref="newDialog" isNewEmployee={isNewEmployee} embeddedEmployee={embeddedEmployee}
                           onInsert={onInsert} onUpdate={onUpdate} listName={listName} item_id_key={item_id_key}/>
                <EditDialog ref="editDialog" isNewEmployee={isNewEmployee} embeddedEmployee={embeddedEmployee}
                            onInsert={onInsert} onUpdate={onUpdate} listName={listName} item_id_key={item_id_key}/>
            </>}
            {ProfileDialog && !isNewEmployee &&
                <ProfileDialog ref="profileDialog" isNewEmployee={isNewEmployee} embeddedEmployee={embeddedEmployee}
                               onInsert={onInsert} onUpdate={onUpdate} listName={listName} item_id_key={item_id_key}/>}
        </>;
    }

    //</editor-fold>
}

export default ASectionSection;
