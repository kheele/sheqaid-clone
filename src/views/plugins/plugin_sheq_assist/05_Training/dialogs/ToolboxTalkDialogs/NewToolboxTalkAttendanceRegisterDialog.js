import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    SelectClientInput, SelectProjectInput, SelectSiteInput,
    SelectToolboxTalkCourseInput,
} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import {FormControls, Row} from "components/FormComponents";
import style from "./NewToolboxTalkAttendanceRegisterDialog.lazy.css";
import {THead} from "components/tables";
import {NewEmployeeListTable} from "components/FormTableComponents";
import {execWhen, isWeb} from "utils/UtilsFuns";
import {Dates} from "utils/Dates";

@observer
class NewToolboxTalkAttendanceRegisterDialog extends ANewDialog {
    pageKey = "NewToolboxTalkAttendanceRegisterDialog";
    title = "Create Toolbox Talk Attendance Register";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/';
    @observable
    state = {};

    constructor() {
        super();

        this.form = new Form();
        this.form.addChangeOne("employee_list", this.onChangeEmployeeList.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="onChangeEmployeeList">
    onChangeEmployeeList(el, val) {
        execWhen(() => this.refs.selectEmployeeTable).then(selectEmployeeTable => {
            if (val) {
                console.log('onChangeEmployeeList', val)
                selectEmployeeTable.list = val;
            }
        });
    }

    // </editor-fold>

    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant, isNoProjects} = storage.is;

        //1
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //2
        if (!form.isValid('course_or_module')) {
            infoDialog.open('Course is required');
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

        const {client, project, site, course_or_module, date, employee_list} = form.data;
        const data = {};

        if (client) {
            if (client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if (project) {
            if (project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
                data.project_id = id;
            } else {
                data.project = project;
            }
        }
        if (site) {
            if (site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
                data.site_id = id;
            } else {
                data.site = site;
            }
        }

        if (course_or_module) {
            data.course_or_module = course_or_module;
        }
        if (date) {
            data.date = date.getTime();
        }
        if (employee_list) {
            data.employee_list = employee_list.map((
                {
                    employee,
                    employee: {
                        id,
                        data: {
                            fname,
                            lname,
                            email,
                            phone,
                            id_num,
                            passport_num
                        }
                    }
                }
            ) => ({
                id, fname, lname, email, phone, id_num, passport_num
            }));
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if(res) {
                const {path: file, item} = res;
                if(isWeb()) {
                    //TODO: rename toolbox talk to training meeting / toolbox talk
                    saveFileAs(file, `Training-Toolbox-Talks-Attendance-Register_${Dates.formatDate(new Date())}.xlsx`);

                    infoDialog.open(<>
                        <p>Toolbox Talk Attendance Register successfully saved & exported.</p>
                        <p><small>The file will be automatically downloaded</small></p>
                    </>);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>Toolbox Talk Attendance Register successfully saved & exported.</p>
                        <p>Saved in the following folder:</p>
                        <p><small>{file.path}</small></p>
                        <p><small>The file will open after 3 seconds</small></p>
                    </React.Fragment>);
                }
                onSaved && onSaved(item);

                this.props.close();
            } else {
                infoDialog.open("An error occurred. Please try again.");
                infoDialog.close(2000);
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        const {isConsultant, isNoProjects} = storage.is;

        return <FormControls>
            {!isNoProjects && <Row
                activeAlways
                rendered
                idx={0}
                title="Company / Project / Site"
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="1. Register Details"
            >
                <SelectToolboxTalkCourseInput name="course_or_module" placeholder="Course..."
                                              className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                title="2. Employee List"
            >
                <NewEmployeeListTable ref="employee_list" name="employee_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

// <editor-fold defaultstate="collapsed" desc="renderTHeadEmployees">
function renderTHeadEmployees() {
    return <THead>
        <div className="td fixed-flex min-w-30">#</div>
        <div className="td">Name</div>
        <div className="td fixed-flex min-w-150">ID/Passport No.</div>
        <div className="td">Job Position</div>
        <div className="td">Site</div>
        <div className="td fixed-flex min-w-90">Signature</div>
        <div className="td fixed-flex no-padding min-w-70"></div>
    </THead>;
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderItemEmployees">
function renderItemEmployees(item, n) {
    const {id, data, employee} = item;
    const {
        fname,
        lname,
        id_num,
        passport_num,
        job_position,
        client,
        project,
        site
    } = (employee ? employee.data : employee) || data || item;
    console.log('renderItemEmployees: item', item)
    return <React.Fragment key={id_num || passport_num} className="tr-readonly">
        <div className="td fixed-flex min-w-30">{n + 1}</div>
        <div className="td">{fname + ' ' + lname}</div>
        <div className="td fixed-flex min-w-150">{id_num || passport_num}</div>
        <div className="td">{job_position ? job_position.name : 'N/A'}</div>
        <div className="td"></div>
        <div className="td fixed-flex min-w-90"></div>
    </React.Fragment>;
}

// </editor-fold>

export default NewToolboxTalkAttendanceRegisterDialog;
