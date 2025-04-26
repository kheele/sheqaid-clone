// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, SAIdUtils} from 'utils/Utils';

import {Button, ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';
import {ANewDialog} from 'components/dialogs';

import style from "../ImportDialog.lazy.css";
import {findByDepartment, findByJobPosition} from "mutations/findBy";
import {processEmployeeFileImport} from "mutations/send";
import GroupBy from "./GroupBy";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ImportDialog">
@observer
class ImportDialog extends ANewDialog {
    pageKey = "ImportEmployeesDialog";
    title = "Import Employees";

    constructor(props) {
        super(props, style);
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel" onClick={this.onCancel}>
                <i className="fa fa-times icon-left"/>Cancel
            </Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Save All
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/';

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            group_by: [
                {text: 'Job Position', value: 'Job Position', checked: true},
                {text: 'Department', value: 'Department', checked: false}
            ],
            genders: ["Male", "Female", "Other"]
        },
        list: [],
        groupBy: "Job Position"
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onUpload = this.onUpload.bind(this);

        this.form = new Form();
        this.form.addChangeOne("group_by", this.onChangeGroupBy.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeGroupBy">
    onChangeGroupBy(el, val) {
        this.state.groupBy = val || "Job Position";
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mapErrors">
    mapErrors(err, n) {
        const mapErrors = (v, i) => {
            const {length} = err.value;
            if (i === length - 1) {
                return v;
            } else if (i === length - 2) {
                return v + ' OR ';
            } else {
                return v + ', ';
            }
        };
        return <TRow key={"item-" + n} className="text-left font-size-15">
            {n + 1} - {err.value.map(mapErrors).join('').trim()}
        </TRow>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onUpload">
    onUpload() {
        electronDialog.showOpenDialogSpreadsheetRaw().then(async res => {
            if (res) {
                progressDialog.open();
                processEmployeeFileImport(res.path).then(async res => {
//                    console.log("data", res)
                    if (!res) {
                        infoDialog.open('An error occured. Please try again');
                        return;
                    }
                    if (res.errors) {
                        infoDialog.open(<div className="info-dialog-content">
                            <THead className="padding-10 margin-b-15">The following Spreadsheet Header Column Cells are
                                required:</THead>
                            {res.errors.map(this.mapErrors)}
                        </div>);
                    } else {

                        const {
                            client,
                        } = this.form.data;

                        this.state.list = await Promise.all(res.map(async val => {
                            let {
                                fname,
                                id_num,
                                passport_num,
                                sex,
                                dob,
                                email,
                                employment_num,
                                job_position,
                                job_category,
                                department,
                                employment_date
                            } = val;
//                            console.log('val', val)

                            const setGender = sex => {
                                if (sex) {
                                    const g = sex.trim().toLowerCase();
                                    console.log('g', g)
                                    if (g === 'female' || g === 'male') {
                                        val.sex = sex.toTitleCase();
                                    } else if (g === 'f' || g === 'm') {
                                        val.sex = g === 'f' ? 'Female' : "Male";
                                    }
                                }
                            };

                            if (fname.toLowerCase().startsWith("mr ") || fname.toLowerCase().startsWith("ms ")) {
                                val.fname = fname.substring(2).trim();
                            } else if (fname.toLowerCase().startsWith("mrs ")) {
                                val.fname = fname.substring(3).trim();
                            } else if (fname.toLowerCase().startsWith("miss ")) {
                                val.fname = fname.substring(4).trim();
                            }

                            if (id_num) {
                                if (SAIdUtils.isValid(id_num)) {
                                    sex = SAIdUtils.getGender(id_num);
                                    dob = SAIdUtils.getDOB(id_num);
                                    if (sex) {
                                        val.sex = sex;
                                    } else {
                                        setGender(val.sex);
                                    }
                                    val.dob = dob || val.dob;
                                } else {
                                    if (!passport_num) {
                                        val.passport_num = id_num;
                                    }
                                    delete val.id_num;
                                    setGender(sex);
                                }
                            } else {
                                if (sex) {
                                    setGender(sex);
                                }
                                if (dob) {
                                    val.dob = Dates.parse(dob);
                                }
                            }

                            if (!val.sex) {
                                delete val.sex;
                            }
                            if (!val.dob) {
                                delete val.dob;
                            }

                            if (email) {
                                val.email = val.email.toLowerCase();
                            }

                            if (employment_num || job_position || department || employment_date) {
                                if (employment_num) {
                                    val.employment_num = employment_num;
                                    delete val.employment_num;
                                }
                                if (employment_date) {
                                    val.employment_date = Dates.parse(employment_date);
                                }
                                if (job_position) {
                                    job_position = job_position.toLowerCase().toCapitalCase();
                                    const found_job_position = await findByJobPosition({
                                        client_id: client.id,
                                        name: job_position,
                                    });
                                    if (found_job_position) {
                                        const {id, data: {name}} = found_job_position;
                                        if (job_category) {
                                            val.job_position = {
                                                id,
                                                name: name.toLowerCase().toCapitalCase(),
                                                job_category
                                            };//{name: job_position, job_category};
                                        } else {
                                            val.job_position = {id, name: name.toLowerCase().toCapitalCase()};
                                        }
                                    } else {
                                        val.job_position = job_position;
                                    }
                                    // else {
                                    // 	if (job_category) {
                                    // 		val.job_position = {name: job_position, job_category};
                                    // 	} else {
                                    // 		val.job_position = job_position;
                                    // 	}
                                    // }
                                    // delete val.job_position;
                                }

                                if (department) {
                                    department = department.toLowerCase().toCapitalCase();
                                    const found_department = await findByDepartment({
                                        client_id: client.id,
                                        name: department,
                                    });
                                    if (found_department) {
                                        const {id, data: {name}} = found_department;
                                        val.department = {id, name: name.toLowerCase().toCapitalCase()};
                                    } else {
                                        val.department = department;
                                    }
                                    // delete val.department;
                                }
                            }
                            // delete val.job_category;

                            return val;
                        }));
                    }
                }).catch(err => {
                    infoDialog.open('An error occured. Please try again');
                }).finally(() => {
                    progressDialog.close();
//                    btn.text("Save").enabled();
                });
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {groupBy: {innerRefsList}}} = this;

        btn.text("Saving...").disabled();

//        console.log('groupBy.innerRefsList', innerRefsList)
        if (btn.saving) {
            return;
        }
        btn.saving = true;

        const tasks = innerRefsList.map(async (ref, n) => {
            try {
                const res = await ref.onSave();
                console.log('innerRefsList', n, res)
            } catch (err) {
                console.error('innerRefsList err ' + n, err)
            }
        });
        return tasks.reduce((promiseChain, currentTask) => {
            return promiseChain.then(chainResults =>
                currentTask.then(currentResult =>
                    [...chainResults, currentResult]
                )
            );
        }, Promise.resolve([])).then(results => {
            // Do something with all results
//            alert(results)
            console.log('results', results)
            btn.text("Save All").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <SelectClientInput ref="client" name="client" placeholder="Company..." required
                                           className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project" placeholder="Project..." required showAll
                                            className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site" placeholder="Site..." required showAll
                                         className="col-lg-4 form-control"
                                         onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <Button className="btn btn-primary hor-center margin-t-5" onClick={this.onUpload}>Upload Spread
                            Sheet</Button>
                    </div>
                </div>
                <div className="row padding-0 pos-relative">
                    <ClearableInput name="group_by" type="radio" placeholder="Group By"
                                    values={this.state.lists.group_by}
                                    className="w-415 margin-t-30 -margin-b-5 fixed-center form-control"/>
                    <GroupBy ref="groupBy" control={this} state={this.state} path={this.path}/>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default ImportDialog;
//944