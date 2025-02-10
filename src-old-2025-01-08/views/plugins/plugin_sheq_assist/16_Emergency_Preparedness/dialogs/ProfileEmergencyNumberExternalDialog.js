import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileEmergencyNumberExternalDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEmergencyNumberExternalDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "External Emergency Number";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

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
                    org_name, area, contacts
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="org_name" placeholder="Organization" value={org_name} required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="area" placeholder="Area" value={area} required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="contacts" placeholder="Contacts" value={contacts} required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
