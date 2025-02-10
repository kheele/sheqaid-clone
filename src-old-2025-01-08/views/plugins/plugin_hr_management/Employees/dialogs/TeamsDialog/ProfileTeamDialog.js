// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from "mobx";

import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable, NewPPEItemListTable} from 'components/FormTableComponents';

import style from "./ProfileTeamDialog.lazy.css";
import {CircularProgress} from "@mui/material";
import {findByIdTeam} from "mutations/findById";
import {updateTeam} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTeamDialog";
    findById = findByIdTeam;
    removeById = updateTeam;
    softDeleteAttrs = {status: "Inactive"};

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Team";
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
                    supervisor,
                    name, status,
                    //
                    list,
                    //
                    ppe_type_list,
                    employee_list,
                }
            }
        } = this;

        return <>
            <FormControls>
                <RowOrgs
                    readonly
                    client={client}
                    project={project}
                    site={site}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <Row
                        rendered
                        idx={1}
                        title="1. Team Details"
                    >
                        <ProfileField title="Supervisor" value={supervisor}
                                      renderer={v => (v.lname || v.data.lname) + " " + (v.fname || v.data.fname)}
                                      className="col-lg-12"/>
                        <ProfileField title="Team Name" value={name} className="col-lg-12"/>
                        <ProfileField title="Status" value={status} className="col-lg-12"/>
                    </Row>
                </RowOrgs>
                <Row
                    rendered
                    idx={2}
                    title="2. Team Members"
                    sectionClassName="-margin-l-10 -margin-t-5 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <NewEmployeeListTable
                        name="employee_list"
                        defaultValue={[...(employee_list || [])]}
                        readonly
                        className="w-full"
                    />
                </Row>
                <Row
                    rendered
                    idx={3}
                    title="3. PPE Required"
                    sectionClassName="-margin-l-10 -margin-t-5 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <NewPPEItemListTable
                        name="ppe_type_list"
                        defaultValue={[...(ppe_type_list || [])]}
                        readonly
                        className="w-full"
                    />
                </Row>
            </FormControls>
        </>;
    }

    // </editor-fold>

}

export default ProfileDialog;
