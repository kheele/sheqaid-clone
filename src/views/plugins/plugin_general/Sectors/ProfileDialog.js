import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField, } from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Sector";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Sector";
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
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    name,
                }
            }
        } = this;

        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Sector Details">
                <ProfileField name="name" type="text" placeholder="Sector Name" value={name} required
                              className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
