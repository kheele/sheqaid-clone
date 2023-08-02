import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileEmergencyProcedureDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEmergencyProcedureDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Emergency Procedure";
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
                    title, type, doc
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{title}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="title" placeholder="Title" value={title} required onChange={this.form.onChange}/>
                    <ProfileField name="type" placeholder="Type" value={type} required onChange={this.form.onChange}/>
                </div>
                <div className="row row-doc">
                    <ProfileField name="doc" placeholder="Document" value={doc} type="file" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
