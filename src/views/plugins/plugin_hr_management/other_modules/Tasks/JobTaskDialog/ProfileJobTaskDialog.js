// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileJobTaskDialog.lazy.css";
import {findByIdJobTaskCategory} from "mutations/findById";
import {updateJobTaskCategory} from "mutations/update";
import {
    NewComplianceRequirementListTable,
    NewJobPositionListTable,
    NewJobTaskCategoryListTable,
    NewPPETypeListTable,
} from "components/FormTableComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileJobTaskDialog";
    findById = findByIdJobTaskCategory;
    removeById = updateJobTaskCategory;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Job Task";
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
                    name, desc, priority_level, estimated_duration,
                    job_position_list = [],
                    category_list = [],
                    ppe_type_list = [],
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
                    title="1. Job Task Details"
                >
                    <ProfileField title="Job Task" value={name} className="col-lg-12"/>
                    <ProfileField title="Description" value={desc} className="col-lg-12"/>
                    <ProfileField title="Priority Level" value={priority_level} className="col-lg-12"/>
                    <ProfileField title="Estimated Duration" value={estimated_duration} className="col-lg-12"/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Job Positions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewJobPositionListTable name="job_position_list" defaultValue={job_position_list} readonly/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Job Task Categories"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewJobTaskCategoryListTable name="category_list" defaultValue={category_list} readonly/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. PPE Types"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewPPETypeListTable name="ppe_type_list" defaultValue={ppe_type_list} readonly/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Compliance Requirements"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewComplianceRequirementListTable name="compliance_requirement_list"
                                                   defaultValue={compliance_requirement_list} readonly/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
