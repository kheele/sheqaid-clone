import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';

import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import findByIdTrainingToolboxTalkSubjectCategory
    from "mutations/all/TrainingToolboxTalkSubjectCategory/findByIdTrainingToolboxTalkSubjectCategory";

@observer
class ProfileToolboxTalkSubjectCategoryDialog extends AProfileDialog {
    pageKey = "ProfileToolboxTalkSubjectCategoryDialog";
    findById: findByIdTrainingToolboxTalkSubjectCategory;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Toolbox Talk Subject Category";
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

        this.form = new Form();
    }

    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
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
                title="Toolbox Talk Subject Category Details"
            >
                <ProfileField title="Toolbox Talk Subject Category Name" name="name" value={name} className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

}

export default ProfileToolboxTalkSubjectCategoryDialog;
