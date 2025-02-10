import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Sites";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Site";
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
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at,
                    name, address, project, client, employees
                }
            }
        } = this;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{name}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="name" type="text" placeholder="Site Name" value={name} va required className="col-lg-12"/>
                </div>
                <div className="row">
                    <ProfileField name="address" placeholder="Site Address" value={address} className="col-lg-12"/>
                </div>
                <div className="row">
                    <ProfileField name="project" placeholder="Project" value={project} renderer={val => val.name} className="col-lg-12"/>
                </div>
                <div className="row">
                    <ProfileField name="client" placeholder="Company" value={client} renderer={val => val.name} className="col-lg-12"/>
                </div>
                <div className="row">
                
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
