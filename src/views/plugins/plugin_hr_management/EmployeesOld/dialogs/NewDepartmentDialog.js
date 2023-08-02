import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectClientInput} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDepartmentDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";

@observer
class NewDepartmentDialog extends ANewDialog {
    pageKey = "NewDepartmentDialog";
    title = "Create Department";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/departments/';
    @observable
    state = {};

    constructor() {
        super();

        this.form = new Form();
    }

    componentDidMount() {

    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Department Name is required');
            return;
        }

        const {name, client} = form.data;
        const data = {name};

        if (client) {
            if (client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;

        const {isConsultant, isNoProjects} = storage.is;
        return (<FormControls>
            {!isNoProjects && <Row
                activeAlways
                rendered
                idx={0}
                title="Company"
            >
                <SelectClientInput name="client" placeholder="Company..." required showAll
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="1. Department Details"
            >
                <ClearableInput name="name" type="text" placeholder="Department Name" required className="form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }
}

export default NewDepartmentDialog;
