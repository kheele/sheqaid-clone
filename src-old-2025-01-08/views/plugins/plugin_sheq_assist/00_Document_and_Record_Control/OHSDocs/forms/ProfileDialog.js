import React from "react";
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import { AProfileDialog } from 'components/dialogs';
import { UploadButton, ProfileField } from 'components/inputs';
import { FormControls, Row } from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import { findByIdOHSDoc } from "mutations/findById";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileContractDialog";
    findById = findByIdOHSDoc;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "OHS Document";
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);
    }

    @computed get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render(item, n, onClick) {
        if (!this.item) {
            return null;
        }

        const { props: { onFormNext, onFormBack, onFormOpen } } = this;

        let {
            id,
            data: {
                created_at,
                type,
                title,
                desc,
                doc,
                module_list,
            }
        } = this.item;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title='1. Details'
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ProfileField name="type" placeholder="Type" value={type} className="col-lg-12" />
                <ProfileField name="title" placeholder="Document Title" value={title} className="col-lg-12" />
                <ProfileField name="desc" placeholder="Description" value={desc} className="col-lg-12" />
            </Row>
            <Row
                rendered
                idx={2}
                title='2. Applicable Modules'
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField
                    name="module_list"
                    value={module_list} 
                    rendered={v => v.map(({ module: { title } }) => title).join(', ')}
                    className="col-lg-12"
                />
            </Row>
            <Row
                rendered
                idx={3}
                title={`3. Document Attachment`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    type={['PDF', 'Word', 'Excel', 'PPT']}
                    defaultValue={doc}
                    showOnlyIcon
                    readonly
                    className="col-lg-12"
                />
            </Row>
        </FormControls>;
    }
    //</editor-fold>
}

export default ProfileDialog;
