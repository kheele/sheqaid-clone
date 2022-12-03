import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../utils/Form';

import {TinyMCE} from '../../../components/documents';
import {ClearableInput} from '../../../components/inputs';
import ANewDialog from '../../../components/dialogs/ANewDialog';

import style from "./NewDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Calendar";
    title = "Create Notes";

    constructor(props) {
        super(props, style);
        this.title = 'Create ' + props.type;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "human_resource/notes/";

    @observable
    state = {
        lists: {
            types: [
                {text: 'Notes', value: 'Notes', checked: false}, 
                {text: 'Todo', value: 'Todo', checked: false}, 
                {text: 'Meeting', value: 'Meeting', checked: false}
            ]
        },
        showTinyMCE: true
    };

    constructor() {
        super();
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Title is required');
            return;
        }
        if (!form.isValid('type')) {
            infoDialog.open('Note Type is required');
            return;
        }
        if (!form.isValid('notes')) {
            infoDialog.open('Notes is required');
            return;
        }

        const {title, type, notes} = form.data;
        const data = {title, type, notes};
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
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
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">    
                        <ClearableInput name="title" type="text" placeholder="Agenda / Title" className="col-lg-7 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="type" type="radio" placeholder="Note Type" className="col-lg-5 form-control" onChange={this.form.onChange} values={this.state.lists.types}/>
                    </div>
                </div>
                <div className="row">
                    <label>Notes</label>
                    <div className="row sec-group">
			<TinyMCE state={this.state} name="notes" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewDialog;
