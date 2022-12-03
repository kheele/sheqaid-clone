import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../utils/Form';
import {Dates} from '../../../utils/Utils';

import {AProfileDialog} from '../../../components/dialogs';
import {ProfileField, ProfilePic} from '../../../components/inputs';

import style from "./ProfileDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Clients";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Company";
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
        
        this.onUploaded = this.onUploaded.bind(this);

        this.form = new Form();
    }
    
    get item() {
        return this.props.state.item;
    }
    
    onUploaded(path) {
        this.item.data.profile_pic = path;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at,
                    name, business_id, profile_pic, projects, sites, phone, email
                }
            }
        } = this;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <ProfilePic path="plugin_sheq_assist/clients/upload/profile-pic" id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                    <h3>{name}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="name" type="text" placeholder="Company Name" value={name} required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="business_id" type="text" placeholder="Company Business ID" value={business_id} required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="phone" type="text" placeholder="Contact No." value={phone} required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="email" type="text" placeholder="Email Address" value={email} required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row flex row-more">
                    <p>Projects<h4 className="hor-center">{projects ? projects.length : 0}</h4></p>
                    <p>Sites<h4 className="hor-center">{sites ? sites.length : 0}</h4></p>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
