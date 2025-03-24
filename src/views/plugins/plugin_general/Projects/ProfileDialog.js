import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import {updateProject} from "mutations/update";
import {NewSiteListTable} from "components/FormTableComponents";
import {findByIdProject} from "mutations/findById";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Projects";
    removeById = updateProject;
    findById = findByIdProject;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Project";
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {};

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
                    name, address, client, site_list
                }
            }
        } = this;

        const {isConsultant} = storage.is;
        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Project Details"
            >
                <ProfileField name="name" type="text" placeholder="Project Name" value={name} required
                              className="col-lg-12"/>
                <ProfileField name="address" type="textarea" placeholder="Project Address" value={address}
                              className="col-lg-12"/>
                {isConsultant && <ProfileField name="client" type="select" placeholder="Company" value={client}
                                               renderer={val => val.name} className="col-lg-12"/>}
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
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
