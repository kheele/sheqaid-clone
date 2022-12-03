import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';

import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';

import style from "./ProfileDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Projects";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Project";
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
                    name, address, client, sites
                }
            }
        } = this;
        
        const {isConsultant} = storage.is;
        return <FormControls>
            <Row 
                activeAlways
                rendered 
                idx={1}
                title="Project Details">
                    <ProfileField name="name" type="text" placeholder="Project Name" value={name} required className="col-lg-12"/>
                    <ProfileField name="address" type="textarea" placeholder="Project Address" value={address} className="col-lg-12"/>
                    {isConsultant && <ProfileField name="client" type="select" placeholder="Company" value={client} renderer={val => val.name} className="col-lg-12"/>}
            </Row>
            <Row 
                activeAlways
                rendered 
                idx={2}
                rowClassName="flex row-more"
                title="Sites">
                    <p>Sites<h4 className="hor-center">{sites ? sites.length : 0}</h4></p>
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
