// <editor-fold defaultstate="collapsed" desc="imports">
import React, {createRef} from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import Divider from "@mui/material/Divider";

import Form from '../../../../../../utils/Form';
import {Dates, execWhen} from "../../../../../../utils/Utils";

import {
    Button,
    ClearableInput, DateRangeInput,
    ProofUploadButton,
    SelectClientInput, SelectEmployeeInput,
    SelectJobCategoryInput, SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectToolboxTalkCourseInput,
    SelectTrainingMatixInput,
    SelectUserInput, UploadButton
} from '../../../../../../components/inputs';
import {SelectTable, THead} from '../../../../../../components/tables';
import ANewDialog from '../../../../../../components/dialogs/ANewDialog';

import style from "./NewTrainingRegisterDialog.lazy.css";
import {FormControls, Row} from "../../../../../../components/FormComponents";
import TrainingPlanListByCourse from "../../../../../../components/FormListComponents/TrainingPlanListByCourse";
import insertTrainingRegister from "../../../../../../mutations/all/TrainingRegister/insertTrainingRegister";
// </editor-fold>

const CONST_NEGATIVE_TIME = "negativeTime";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewTrainingRegisterDialog extends ANewDialog {
    pageKey = "NewTrainingRegisterDialog";
    title = "Create Training Register";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/05_Trainings/training-register/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {},
        trainer: null,
        employees: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.trainingPlanListRef = createRef(null);

        // this.onChangeEmployees = this.onChangeEmployees.bind(this);

        this.form = new Form();
        this.form.addChangeOne("training", this.onChangeTrainingMatrix.bind(this));
        this.form.addChangeOne("time_from", this.onChangeTimeFrom.bind(this));
        this.form.addChangeOne("time_to", this.onChangeTimeTo.bind(this));
        this.form.addChangeOne("trainer", this.onChangeTrainer.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeTrainingMatrix">
    onChangeTrainingMatrix(el, val) {
        execWhen(() => this.trainingPlanListRef && this.trainingPlanListRef.current).then(async ref => {
            if (val) {
                ref.setValue(val);
            } else {
                ref.setValue(null);
            }
        });
        execWhen(() => this.refs.selectEmployeeTable &&
            this.refs.institution_conducting_training &&
            this.refs.trainer).then(() => {
            const {
                selectEmployeeTable,
                institution_conducting_training: institution_conducting_training_ref,
                trainer: trainer_ref
            } = this.refs;
            if (val) {
                const {
                    training_plan,
                    institution_conducting_training,
                    hr: trainer
                } = val.data;

                console.log('training_plan', training_plan)
                console.log('institution_conducting_training', institution_conducting_training)
                console.log('hr', trainer)

                if (training_plan) {
                    const {
                        group,
                        list,
                        cost,
                        attendanceRate,
                        results,
                        status,
                        employeeList,
                        jobPositionList,
                        courseList
                    } = training_plan;
                    selectEmployeeTable.list = employeeList;
                }
                if (institution_conducting_training) {
                    institution_conducting_training_ref.value = institution_conducting_training;
                } else {
                    const {selectedClient} = storage.selected;
                    if (selectedClient) {
                        const {name, company_name} = selectedClient.data || selectedClient;
                        institution_conducting_training_ref.value = name || company_name;
                    }
                }
                if (trainer) {
                    const {id, fname, lname, data} = trainer;
                    trainer_ref.value = {label: `${lname || data.lname} ${fname || data.fname}`, value: trainer};
                }
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeTimeFrom">
    onChangeTimeFrom(el, val) {
        execWhen(() => this.refs.time_to &&
            this.refs.time_or_duration).then(() => {
            const {
                time_to: time_to_ref,
                time_or_duration: time_or_duration_ref
            } = this.refs;
            if (val) {
                if (time_to_ref.hasValue) {
                    const time_from = val;

                    const hrs = calcTimeDiff({
                        time_from: time_from,
                        time_to: time_to_ref.value,
                    });
                    if (hrs === CONST_NEGATIVE_TIME) {
                        time_or_duration_ref.reset();

                        infoDialog.open(<>
                            <b>Time From</b> MUST be less than <b>Time To</b>
                        </>);
                    } else {
                        time_or_duration_ref.setEditable(true);
                        time_or_duration_ref.value = hrs;
                        time_or_duration_ref.setEditable(false);
                    }
                } else {
                    time_or_duration_ref.reset();
                }
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeTimeTo">
    onChangeTimeTo(el, val) {
        execWhen(() => this.refs.time_from &&
            this.refs.time_or_duration).then(() => {
            const {
                time_from: time_from_ref,
                time_or_duration: time_or_duration_ref
            } = this.refs;
            if (val) {
                if (time_from_ref.hasValue) {
                    const time_to = val;

                    const hrs = calcTimeDiff({
                        time_from: time_from_ref.value,
                        time_to,
                    });
                    if (hrs === CONST_NEGATIVE_TIME) {
                        time_or_duration_ref.reset();

                        infoDialog.open(<>
                            <b>Time From</b> MUST be less than <b>Time To</b>
                        </>);
                    } else {
                        time_or_duration_ref.setEditable(true);
                        time_or_duration_ref.value = hrs;
                        time_or_duration_ref.setEditable(false);
                    }
                } else {
                    time_or_duration_ref.reset();
                }
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeTrainer">
    onChangeTrainer() {
//        const {trainer} = this.state;
//        this.refs.selectTrainerTable.setSelectedList(trainer).open().then(list => {
//            this.state.trainer = list[0];
//        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeEmployees">
    // onChangeEmployees() {
    //     const {employees} = this.state;
    //     const list = employees ? employees.map(v => v.employee) : null;
    //     this.refs.selectEmployeeTable.setSelectedList(list).open().then(list => {
    //         this.state.employees = list.map(employee => {
    //             return {employee}
    //         });
    //     });
    // }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, state: {employees}} = this;
        const {isConsultant, isNoProjects} = storage.is;

        //1
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('training')) {
            infoDialog.open('Training Matrix is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('trainer')) {
            infoDialog.open('Trainer is required');
            return;
        }
        if (!form.isValid('employee_list') && !form.isValid('list_proof')) {
            infoDialog.open('At Least 1 Employee On The Training Register is required');
            return;
        }

//         if (!employees) {
//             infoDialog.open('Please Add At Least 1 Employee On The Training Register');
//             return;
//         } else {
// //                for(var n = 0; n < employees.length; n++){
// //                    const item = employees[n];
// //                    if(!item.signature) {
// //                        const {fname, lname} = item.employee.data;
// //                        infoDialog.open((fname + ' ' + lname) + ' does not have a signature provided');
// //                        return;
// //                    }
// //                }
//         }

        const {
            //0
            client, project, site,
            //1
            training,
            //2
            time_or_duration,
            time_from,
            time_to,
            date,//
            //3
            institution_conducting_training,
            trainer,//
            //4
            list_proof,
            employee_list,//
        } = form.data;
        const data = {
            time_or_duration,
            time_from,
            time_to,
            date: Dates.formatDateSQL(date),
            institution_conducting_training,

            list_proof: list_proof && list_proof.path,
            employee_list: {
                data: [...(employee_list || [])].map(({employee: {id}, signature, date}) => ({
                    employee_id: id,
                    signature,
                    date: Dates.formatDateSQL(date),
                })),
            },

            trainer_id: trainer && trainer.id,
            trainer_external: (trainer && !trainer.id) ? {data: trainer} : null,
            training_id: training && training.id,

            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertTrainingRegister(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Training Matrix (Course)"
                onFormOpen={onFormOpen}
                onFormBack={!isNoProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTrainingMatixInput name="training" placeholder="Training Matrix (Course)..."
                                          className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <br/>
                <TrainingPlanListByCourse ref={this.trainingPlanListRef} name="training_plan" readonly/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Duration, Time & Date"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput
                    name="date"
                    type="date"
                    placeholder="Date"
                    required
                    defaultValue={new Date()}
                    className="col-lg-6 pull-left-3 margin-t-15 form-control"
                    onChange={this.form.onChange}
                />
                <div
                    className="col-lg-6 pull-left-3 margin-t-10 border-radius-20 padding-10 padding-t-20 bg-eee border-w-2 bg-border-grey flex">
                    <ClearableInput
                        ref="time_from"
                        name="time_from"
                        type="time"
                        placeholder="Start Time..."
                        className="form-control border-radius-l-20"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        ref="time_to"
                        name="time_to"
                        type="time"
                        placeholder="End Time..."
                        className="form-control border-radius-r-20"
                        onChange={this.form.onChange}
                    />
                </div>
                <ClearableInput
                    ref="time_or_duration"
                    name="time_or_duration"
                    type="text"
                    placeholder="Duration"
                    readonly
                    className="col-lg-6 pull-left-3 margin-t-15 form-control"
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Trainer / Institution Conducting Training"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="institution_conducting_training" name="institution_conducting_training" type="text"
                                placeholder="Institution Conducting Training" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <SelectEmployeeInput ref="trainer" name="trainer" placeholder="Trainer..." showOtherPerson
                                 required
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Attendance Register"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="list_proof"
                    buttonTitle="Attendance Register Proof (PDF, Word, Image)"
                    type={['Word', 'PDF', 'Image']}
                    showOnlyIcon
                    className="col-lg-7 hor-center"
                    onChange={this.form.onChange}
                />
                <Divider/>
                <SelectTable
                    ref="selectEmployeeTable"
                    replaceCols
                    name="employee_list"
                    desc="Employees" title="Select Employees"
                    className="col-lg-12 no-padding min-h-500 SelectEmployeeTable"
                    renderTHead={renderTHeadEmployees}
                    renderItem={renderItemEmployees}
                    isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

//<editor-fold desc="calcTimeDiff">
function calcTimeDiff({time_from, time_to}) {
    const time_from_now = new Date();
    const time_to_now = new Date();

    const getTime = (time) => {
        let hh, mm;
        const parts = time.split(':');
        hh = parseInt(parts[0], 10);
        mm = parseInt(parts[1], 10);
        return {hh, mm};
    };

    // console.log(time_from, time_to)
    const {hh: f_hh, mm: f_mm} = getTime(time_from);
    const {hh: t_hh, mm: t_mm} = getTime(time_to);

    time_from_now.setHours(f_hh, f_mm);
    time_to_now.setHours(t_hh, t_mm);

    if (time_from_now.getTime() > time_to_now.getTime()) {
        return CONST_NEGATIVE_TIME;
    }

    const num = time_from_now.durationNextHours(time_to_now);
    const parts = String(num).split('.');
    const min = parseInt(`0.${parts[1]}`) * 60;
    return `${parts[0]}hrs${isNaN(min) ? '' : (', ' + min + 'min')}`;
}

//</editor-fold>

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
    const {id, data: {created_at, fname, lname, id_num, passport_num, job_position, client, project, site}} = item;
    return <React.Fragment key={id} className="tr-readonly">
        <div className="td fixed-flex min-w-30">{n + 1}</div>
        <div className="td">{fname + ' ' + lname}</div>
        <div className="td fixed-flex min-w-150">{id_num || passport_num}</div>
        <div className="td">{job_position ? job_position.name : 'N/A'}</div>
        <div className="td"></div>
        <div className="td fixed-flex min-w-90"></div>
    </React.Fragment>;
}

// </editor-fold>

export default NewTrainingRegisterDialog;
