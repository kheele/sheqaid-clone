import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import {updateSite} from "mutations/update";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Sites";
    removeById = updateSite;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Site";
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
                    name, address, project, client, employees
                }
            }
        } = this;

        const {isConsultant} = storage.is;
        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Site Details">
                <ProfileField name="name" type="text" placeholder="Site Name" value={name} va required
                              className="col-lg-12"/>
                <ProfileField name="address" type="textarea" placeholder="Site Address" value={address}
                              className="col-lg-12"/>
                <ProfileField name="project" type="select" placeholder="Project" value={project}
                              renderer={val => val.name} className="col-lg-12"/>
                {isConsultant && <ProfileField name="client" type="select" placeholder="Company" value={client}
                                               renderer={val => val.name} className="col-lg-12"/>}
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
