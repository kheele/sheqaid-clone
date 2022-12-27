// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../../../../utils/Utils';
import {
    ClearableInput,
    ProfileField,
    SelectClientInput, SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectToolboxTalkCourseInput, SelectToolboxTalkSubjectCategoryInput, SelectUserInput, UploadButton
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../components/dialogs';

import style from "./ProfileToolboxTalkDialog.lazy.css";
import {NewEmployeeListTable} from "../../../../../components/FormTableComponents";
import {SelectTable} from "../../../../../components/tables";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileToolboxTalkDialog extends AProfileDialog {
    pageKey = "ProfileToolboxTalkDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Toolbox Talk / Training Meeting";
    }

    get controls() {
        return Controls;
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

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    //0
                    client, project, site,
                    //1
                    course,
                    training_frequency, subject_category,
                    date, time_from, time_to,//list
                    //2
                    institution_conducting_training,//list
                    hr,//list
                    job_desc,
                    //3
                    doc,//list
                    //4
                    attendance_register_doc,//list
                    attendance_register_list,//list
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        return (<FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField name="client" title="Company" value={client}
                                               renderer={val => val.name || val.data.name} className="col-lg-12"/>}
                <ProfileField name="project" title="Project" value={project} renderer={val => val.name || val.data.name}
                              className="col-lg-12"/>
                <ProfileField name="site" title="Site" value={site} renderer={val => val.name || val.data.name}
                              className="col-lg-12"/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Course Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <ProfileField name="course" title="Course" value={course} className="col-lg-12"/>
                <ProfileField name="training_frequency" title="Training Frequency" value={training_frequency}
                              className="col-lg-12"/>
                <ProfileField name="subject_category" title="Subject Category" value={subject_category}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                activeAlways
                idx={2}
                title="2. Toolbox Talk / Training Meeting"
            >
                <FormControls>
                    <Row
                        rendered
                        idx={2.1}
                        title="2.1. Date & Time"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="date" title="Date" value={date} className="col-lg-12"/>
                        <div
                            className="
                            flex col-lg-12 bg-eee margin-t-10 margin-b-5 border-radius-20
                            padding-t-20 padding-b-10 padding-l-10 padding-r-10
                            ">
                            <ProfileField title="Time From" value={time_from} className="col-lg-6"/>
                            <ProfileField title="Time To" value={time_to} className="col-lg-6"/>
                        </div>
                    </Row>
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2. Person / Institution Conducting Training"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="institution_conducting_training" title="Institution Conducting Training"
                                      value={institution_conducting_training} className="col-lg-12"/>
                        <ProfileField name="hr" title="Training Conductor" value={hr}
                                      renderer={v => (v.fname || v.data.fname + ' ' + v.lname || v.data.lname)}
                                      className="col-lg-12"/>
                        <ProfileField name="job_desc" title="Job Position" value={job_desc}
                                      renderer={v => v.name || v.data.name} desc="Job Position For Training Conductor"
                                      className="col-lg-12"/>
                    </Row>
                    <Row
                        rendered
                        idx={2.3}
                        title="2.3. Attach Toolbox Talk / Training Meeting Document"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <UploadButton
                            name="doc"
                            buttonTitle="Document (PDF, Word)"
                            type={['Word', 'PDF', 'Image']}
                            showOnlyIcon
                            defaultValue={doc}
                            className="col-lg-6 hor-center"
                            readonly
                        />
                    </Row>
                    <Row
                        rendered
                        idx={2.4}
                        title="2.4. Attendance Register"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <FormControls>
                            <Row
                                rendered
                                activeAlways
                                idx={2.41}
                                title="2.4.1 Attach Attendance Register File"
                            >
                                <UploadButton
                                    name="attendance_register_doc"
                                    buttonTitle="Document (PDF, Word)"
                                    type={['Word', 'PDF', 'Image']}
                                    showOnlyIcon
                                    defaultValue={attendance_register_doc}
                                    className="col-lg-6 hor-center"
                                    readonly
                                />
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                idx={2.42}
                                title="2.4.2 Add Employee Attendance List"
                            >
                                <NewEmployeeListTable ref="attendance_register_list" name="attendance_register_list"
                                                      defaultValue={attendance_register_list}/>
                            </Row>
                        </FormControls>
                    </Row>
                </FormControls>
            </Row>
        </FormControls>);
    }

    // </editor-fold>

}

export default ProfileToolboxTalkDialog;
