// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPEFitTestDialog.lazy.css";
import {findByIdPPEFitTest} from "mutations/findById";
import {updatePPEFitTest} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEFitTestDialog";
    findById = findByIdPPEFitTest;
    removeById = updatePPEFitTest;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Fit Test";
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
                    site,
                    project,
                    client,
                    //
                    test_date,
                    next_due_date,
                    result,
                    notes,
                    ppe_type,
                    employee,
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
                    title="1. PPE Fit Test Details"
                    onFormNext={null}
                >
                    <ProfileField title="PPE Type" value={ppe_type} renderer={v => v.name} className="col-lg-12"/>
                    <ProfileField title="Employee" value={employee} renderer={v => v.full_name}
                                  className="col-lg-12"/>
                    <ProfileField title="Result" value={result} className="col-lg-12"/>
                    <ProfileField title="Notes" value={notes} className="col-lg-12"/>
                    <ProfileField title="Test Date" type="date" value={test_date} className="col-lg-12"/>
                    <ProfileField title="Next Due Date" type="date" value={next_due_date} className="col-lg-12"/>
                </Row>
            </RowOrgs>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
