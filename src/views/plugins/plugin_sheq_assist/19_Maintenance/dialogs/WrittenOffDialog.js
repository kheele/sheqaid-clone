import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';
import {SelectTable} from 'components/tables';
import {FormControls, Row} from 'components/FormComponents';
import {renderItem, renderTHead, SelectedAssets} from './SelectedAssets';

import style from "./WrittenOffDialog.lazy.css";

@observer
class WrittenOffDialog extends ANewDialog {
    pageKey = "WrittenOffDialog";
    title = "Write Off Asset";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/19_Maintenance/tools/";

    @observable
    state = {
        lists: {
            toolkits: [],
            manufacturers: [],
            conditions: ['New', 'Good', 'Fair', 'Poor'],
            barcode_or_qr_code_types: [{text: "Barcode", value: "Barcode", checked: false}, {text: "QR Code", value: "QR Code", checked: false}],
            vendors: []
        },
        item: null,
        items: null,
        showBarcode: false,
        showQRCode: false
    };

    constructor(props) {
        super(props);
        
        this.onChangeBarcodeOrQRCode = this.onChangeBarcodeOrQRCode.bind(this);
        
        this.onChangeAsset = this.onChangeAsset.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
        this.renderTHead = renderTHead.bind(this);
        this.renderItem = renderItem.bind(this);

        this.form = new Form();
        this.form.addChangeOne("barcode_or_qr_code_type", this.onChangeBarcodeOrQRCode);
    }
    
    componentWillMount() {
        const {dialog} = this.props;
        this.state.item = dialog.extraProp('item');
        this.state.items = dialog.extraProp('items');
    }
    
    onLoadList() {
        return neonBinding.events.emit(this.path + 'list/search_by', {key: '!written_off', value: true});
    }
    
    onChangeAsset(){
        this.refs.selectTable.open().then(list => {
            if(list.length === 1) {
                this.state.item = list[0];
                this.state.items = null;
            } else if(list.length > 1) {
                this.state.items = list;
                this.state.item = null;
            }
        });
    }

    onChangeBarcodeOrQRCode(el, val) {
        this.state.showBarcode = val === 'Barcode';
        this.state.showQRCode = val === 'QR Code';
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('store_keeper_signature')) {
            infoDialog.open('Store Keeper Signature is required');
            return;
        }
        if (!form.isValid('manager_signature')) {
            infoDialog.open('Manager Signature is required');
            return;
        }

        const {item, items} = this.state;
        const {
            store_keeper_signature, manager_signature, comments
        } = form.data;
        const data = {
            store_keeper_signature: JSON.stringify(store_keeper_signature), 
            manager_signature: JSON.stringify(manager_signature)
        };
        if (comments) {
            data.comments = comments;
        }
        if (item) {
            data.list = [item.id];
        } else if (items) {
            data.list = items.map(v => v.id);
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "write-off", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            setTimeout(function () {
                infoDialog.close();
            }.bind(this), 2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        
        return <FormControls>
            <Row 
                rendered 
                active
                idx={1}
                title='Write Off' 
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="store_keeper_signature" type="signature" placeholder="Store Keeper Signature" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manager_signature" type="signature" placeholder="Manager Signature" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="comments" type="textarea" placeholder="Comments" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Asset Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <SelectTable ref="selectTable" isDialog replaceCols name="asset" desc="Assests" title="Select Asset(s) To Check Out" className="col-lg-12 no-padding SelectAssetTable" renderTHead={this.renderTHead} defaultValue={this.state.items ? this.state.items : (this.state.item ? [this.state.item] : null)} renderItem={this.renderItem} onLoadList={this.onLoadList}/>
                <SelectedAssets state={this.state} onChangeAsset={this.onChangeAsset} title="Select Asset(s) To Write Off"/>
            </Row>
        </FormControls>;
    }
}
  
@observer
class BarcodeWrapper extends React.Component {

    render() {
        return this.props.state.showBarcode && <ClearableInput name="barcode_or_qr_code" type="text" placeholder="Barcode" className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

@observer
class QRCodeWrapper extends React.Component {

    render() {
        return this.props.state.showQRCode && <ClearableInput name="barcode_or_qr_code" type="text" placeholder="QR Code" className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

export default WrittenOffDialog;
