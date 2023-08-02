// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadTrainingFrequencies} from 'views/plugins/utils';

import {
    ClearableInput,
    SelectClientInput,
    SelectJobPositionInput,
    SelectProjectInput, SelectSectorInput,
    SelectSiteInput
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewTrainingRegistryDialog.lazy.css";
import insertTrainingCourse from "mutations/all/TrainingCourse/insertTrainingCourse";
import {execWhen} from "utils/UtilsFuns";
import findByIdClient from "mutations/all/Client/findByIdClient";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewTrainingRegistryDialog extends ANewDialog {
    pageKey = "TrainingRegistry";
    title = "Create Training Course";

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

                if(data) {
                    set(data);
                } else {
                    findByIdClient(id).then(val => {
                        if(val) {
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

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Course is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant, isNoProjects} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        if (!form.isValid('name')) {
            infoDialog.open('Course is required');
            return;
        }

        const {
            client,
            project,
            site,
            name,
            frequency,
            sector_list,
            provider,
            job_position_list,
            unit_standard,
            unit_standard_desc
        } = form.data;

        const data = {
            name,
            frequency,
            provider,
            unit_standard,
            unit_standard_desc,
            sector_list: {
                data: (sector_list || []).map(({id}) => ({sector_id: id}))
            },
            job_position_list: {
                data: (job_position_list || []).map(({id}) => ({job_position_id: id}))
            },
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertTrainingCourse(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            // this.props.close();
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
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." showAll
                                                        className="col-lg-12 form-control"
                                                        onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." showAll
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." showAll className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
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
                    <ClearableInput name="name" type="text" placeholder="Course" required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectJobPositionInput name="job_position_list" type="select_multi"
                                            placeholder="Job Position(s)..." required className="col-lg-12 form-control"
                                            onChange={this.form.onChange}/>
                    <SelectWrapper state={this.state} name="frequency" placeholder="Training Frequency..."
                                   className="col-lg-12 form-control" onChange={this.form.onChange} values="frequency"/>
                    <SelectSectorInput ref="sector_list" name="sector_list" type="select_multi"
                                       placeholder="Sector(s)..." required
                                       className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="provider" type="radio" placeholder="Provider" required
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
                    <ClearableInput name="unit_standard" type="text" placeholder="Unit Standard" required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="unit_standard_desc" type="textarea" placeholder="Unit Standard Description"
                                    required className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
        const {state, name, placeholder, className, onChange, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className}
                               onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

// </editor-fold>

export default NewTrainingRegistryDialog;
