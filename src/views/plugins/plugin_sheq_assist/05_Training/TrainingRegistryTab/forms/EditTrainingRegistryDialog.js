// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, extendObservable} from 'mobx';

import Form from 'utils/Form';
import {execWhen, ShouldUpdate} from 'utils/Utils';
import {onSelectLoadTrainingFrequencies} from '../../../../utils';

import {
    ClearableInput,
    SelectClientInput,
    SelectJobPositionInput,
    SelectProjectInput, SelectSectorInput,
    SelectSiteInput
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditTrainingRegistryDialog.lazy.css";
import TrainingCourseGridCounter from "../../dialogs/ProfileStats/TrainingCourseGridCounter";
import TrainingCourseGridReportsLineChart from "../../dialogs/ProfileStats/TrainingCourseGridReportsLineChart";
import findByIdClient from "mutations/all/Client/findByIdClient";
import updateTrainingCourse from "mutations/all/TrainingCourse/updateTrainingCourse";
import updateProxyJobPositionTrainingCourse
    from "mutations/all/ProxyJobPositionTrainingCourse/updateProxyJobPositionTrainingCourse";
import insertProxyJobPositionTrainingCourse
    from "mutations/all/ProxyJobPositionTrainingCourse/insertProxyJobPositionTrainingCourse";
import deleteProxyJobPositionTrainingCourse
    from "mutations/all/ProxyJobPositionTrainingCourse/deleteProxyJobPositionTrainingCourse";
import insertProxySectorTrainingCourse
    from "mutations/all/ProxySectorTrainingCourse/insertProxySectorTrainingCourse";
import deleteProxySectorTrainingCourse
    from "mutations/all/ProxySectorTrainingCourse/deleteProxySectorTrainingCourse";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditTrainingRegistryDialog extends AEditDialog {
    pageKey = "EditTrainingRegistryDialog";
    title = "Edit Training Course";

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
    path = "plugin_sheq_assist/05_Trainings/training-registry/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            frequency: ['Non-Expiry', '5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
            provider: [{text: "Internal", value: "Internal"}, {text: "External", value: "External"}],
        },
        loadedSelectLists: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.onUpdateJobPosition = this.onUpdateJobPosition.bind(this);
        this.onUpdateSector = this.onUpdateSector.bind(this);

        this.form = new Form();
        this.form.addChangeOne("client", this.onChangeClient.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const loads = {frequency: onSelectLoadTrainingFrequencies};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeClient">
    onChangeClient(el, val) {
        execWhen(() => this.refs.sector_list).then(async ref => {
            if (val) {
                const {id, data} = val;

                const set = (data) => {
                    const {sector_list} = data;
                    if (sector_list) {
                        ref.list = sector_list.map(({sector: value}) => {//{id, sector}
                            return {value, label: value.name};
                        });
                    }
                };

                if (data) {
                    set(data);
                } else {
                    findByIdClient(id).then(val => {
                        if (val) {
                            const {id, data} = val;
                            set(data);
                        }
                    });
                }
            } else {
                ref.reset();
            }
        });
    }

    // </editor-fold>

    //<editor-fold desc="onUpdate">
    //<editor-fold desc="onUpdateJobPosition">
    onUpdateJobPosition(el, val, action) {//ADDED / REMOVED
        const {
            item: {
                id, data: old_data, data: {
                    job_position_list,
                }
            }
        } = this;
        console.log('onUpdateJobPosition', el, val, action);
        // return;

        if (val) {
            el.setReadonly(true);
            if (action === 'ADDED') {
                insertProxyJobPositionTrainingCourse({job_position_id: val.id, course_id: id}).then(res => {
                    console.log("res", res)
                    if (res) {
                        if(job_position_list) {
                            job_position_list.push(res.data);
                        } else {
                            extendObservable(old_data, {job_position_list: [res.data]});
                        }
                        infoDialog.open("Record successfully updated.");
                        infoDialog.close(2000);
                        return true;
                    } else {
                        infoDialog.open("Record couldn't be updated. Please try again later.");
                    }
                }).catch(err  => {
                    console.error(err);
                    infoDialog.open("Record couldn't be updated. Please try again later.");
                }).finally(() => {
                    el.setReadonly(false);
                });
            } else {
                deleteProxyJobPositionTrainingCourse({job_position_id: val.id, course_id: id}).then(res => {
                    console.log("res", res)
                    if (res) {
                        job_position_list.removeIf(v => v.id === res.id);
                        infoDialog.open("Record successfully updated.");
                        infoDialog.close(2000);
                        return true;
                    } else {
                        infoDialog.open("Record couldn't be updated. Please try again later.");
                    }
                }).catch(err  => {
                    console.error(err);
                    infoDialog.open("Record couldn't be updated. Please try again later.");
                }).finally(() => {
                    el.setReadonly(false);
                });
            }
        } else {

        }
    }
    //</editor-fold>

    //<editor-fold desc="onUpdateSector">
    onUpdateSector(el, val, action) {//ADDED / REMOVED
        const {
            item: {
                id, data: old_data, data: {
                    sector_list,
                }
            }
        } = this;
        console.log('onUpdateSector', el, val, action);
        // return;

        if (val) {
            el.setReadonly(true);
            if (action === 'ADDED') {
                insertProxySectorTrainingCourse({sector_id: val.id, course_id: id}).then(res => {
                    console.log("res", res)
                    if (res) {
                        if(sector_list) {
                            sector_list.push(res.data);
                        } else {
                            extendObservable(old_data, {sector_list: [res.data]});
                        }
                        infoDialog.open("Record successfully updated.");
                        infoDialog.close(2000);
                        return true;
                    } else {
                        infoDialog.open("Record couldn't be updated. Please try again later.");
                    }
                }).catch(err  => {
                    console.error(err);
                    infoDialog.open("Record couldn't be updated. Please try again later.");
                }).finally(() => {
                    el.setReadonly(false);
                });
            } else {
                deleteProxySectorTrainingCourse({sector_id: val.id, course_id: id}).then(res => {
                    console.log("res", res)
                    if (res) {
                        sector_list.removeIf(v => v.id === res.id);
                        infoDialog.open("Record successfully updated.");
                        infoDialog.close(2000);
                        return true;
                    } else {
                        infoDialog.open("Record couldn't be updated. Please try again later.");
                    }
                }).catch(err  => {
                    console.error(err);
                    infoDialog.open("Record couldn't be updated. Please try again later.");
                }).finally(() => {
                    el.setReadonly(false);
                });
            }
        } else {

        }
    }
    //</editor-fold>
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Course is');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isConsultant} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is');
            return;
        }

        if (!form.isValid('name')) {
            infoDialog.open('Course is');
            return;
        }

        const {
            client, project, site,
            name,
            frequency,
            // sector_list,
            provider,
            // job_position_list,
            unit_standard, unit_standard_desc
        } = form.data;
        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, frequency, 'frequency');
        // ShouldUpdate.checkSectorList(data, old_data, sector_list, 'sector_list');
        ShouldUpdate.check(data, old_data, provider, 'provider');
        // ShouldUpdate.checkJobPositionList(data, old_data, job_position_list, 'job_position_list');
        ShouldUpdate.check(data, old_data, unit_standard, 'unit_standard');
        ShouldUpdate.check(data, old_data, unit_standard_desc, 'unit_standard_desc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateTrainingCourse({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if (res) {
                onSaved && onSaved(res.data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            } else {
                infoDialog.open("Record unable to update. Please try again.");
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
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
            item, item: {
                id, data: {
                    created_at,
                    client, project, site,
                    name,
                    frequency,
                    sector_list,
                    provider,
                    job_position_list,
                    unit_standard, unit_standard_desc
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        const sector_listDefault = sector_list ? sector_list.map(v => {
            const {sector: value, sector: {id, name}} = v;
            return {label: name, value};
        }) : null;
        const job_position_listDefault = job_position_list ? job_position_list.map(v => {
            const {job_position: value, job_position: {id, name}} = v;
            return {label: name, value};
        }) : null;
        const frequencyDefault = frequency ? {label: frequency, value: frequency} : null;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {!isNoProjects && <Row
                    rendered
                    active
                    idx={0}
                    title="Company / Project / Site"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..."
                                                        defaultValue={RenderUtils.selectedClient.call(this)} showAll
                                                        className="col-lg-12 form-control"
                                                        onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..."
                                        defaultValue={RenderUtils.selectedProject.call(this)} showAll
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..."
                                     defaultValue={RenderUtils.selectedSite.call(this)} showAll
                                     className={"col-lg-12 form-control"} onChange={this.form.onChange}/>
                </Row>}
                <Row
                    rendered
                    active={isNoProjects}
                    idx={1}
                    title="1. Details"
                    onFormOpen={onFormOpen}
                    onFormBack={!isNoProjects && onFormBack}
                    onFormNext={onFormNext}
                >
                    <ClearableInput name="name" type="text" placeholder="Course" defaultValue={name}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectJobPositionInput name="job_position_list" type="select_multi"
                                            placeholder="Job Position(s)..." defaultValue={job_position_listDefault}
                                            className="col-lg-12 form-control" onChange={this.form.onChange}
                                            onUpdate={this.onUpdateJobPosition}
                    />
                    <SelectWrapper state={this.state} name="frequency" placeholder="Training Frequency..."
                                   defaultValue={frequencyDefault} className="col-lg-12 form-control"
                                   onChange={this.form.onChange} values="frequency"/>
                    <SelectSectorInput ref="sector_list" name="sector_list" type="select_multi"
                                       placeholder="Sector(s)..." defaultValue={sector_listDefault}
                                       className="col-lg-12 form-control" onChange={this.form.onChange}
                                       onUpdate={this.onUpdateSector}
                    />
                    <ClearableInput name="provider" type="radio" placeholder="Provider" defaultValue={provider}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.provider}/>
                </Row>
                <Row
                    rendered
                    idx={2}
                    title="2. Guideline To Available Unit Standards That May Be Used"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <ClearableInput name="unit_standard" type="text" placeholder="Unit Standard"
                                    defaultValue={unit_standard} className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="unit_standard_desc" type="textarea" placeholder="Unit Standard Description"
                                    defaultValue={unit_standard_desc} className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                </Row>
                <Row
                    rendered
                    activeAlways
                    idx={3}
                    title="3. Dashboard"
                >
                    <TrainingCourseGridCounter item={item}/>
                    <TrainingCourseGridReportsLineChart item={item}/>
                </Row>
            </div>
        </div>);
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectWrapper">
@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, defaultValue, className, onChange, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue}
                               className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

// </editor-fold>

export default EditTrainingRegistryDialog;
