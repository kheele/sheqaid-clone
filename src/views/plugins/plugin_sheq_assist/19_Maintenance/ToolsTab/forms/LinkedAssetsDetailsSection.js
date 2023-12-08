import {observer} from "mobx-react";
import React from "react";
import {ProfileField} from "components/inputs";
import {ASectionSection} from "components/FormComponents";
import NewToolDialog from "./NewToolDialog";
import EditToolDialog from "./EditToolDialog";
import ProfileToolDialog from "./ProfileToolDialog";
import {computed, extendObservable} from "mobx";
import updateAsset from "mutations/all/Asset/updateAsset";
import {Slider} from "components/lists";
import listByIdLinkedParentTools from "../Query/List/listByIdLinkedParentTools";
import listByIdLinkedChildTools from "../Query/List/listByIdLinkedChildTools";

@observer
class LinkedAssetsDetailsSection extends ASectionSection {

    onUpdate = updateAsset;
    NewDialog = NewToolDialog;
    EditDialog = EditToolDialog;
    ProfileDialog = ProfileToolDialog;

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);
    }

    //</editor-fold>
    
    async componentDidMount() {
        const {readonly, isEditing} =  this.props;
        if(readonly || isEditing) {
            const {item, itemData, listName} = this;
            
            let promise;
            if (listName === 'asset_parent_list') {
                promise = listByIdLinkedParentTools({id: item.id});
            } else if (listName === 'asset_children_list') {
                promise = listByIdLinkedChildTools({id: item.id});
            }
            
            if(promise) {
                promise.then(list => {
                    if(list) {
                        list = list.map(({data}) => data);
                        extendObservable(itemData, {[listName]: list});
                    }
                });
            }
        }
    }

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

        console.log('LinkedAssetsDetailsSection', listName, list.slice());

        const {readonly, isEditing} = this.props;
        if(readonly || isEditing) {
            return (list || []).map((
              {
                  id, asset_detail, photo_list, profile_pic, responsible_person, status, written_off
              }
            ) => ({
                ...asset_detail,
                id, //Asset ID must override spread asset_detail
                photo_list, profile_pic, responsible_person, status, written_off
            }));
        }
        
        if (listName === 'asset_parent_list') {
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
        if (listName === 'asset_children_list') {
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

    //<editor-fold desc="imageList">
    @computed get imageList() {
        if (this.isNewEmployee) {
            return [];
        }

        const {itemData, listName} = this;
        const {photo_list: list} = itemData || {};
        return (list || []);
    }

    //</editor-fold>

    get itemRenderer() {
        return [
            <Slider
                ref="slider"
                id="slider"
                name="asset-images"
                title="Asset Images"
                rowClassName="padding-l-10 padding-v-10"
                renderer={v => <img src={v.doc.dlUrls[0]}/>}
                list={this.imageList}
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
                name="owning_company"
                placeholder="Owning Company Name"
                valKey="owning_company"
                className="col-lg-6"
            />,
            <ProfileField
                name="responsible_person"
                placeholder="Responsible Person"
                valKey="responsible_person"
                renderer={v => v.full_name}
                className="col-lg-6"
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
        ];
    }

}

export default LinkedAssetsDetailsSection;
