// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

// import ProfilePDFReader from './printers/ProfilePDFReader';
import style from "./ProfileSignableDocDialog.lazy.css";
import {computed, observable} from "mobx";
import {CircularProgress} from "@mui/material";
import DocSignButton from "components/FormComponents/DocSignButton";
import {findByIdSignableDoc} from "mutations/findById";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileSignableDocDialog";
    findById = findByIdSignableDoc;

    // removeById = updateDocument;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    @observable
    state = {};

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover, props: {showCategory}}
            },
            item, item: {
                id, data: {
                    created_at,
                    company,
                    client,
                    project,
                    site,

                    name,
                    doc,
                    preview_image_url,
                    module,
                    doc_type,
                    employee_submitter_list,
                    employee_submission_list,
                    employee_submitter_list_aggregate,
                    employee_submission_list_aggregate,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant &&
                    <ProfileField title="Company" value={company} renderer={val => val.name} className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={val => val.name}
                              className="col-lg-6 col-xs-12"/>
                <ProfileField title="Site" value={site} renderer={val => val.name} className="col-lg-6 col-xs-12"/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Basic Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                {/*<ProfileField title="Department" value={responsible_department} renderer={val => val.name}*/}
                {/*              className="col-lg-12"/>*/}
                {/*<ProfileField title="Responsible Person" value={responsible_person}*/}
                {/*              renderer={({fname, lname}) => `${fname} ${lname}`} className="col-lg-12"/>*/}
                {/*<ProfileField title="Expiry Date" type="date" value={latest_version && latest_version.expiry}*/}
                {/*              className="col-lg-12"/>*/}
                {/*<ProfileField title="Internal / External Document?" value={internal_or_external} className="col-lg-12"/>*/}
                {/*{showCategory && <ProfileField title="Document Category" value={category} renderer={v => v.name}*/}
                {/*                               className="col-lg-12"/>}*/}
                {/*<ProfileField title="Document Description" value={desc} className="col-lg-12"/>*/}
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Signable Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                {/*<label className="w-full margin-l-10 margin-r-10 bg-white padding-10">Signable Document</label>*/}
                {preview_image_url && <img
                    src={preview_image_url}
                />}
                <DocSignButton
                    doc={item}
                />
            </Row>
        </FormControls>;
    }

}

// </editor-fold>

export default ProfileDialog;
