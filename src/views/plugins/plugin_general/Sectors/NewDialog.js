import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import {insertSector} from "mutations/create";
import SelectSectorPublicInput from "../../../../components/inputs/SelectSectorPublicInput";
import {ClearableInput} from "../../../../components/inputs";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Sector";
    title = "Create Sector";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/sectors/";

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('sector') && !form.isValid('name')) {
            infoDialog.open('Please select existing Sector Name or Add new Sector Name');
            return;
        }

        if (form.isValid('sector') && form.isValid('name')) {
            infoDialog.open('Please select either existing Sector Name or Add new Sector Name');
            return;
        }

        const {sector, name} = form.data;
        let data = {};
        if (name && !sector) {
            data = {name};
        } else if (!name && sector) {
            data = {...sector.data};
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertSector(data).then(res => {
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

    render() {
        return <FormControls onChange={this.form.onChange}>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Sector Details"
            >
                <SelectSectorPublicInput
                    name="sector"
                    type="select"
                    placeholder="Select Existing Sector Name"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    addButton={false}
                />

                <h3 className="col-lg-12 text-center padding-10 margin-v-10">OR</h3>

                <ClearableInput name="name" placeholder="Add New Sector Name"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default NewDialog;
