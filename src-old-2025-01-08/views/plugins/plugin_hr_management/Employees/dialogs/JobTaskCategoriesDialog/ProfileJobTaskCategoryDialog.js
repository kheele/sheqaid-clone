// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {NewJobTaskListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileJobTaskCategoryDialog.lazy.css";
import {findByIdJobTaskCategory} from "../../../../../../mutations/findById";
import {updateJobTaskCategory} from "../../../../../../mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileJobTaskCategoryDialog";
    findById = findByIdJobTaskCategory;
    removeById = updateJobTaskCategory;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Job Task Category";
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
                    name, desc,
                    job_task_list = [],
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
                    title="1. Job Task Category Details"
                >
                    <ProfileField title="Job Task Category" value={name} className="col-lg-12"/>
                    <ProfileField title="Description" value={desc} className="col-lg-12"/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Job Tasks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewJobTaskListTable name="job_task_list" title="Job Tasks" defaultValue={job_task_list}
                                     readonly/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
