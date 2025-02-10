// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {NewComplianceRequirementListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileApplicableRegulationDialog.lazy.css";
import {findByIdApplicableRegulation} from "../../../../../../mutations/findById";
import {updateApplicableRegulation} from "../../../../../../mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileApplicableRegulationDialog";
    findById = findByIdApplicableRegulation;
    removeById = updateApplicableRegulation;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Applicable Regulation";
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
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
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    site, project, client,
                    code,
                    desc,
                    jurisdiction,
                    effective_date,
                    compliance_requirement_list = [],
                }
            }
        } = this;

        return <FormControls>
            <RowOrgs
                readonly
                client={client}
                project={project}
                site={site}
                active
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Applicable Regulation Details"
                >
                    <ProfileField title="Code" value={code} className="col-lg-12"/>
                    <ProfileField title="Description" value={desc} className="col-lg-12"/>
                    <ProfileField title="Jurisdiction" value={jurisdiction} className="col-lg-12"/>
                    <ProfileField title="Effective Date" type="date" value={effective_date} className="col-lg-12"/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Compliance Requirements"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewComplianceRequirementListTable name="compliance_requirement_list" title="Compliance Requirements"
                                                   defaultValue={compliance_requirement_list}
                                                   readonly/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
