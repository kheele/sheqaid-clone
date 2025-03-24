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
import {updateClient} from "mutations/update";
import {NewProjectListTable, NewSiteListTable} from "components/FormTableComponents";
import {findByIdClient} from "mutations/findById";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Clients";
    removeById = updateClient;
    findById = findByIdClient;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Company";
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {};

    constructor(props) {
        super(props);

        // this.onNext = this.onNext.bind(this);
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
                    name,
                    business_id,
                    profile_pic,
                    project_list,
                    site_list,
                    phone,
                    email,
                    contractor_email,
                    address,
                    sector_list
                }
            }
        } = this;

        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Company Details"
            >
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
            >
                <ProfileField
                    name="sector_list"
                    title="Sector(s)"
                    value={sector_list}
                    renderer={v => (<Grid container spacing={1} columns={4}>{
                        v.map(({name}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                    </Grid>)
                    }
                    className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={3}
                title="Register As Contractor"
            >
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
                title="Projects"
            >
                <NewProjectListTable
                    title="Projects"
                    name="project_list"
                    defaultValue={project_list}
                    readonly
                />
            </Row>
            <Row
                activeAlways
                rendered
                idx={5}
                rowClassName="flex row-more"
                title="Sites"
            >
                <NewSiteListTable
                    title="Sites"
                    name="site_list"
                    defaultValue={site_list}
                    readonly
                />
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
