import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';
import {Dates} from "utils/Dates";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField,} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from "components/FormTableComponents";

import style from "./ProfileDialog.lazy.css";
import EditDialog from "./EditDialog";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileDialog";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Toolbox Talk Attendance Register";
    }

    onDownload(evt, btn) {
        this.refs.controls.onDownload(evt, btn);
    }

    onEdit(evt, btn) {
        this.refs.controls.onEdit(evt, btn);
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);
    }

    @computed get item() {
        return this.props.state.item;
    }

    onDownload(evt, btn) {
        progressDialog.open();
        neonBinding.events.emit("plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/export-excel", this.item).then(res => {
            if (!res) {
                infoDialog.open("An error occurred. Please try again");
            } else {
                infoDialog.open(<>
                    <p>Toolbox Talk Attendance Register successfully exported.</p>
                    <p><small>The file will be automatically downloaded</small></p>
                </>);
                //TODO: rename toolbox talk to training meeting / toolbox talk
                saveFileAs(res, `Training-Toolbox-Talks-Attendance-Register_${Dates.formatDate(new Date())}.xlsx`);
            }
        }).finally(() => {
            progressDialog.close();
        });
    }

    onEdit(evt, btn) {
        this.refs.editDialog.open(this.item).then(updateAttrs => {
            extendObservable(this.item.data, updateAttrs)
        });
    }

    render() {
        if (!this.item)
            return null;

        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, subject, date, employee_list, client, project, site
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        return <FormControls>
            {!isNoProjects && <Row
                activeAlways
                rendered
                idx={0}
                title="Company / Project / Site"
            >
                {isConsultant && <ProfileField title="Company" value={client} renderer={v => v.name}
                                               className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={v => v.name}
                              className="col-lg-12"/>
                <ProfileField title="Site" value={site} renderer={v => v.name}
                              className="col-lg-12"/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="1. Register Details"
            >
                <ProfileField title="Toolbox Talk / Training Meeting Subject" value={subject} className="col-lg-12"/>
                <ProfileField title="Date" value={date} type="date" className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                title="2. Employee List"
            >
                <NewEmployeeListTable ref="employee_list" name="employee_list" defaultValue={employee_list} readonly/>
            </Row>
            <EditDialog ref="editDialog"/>
        </FormControls>;
    }

}

export default ProfileDialog;
