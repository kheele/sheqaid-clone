import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileActionDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileActionDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Action";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        
    };
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    componentDidMount() {
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at, due_date, title, details, category, location, attachment, responsible_person
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="title" value={title} placeholder="Title" className="col-lg-12" onChange={this.form.onChange}/>
                        <ProfileField name="details" value={details} type="textarea" placeholder="Details" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="category" value={category} placeholder="Category" className="col-lg-6" onChange={this.form.onChange} values="categories"/>
                        <ProfileField name="location" value={location} placeholder="Location" className="col-lg-6" onChange={this.form.onChange} values="locations"/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="responsible_person" value={responsible_person} renderer={v => v.fname + ' ' + v.fname} type="select" placeholder="Responsible Person" onChange={this.form.onChange}/>
                        <ProfileField name="due_date" value={due_date} type="date" placeholder="Due Date" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row row-photo min-h-420">
                    <div className="row sec-group">
                        <ProfileField name="attachment" value={attachment} type="file" placeholder="Attachment" required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;