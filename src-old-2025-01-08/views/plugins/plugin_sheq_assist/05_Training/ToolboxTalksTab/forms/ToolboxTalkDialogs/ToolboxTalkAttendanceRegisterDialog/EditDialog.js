import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import Form from 'utils/Form';
import {Dates, ShouldUpdate} from 'utils/Utils';
import {
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectToolboxTalkSubjectInput
} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';
import {FormControls, Row} from "components/FormComponents";
import style from "./EditDialog.lazy.css";
import {NewEmployeeListTable} from "components/FormTableComponents";
import updateTrainingToolboxTalkRegister
    from "mutations/all/TrainingToolboxTalkRegister/updateTrainingToolboxTalkRegister";

@observer
class EditDialog extends AEditDialog {
    pageKey = "ToolboxTalkAttendanceRegisterDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Toolbox Talk Attendance Register";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    @computed get item() {
        return this.props.state.item;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isConsultant, isNoProjects} = storage.is;

        //1
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //2
        if (!form.isValid('subject')) {
            infoDialog.open('Toolbox Talk / Training Meeting Subject is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('employee_list')) {
            infoDialog.open('At least 1 Employee is required');
            return;
        }

        const {
            //0
            client,
            project,
            site,
            //1
            subject,
            date,
            employee_list,
        } = form.data;

        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        ShouldUpdate.check(data, old_data, subject, 'subject');
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.checkEmployeeList(data, old_data, employee_list, 'employee_list');

        console.log(data)

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateTrainingToolboxTalkRegister({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if (res) {
                const {path: file, item} = res;
                //TODO: rename toolbox talk to training meeting / toolbox talk
                saveFileAs(file, `Training-Toolbox-Talks-Attendance-Register_${Dates.formatDate(new Date())}.xlsx`);

                infoDialog.open(<>
                    <p>Toolbox Talk Attendance Register successfully updated & exported.</p>
                    <p><small>The file will be automatically downloaded</small></p>
                </>);
                onSaved && onSaved(item.data);

                this.props.close();
            } else {
                infoDialog.open("An error occurred. Please try again.");
                infoDialog.close(2000);
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        if (!this.item)
            return null;

        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    defaultValue={RenderUtils.selectedClient.call(this)}
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required
                                    defaultValue={RenderUtils.selectedProject.call(this)}
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required
                                 defaultValue={RenderUtils.selectedSite.call(this)}
                                 className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="1. Register Details"
            >
                <SelectToolboxTalkSubjectInput name="subject" placeholder="Toolbox Talk / Training Meeting Subject..."
                                               defaultValue={subject}
                                               className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="date" type="date" placeholder="Date..."
                                defaultValue={date}
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                title="2. Employee List"
            >
                <NewEmployeeListTable ref="employee_list" name="employee_list"
                                      defaultValue={[...(employee_list || []), null]}
                                      onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
