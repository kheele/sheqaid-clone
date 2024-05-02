import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {Dates} from "utils/Utils";

import {Button, ClearableInput, Clickable, ProfileField} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';

import style from "./SelectedAssets.lazy.css";
import assetProfilePic from "../../../../../assets/images/vehicle-image-loading.png";

@observer
class SelectedAssets extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeReason = this.onChangeReason.bind(this);
        this.renderTHead = renderTHead.bind(this);
        this.renderItem = renderItem.bind(this);

        this.form = new Form();
        this.form.addChangeOne("reason", this.onChangeReason);
    }
    
    onChangeReason(el, val) {
        
    }
    
    componentWillMount() {
        style.use();
    }
    
    componentWillUnmount() {
        style.unuse();
    }
    
    render() {
        const {state: {asset, assets}, onChangeAsset, title} = this.props;
        console.log('asset', asset)
        if(!asset && !assets) {
            return <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeAsset}>Add Asset(s)...</Button>;
        }
        if(asset) {
            const {
                id,
                data: {
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
                }
            } = asset;
            
            let [profile_pic] = profile_pic_list || [];
            if (!profile_pic) {
                profile_pic = (photo_list || [])[0];
            }
            
            return <React.Fragment>
                <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeAsset}>Add / Change Asset(s)...</Button>
                <hr className="margin-r-10 margin-t-10 margin-b-15"/>
                <label className="hor-center selected-asset-title">Selected Asset Details</label>
                    <ProfileField title="Tool Photo" value={profile_pic} type="file" className="col-lg-12"/>
                    <ProfileField title="Asset Type" value={asset_type} className="col-lg-12"/>
                    <ProfileField title="Manufacturer" value={manufacturer} className="col-lg-12"/>
                    <ProfileField title="Serial No." value={serial_num} className="col-lg-12"/>
                    <ProfileField title="Description" value={desc} className="col-lg-12"/>

                    <ProfileField title="Model" value={model} className="col-lg-6"/>

                    <ProfileField title="Location" value={location} className="col-lg-6"/>
                    <ProfileField title="Toolkit" value={toolkit} className="col-lg-6"/>
                    <ProfileField title="Condition" value={condition} className="col-lg-6"/>
                    <ProfileField title="Notes" value={notes} className="col-lg-12"/>
             </React.Fragment>;
        } else {
            return <React.Fragment>
                <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeAsset}>Add / Change Asset(s)...</Button>
                <hr className="margin-r-10 margin-t-10 margin-b-15"/>
                <label className="hor-center selected-asset-title">Selected Assets Details</label>
                <SelectTable ref="selectTable" replaceColsAll name="asset" desc="Assets" title={title} className="col-lg-12 margin-l-0 margin-r-10 no-padding" renderTHead={this.renderTHead} renderItem={this.renderItem} readonly defaultValue={assets} list={assets}/>
            </React.Fragment>;
        }
    }
}

function renderTHead() {
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
        {this.form && this.onChangeReason && <div className="td">Reason</div>}
        <div className="td fixed-flex padding-l-20 min-w-40"></div>
    </THead>;
}

function renderItem(item, n) {
    const {
        id,
        data: {
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
        }
    } = item;
    
    let [profile_pic] = profile_pic_list || [];
    if (!profile_pic) {
        profile_pic = (photo_list || [])[0];
    }
    
    return <React.Fragment key={id} className="tr-readonly">
        <div className="td fixed-flex min-w-50">{id}</div>
        <div className="td fixed-flex min-w-80">
            {RenderUtils.renderImage(profile_pic && profile_pic.doc, null, '100%', assetProfilePic)}
        </div>
        <div className="td">{asset_type}</div>
        <div className="td">{name || 'N/A'}</div>
        <div className="td">{manufacturer || 'N/A'}</div>
        <div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
        <div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
        <div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
        <div className="td fixed-flex min-w-100">{status}</div>
        {this.form && this.onChangeReason && <div className="td">
            <ClearableInput name="reason" type="textarea" placeholder="Reason" className="col-lg-12 form-control"
                            onChange={this.form.onChange}/>
        </div>}
    </React.Fragment>;
}

export {SelectedAssets, renderTHead, renderItem};
