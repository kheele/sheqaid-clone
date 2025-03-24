import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {ClearableInput,} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {AEditDialog} from 'components/dialogs';
import style from "./EditDialog.lazy.css";
import {ShouldUpdate} from "utils/Utils";
import {updateSector} from "mutations/update";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Sector";
    className = 'ANewTableFormDialog';
    removeById = updateSector;

    // findById = findByIdSector;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Sector";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/sectors/";

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Sector Name is required');
            return;
        }

        const {name} = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateSector({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);

            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            progressDialog.close();
        });
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, name
                }
            }
        } = this;

        return <FormControls onChange={this.form.onChange}>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Sector Details">
                <ClearableInput name="name" type="text" placeholder="Sector Name" defaultValue={name} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
