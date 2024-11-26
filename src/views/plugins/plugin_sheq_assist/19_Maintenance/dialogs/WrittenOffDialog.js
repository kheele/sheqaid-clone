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
import {Dates} from "../../../../../utils/Dates";
import {deleteAssets} from "mutations/delete";

@observer
class WrittenOffDialog extends ANewDialog {
    pageKey = "WrittenOffDialog";
    title = "Write Off Asset";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
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
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap'],
            barcode_or_qr_code_types: [{text: "Barcode", value: "Barcode", checked: false}, {
                text: "QR Code",
                value: "QR Code",
                checked: false
            }],
            vendors: []
        },
        asset: null,
        assets: null,
        showBarcode: false,
        showQRCode: false
    };

    constructor(props) {
        super(props);

        this.onFormChange = this.onFormChange.bind(this);

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
        this.state.asset = dialog.extraProp('item');
        this.state.assets = dialog.extraProp('items');
    }

    onLoadList() {
        const listByLogged = sockets.of("assets").fn('listByLogged');

        return listByLogged({
            written_off: false,
            //
            exact_orgs: true,
            data_export: true,
            //
            limit: 0,
            offset: 0,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    onChangeAsset() {
        this.refs.selectTable.open().then(list => {
            if (list.length === 1) {
                this.state.asset = list[0];
                this.state.assets = null;
            } else if (list.length > 1) {
                this.state.assets = list;
                this.state.asset = null;
            }
        });
    }

    onChangeBarcodeOrQRCode(el, val) {
        this.state.showBarcode = val === 'Barcode';
        this.state.showQRCode = val === 'QR Code';
    }

    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {dialog} = this.props;
        dialog.cssWidth = idx === 1 ? '700px' : '1400px';
        return true;
    }

    // </editor-fold>

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('written_off_store_keeper_signature')) {
            infoDialog.open('Store Keeper Signature is required');
            return;
        }
        if (!form.isValid('written_off_manager_signature')) {
            infoDialog.open('Manager Signature is required');
            return;
        }

        const {asset, assets} = this.state;
        const {
            written_off_date,
            written_off_store_keeper_signature,
            written_off_manager_signature,
            written_off_reason,
            written_off_comments
        } = form.data;
        const data = {
            written_off_date: Dates.formatDateSQL(written_off_date),
            written_off_store_keeper_signature: JSON.stringify(written_off_store_keeper_signature),
            written_off_manager_signature: JSON.stringify(written_off_manager_signature),
            written_off_reason,
            written_off_comments,
            list: asset ? [asset.id] : assets ? assets.map(v => v.id) : [],
        };

        console.log(data, assets)//

        btn.text("Saving...").disabled();
        progressDialog.open();

        deleteAssets(data).then(res => {
            console.log("res", res)
            onSaved && onSaved();
            infoDialog.open("Record(s) successfully removed.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormChange} = this.props;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title='Write Off'
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
            >
                <ClearableInput name="written_off_date" type="date" placeholder="Date Written Off..." required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="written_off_store_keeper_signature" type="signature"
                                placeholder="Store Keeper Signature" required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="written_off_manager_signature" type="signature" placeholder="Manager Signature"
                                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="written_off_reason" type="textarea" placeholder="Reason" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="written_off_comments" type="textarea" placeholder="Comments" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Asset Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormChange={onFormChange}
            >
                <SelectTable ref="selectTable" isDialog replaceCols name="asset" desc="Assests"
                             title="Select Asset(s) To Check Out" className="col-lg-12 no-padding SelectAssetTable"
                             renderTHead={this.renderTHead}
                             defaultValue={this.state.assets ? this.state.assets : (this.state.asset ? [this.state.asset] : null)}
                             renderItem={this.renderItem} onLoadList={this.onLoadList}/>
                <SelectedAssets state={this.state} onChangeAsset={this.onChangeAsset}
                                title="Select Asset(s) To Write Off"/>
            </Row>
        </FormControls>;
    }
}

@observer
class BarcodeWrapper extends React.Component {

    render() {
        return this.props.state.showBarcode &&
            <ClearableInput name="barcode_or_qr_code" type="text" placeholder="Barcode"
                            className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

@observer
class QRCodeWrapper extends React.Component {

    render() {
        return this.props.state.showQRCode &&
            <ClearableInput name="barcode_or_qr_code" type="text" placeholder="QR Code"
                            className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

export default WrittenOffDialog;
