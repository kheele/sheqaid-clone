import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {onSelectLoadAssetActionCategories, onSelectLoadAssetLocations,} from '../../../utils';

import {ClearableInput, PhotoUploadButton, SelectEmployeeInput} from '../../../../../components/inputs';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewActionDialog.lazy.css";

@observer
class NewActionDialog extends ANewDialog {
    pageKey = "NewActionDialog";
    title = "Create Action";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/19_Maintenance/actions/";

    @observable
    state = {
        lists: {
	    categories: [],
            locations: []
	},
        loadedSelectLists: false
    };
    
    constructor() {
        super();
        
        this.form = new Form();
    }
    
    componentDidMount() {
        const loads = {categories: onSelectLoadAssetActionCategories, locations: onSelectLoadAssetLocations};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => this.state.lists[k] = res);
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Title is required');
            return;
        }
        if (!form.isValid('category')) {
            infoDialog.open('Category is required');
            return;
        }
        if (!form.isValid('location')) {
            infoDialog.open('Location is required');
            return;
        }
        if (!form.isValid('responsible_person')) {
            infoDialog.open('Responsible Person is required');
            return;
        }
        if (!form.isValid('due_date')) {
            infoDialog.open('Due Date is required');
            return;
        }

        const {
            title, details, category, location, attachment, responsible_person: {id, data: {fname, lname}}, due_date
        } = form.data;
        const data = {
            title, category, location, responsible_person: {id, fname, lname}, due_date: due_date.getTime()
        };
        if(details) {
            data.details = details;
        }
        if(attachment) {
            data.attachment = attachment.path;
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
                        <ClearableInput name="title" type="text" placeholder="Title" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="details" type="textarea" placeholder="Details" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <SelectWrapper state={this.state} name="category" placeholder="Category..." className="col-lg-6 form-control" onChange={this.form.onChange} values="categories"/>
                        <SelectWrapper state={this.state} name="location" placeholder="Location..." className="col-lg-6 form-control" onChange={this.form.onChange} values="locations"/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <SelectEmployeeInput name="responsible_person" type="select" placeholder="Responsible Person..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="due_date" type="date" placeholder="Due Date..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row row-photo">
                    <div className="row sec-group">
                        <PhotoUploadButton name="attachment" buttonTitle="Attachment" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class SelectWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, className, onChange, values} = this.props;
        if(!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

export default NewActionDialog;
