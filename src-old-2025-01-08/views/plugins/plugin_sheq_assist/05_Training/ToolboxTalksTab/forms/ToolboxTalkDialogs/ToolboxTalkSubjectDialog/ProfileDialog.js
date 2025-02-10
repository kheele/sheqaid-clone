import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import Form from 'utils/Form';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import findByIdTrainingToolboxTalkSubject
    from "mutations/all/TrainingToolboxTalkSubject/findByIdTrainingToolboxTalkSubject";

@observer
class ProfileToolboxTalkSubjectDialog extends AProfileDialog {
    pageKey = "ProfileToolboxTalkSubjectDialog";
    findById: findByIdTrainingToolboxTalkSubject;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Toolbox Talk Subject";
    }
    
    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);

        this.form = new Form();
    }
    
    @computed get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item) {
            return null;
        }
        
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, name, client
                }
            }
        } = this;

        const {isConsultant} = storage.is;

        return <FormControls>
            {isConsultant && <Row
                activeAlways
                rendered
                idx={0}
                title="Company"
            >
                <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name}
                              className="col-lg-12"/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="Toolbox Talk Subject Details"
            >
                <ProfileField title="Toolbox Talk Subject Name" name="name" value={name} className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

}

export default ProfileToolboxTalkSubjectDialog;
