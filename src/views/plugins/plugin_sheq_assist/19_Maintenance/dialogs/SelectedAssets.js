import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {Dates} from "utils/Utils";

import {Button, ClearableInput, ProfileField} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';

import style from "./SelectedAssets.lazy.css";

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
        const {state: {item, items}, onChangeAsset, title} = this.props;
        console.log('item', item)
        if(!item && !items) {
            return <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeAsset}>Add Asset(s)...</Button>;
        }
        if(item) {
            const {id, data: {photo, asset_type, manufacturer, desc, model, serial_num, location, toolkit, condition, notes}} = item;
            return <React.Fragment>
                <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeAsset}>Add / Change Asset(s)...</Button>
                <hr className="margin-r-10 margin-t-10 margin-b-15"/>
                <label className="hor-center selected-asset-title">Selected Asset Details</label>
                    <ProfileField title="Tool Photo" value={photo} type="file" className="col-lg-12"/>
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
                <SelectTable ref="selectTable" replaceCols name="asset" desc="Assets" title={title} className="col-lg-12 margin-l-0 margin-r-10 no-padding" renderTHead={this.renderTHead} renderItem={this.renderItem} readonly defaultValue={items} list={items}/>
            </React.Fragment>;
        }
    }
}

function renderTHead() {
    return <THead>
        <div className="td fixed-flex min-w-120">Date Created</div>
        <div className="td fixed-flex min-w-80">Photo</div>
        <div className="td">Status</div>
        <div className="td">Asset Type</div>
        <div className="td">Manufacturer</div>
        <div className="td">Model</div>
        <div className="td">Serial No.</div>
        <div className="td">Condition</div>
        {this.form && this.onChangeReason && <div className="td">Reason</div>}
        <div className="td fixed-flex padding-l-20 min-w-40"></div>
    </THead>;
}

function renderItem(item, n){
    const {id, data: {created_at, photo, asset_type, manufacturer, desc, model, serial_num, toolkit, condition, notes, status}} = item;
    return <React.Fragment key={id} className="tr-readonly">
        <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
        <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(photo)}</div>
        <div className="td">{status}</div>
        <div className="td">{asset_type}</div>
        <div className="td">{manufacturer}</div>
        <div className="td">{model}</div>
        <div className="td">{serial_num}</div>
        <div className="td">{condition}</div>
        {this.form && this.onChangeReason && <div className="td">
            <ClearableInput name="reason" type="textarea" placeholder="Reason" className="col-lg-12 form-control" onChange={this.form.onChange}/>
        </div>}
    </React.Fragment>;
}

export {SelectedAssets, renderTHead, renderItem};
