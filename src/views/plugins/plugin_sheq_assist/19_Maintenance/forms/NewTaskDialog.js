import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewTaskDialog.lazy.css";

@observer
class NewTaskDialog extends ANewDialog {
    pageKey = "NewTaskDialog";
    title = "Create Task";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/19_Maintenance/tasks/";

    @observable
    state = {
    };
    
    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Task is required');
            return;
        }
        if (!form.isValid('start')) {
            infoDialog.open('Starts On is required');
            return;
        }
        if (!form.isValid('end')) {
            infoDialog.open('Ends On is required');
            return;
        }

        const {
            title, desc, start, end
        } = form.data;
        const data = {
            title, start: start.getTime(), end: end.getTime()
        };
        if(desc) {
            data.desc = desc;
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
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="start" type="date" placeholder="Starts On..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="end" type="date" placeholder="Ends On..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="title" type="text" placeholder="Task" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="desc" type="textarea" placeholder="Description" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="responsible_person" type="text" placeholder="Responsible Person..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewTaskDialog;
