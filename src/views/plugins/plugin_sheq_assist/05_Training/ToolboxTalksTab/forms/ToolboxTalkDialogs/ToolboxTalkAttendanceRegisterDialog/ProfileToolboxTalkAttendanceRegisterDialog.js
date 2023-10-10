import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';

import {isWeb} from "utils/UtilsFuns";
import {Dates} from "utils/Dates";
import {AProfileDialog} from 'components/dialogs';
import {
    ProfileField,
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from "components/FormTableComponents";

import style from "./ProfileToolboxTalkAttendanceRegisterDialog.lazy.css";
import EditDialog from "./EditToolboxTalkAttendanceRegisterDialog";

@observer
class ProfileToolboxTalkAttendanceRegisterDialog extends AProfileDialog {
    pageKey = "ProfileToolboxTalkAttendanceRegisterDialog";

    constructor(props) {
        super(props, style);
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
    }

    onDownload(evt, btn) {
        progressDialog.open();
        neonBinding.events.emit(this.path + "export-excel", this.item).then(res => {
            if(!res) {
                infoDialog.open("An error occurred. Please try again");
            } else {
                if(isWeb()) {
                    infoDialog.open(<>
                        <p>Toolbox Talk Attendance Register successfully exported.</p>
                        <p><small>The file will be automatically downloaded</small></p>
                    </>);
                    //TODO: rename toolbox talk to training meeting / toolbox talk
                    saveFileAs(res, `Training-Toolbox-Talks-Attendance-Register_${Dates.formatDate(new Date())}.xlsx`);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>Toolbox Talk Attendance Register successfully exported.</p>
                        <p>Saved in the following folder:</p>
                        <p><small>{res.path}</small></p>
                        <p><small>The file will open after 3 seconds</small></p>
                    </React.Fragment>);
                }
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

    get item() {
        return this.props.state.item;
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
                {isConsultant && <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name}
                              className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name}
                              className="col-lg-12"/>
                <ProfileField title="Site" value={site} renderer={v => v.name || v.data.name}
                              className="col-lg-12"/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="1. Register Details"
            >
                <ProfileField title="Subject" value={subject} className="col-lg-12"/>
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

export default ProfileToolboxTalkAttendanceRegisterDialog;
