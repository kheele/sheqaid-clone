import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import Chip from "@material-ui/core/Chip";
import {Grid} from "@material-ui/core";

import Form from 'utils/Form';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField, ProfilePic} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import updateClient from "mutations/all/Client/updateClient";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Clients";
    removeById = updateClient;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Company";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {};

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
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    name, business_id, profile_pic, projects, sites, phone, email, contractor_email, address, sector_list
                }
            }
        } = this;

        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Company Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}>
                <ProfilePic name="profile_pic" path="plugin_sheq_assist/clients/upload/profile-pic" id={item.id}
                            profilePic={profile_pic} onUploaded={this.onUploaded}/>

                <ProfileField name="name" type="text" placeholder="Company Name" value={name} required
                              className="col-lg-12"/>
                <ProfileField name="business_id" type="text" placeholder="Company Business ID" value={business_id}
                              required className="col-lg-12"/>
                <ProfileField name="phone" type="text" placeholder="Contact No." value={phone} required
                              className="col-lg-12"/>
                <ProfileField name="email" type="text" placeholder="Email Address" value={email} required
                              className="col-lg-12"/>
                <ProfileField name="address" type="textarea" placeholder="Company Address" value={address}
                              className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                title="Sector(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}>
                <ProfileField
                    name="sector_list"
                    title="Sector(s)"
                    value={sector_list}
                    renderer={v => (<Grid container spacing={1} columns={4}>{
                        v.map(({data: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                    </Grid>)
                    }
                    className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={3}
                title="Register As Contractor"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}>
                <ProfileField
                    name="contractor_email"
                    title="Contractor Email Address"
                    value={contractor_email}
                    className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={4}
                rowClassName="flex row-more"
                title="Projects">
                <p>Projects<h4 className="hor-center">{projects ? projects.length : 0}</h4></p>
            </Row>
            <Row
                activeAlways
                rendered
                idx={5}
                rowClassName="flex row-more"
                title="Sites">
                <p>Sites<h4 className="hor-center">{sites ? sites.length : 0}</h4></p>
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
