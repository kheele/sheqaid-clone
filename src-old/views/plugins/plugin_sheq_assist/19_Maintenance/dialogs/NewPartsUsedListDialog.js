// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';

import {Button} from '../../../../../components/inputs';
import {AControls, FormControls, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import style from "./NewPartsUsedListDialog.lazy.css";
import {NewPartItemListTable} from "../../../../../components/FormTableComponents";
import NewPartDialog from "./NewPartDialog";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewPartsUsedListDialog extends ANewDialog {
    pageKey = "NewPartsUsedListDialog";
    title = "Asset Parts Used";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends AControls {

    constructor(props) {
        super(props);

        this.onAdd = this.onAdd.bind(this);
    }

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        super.componentDidMount();

        const {props: {dialog: {execWhen}}} = this;

        if (this.item) {
            execWhen(() => this.refs.parts_used).then(parts_used => {
                parts_used.list = this.item;
            });
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="title">
    get title() {
        return this.item ? 'Edit Asset Parts Used' : 'Add Asset Parts Used';
    }
    // </editor-fold>

    onAdd(evt, btn) {
        const {newPartDialog, parts_used} = this.refs;
        newPartDialog.open().then(item => {
            if(item) {
                parts_used.add(item);
            }
        });
    }

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const data = super.onSubmit(e, btn, onSaved);

        const {parts_used} = data;
        console.log('data', parts_used)

        onSaved(parts_used);
        this.props.close();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={1}
                title="Parts Used List"
            >
                <NewPartItemListTable ref='parts_used' name='parts_used' onChange={this.form.onChange}/>
                <hr className="pull-left -margin-t-15 margin-b-25"/>
                <Button
                    className='btn btn-primary fixed-flex hor-center border-radius-20 margin-b-10'
                    text='Add Part Used'
                    onClick={this.onAdd}
                />
            </Row>
            <NewPartDialog ref='newPartDialog' saveLater/>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewPartsUsedListDialog;