// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {
    ClearableInput,
    SelectPPETypeInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewPPEItemDialog.lazy.css";
import insertPPEItem from "mutations/all/PPE/insertPPEItem";
import {Dates} from "utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPEItemDialog";
    title = "Create PPE Item";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            condition: ['Good', 'Needs Inspection', 'Damaged', 'Lost', 'Retired'].map(value => (
              {text: value, value, checked: false}
            )),
        },
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        //1
        if (!form.isValid('ppe_type')) {
            infoDialog.open('PPE Type is required');
            return;
        }

        const {
            ppe_type,
            serial_num,
            purchase_date,
            condition,
            notes,
            profile_pic,
        } = form.data;
        const data = {
            ppe_type_id: ppe_type.id,
            serial_num,
            purchase_date: Dates.formatDateSQL(purchase_date),
            condition,
            notes,
            profile_pic: profile_pic && profile_pic.path,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPEItem(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<FormControls>
            <Row
              activeAlways
              rendered
              idx={0}
              title="PPE Item Details"
            >
                <SelectPPETypeInput name="ppe_type"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="serial_num" type="text" placeholder="Serial No." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="purchase_date" type="date" placeholder="Purchase Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="condition" type="radio" placeholder="Condition" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.condition} returnValue/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 margin-b-15 form-control"
                                onChange={this.form.onChange}/>
                <UploadButton
                  name="profile_pic"
                  buttonTitle="PPE Item Photo"
                  type={['Photo']}
                  showOnlyIcon
                  className="col-lg-6 col-xs-12 hor-center"
                  onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
