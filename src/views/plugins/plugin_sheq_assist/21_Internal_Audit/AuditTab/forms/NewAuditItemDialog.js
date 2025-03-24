import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';

import {Dates, execWhen, ShouldUpdate} from "utils/Utils";
import {Button, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {onSelectLoadAuditElements, onSelectLoadAuditSubElements} from 'views/plugins/utils';

import style from "./NewAuditItemDialog.lazy.css";
import {updateAuditItem} from "mutations/update";
import {findByIdAuditItem} from "mutations/findById";
import {insertAuditItem} from "mutations/create";

@observer
class NewAuditItemDialog extends ANewDialog {
    pageKey = "NewAuditItemDialog";
    title = "Add Audit Item";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    get findById() {
        const {item} = this.state;
        if (item && item.id) return findByIdAuditItem;
    }

    get generalSavable() {
        const {savable, auditItem} = this.props;
        const {item} = this.state;

        if (!savable) return true;
        if (!item) return true;
        if (!item.id) return true;

        return false;
    }

    get topButtons() {
        const {savable, auditItem} = this.props;
        const {item} = this.state;
        return <>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            {this.generalSavable && <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>{item ? "Edit" : "Add"} Item
            </Button>}
        </>;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {
            elements: [],
            sub_elements: [],
            audit_summary: ['Major NCR', 'Minor NCR', 'Complaint', 'Observation', 'Good Practice', 'Note'],
            achieved_score: [0, 1, 2, 3, 4, 5]
        },
        loadedSelectLists: false,
        compliance: null
    };

    constructor() {
        super();

        this.onFormSave = this.onFormSave.bind(this);
        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeMany(["possible_score", "achieved_score"], this.onChangeScores.bind(this));
    }

    get generalSavable() {
        const {item, savable} = this;

        if (!savable) return true;
        if (!item) return true;
        if (!item.id) return true;

        return false;
    }

    get savable() {
        return this.props.dialog.props.savable;
    }

    get auditItem() {
        return this.props.dialog.props.auditItem;
    }

    @computed get item() {
        return this.props.state.item;
    }

    componentDidMount() {
        const loads = {elements: onSelectLoadAuditElements, sub_elements: onSelectLoadAuditSubElements};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k] = res.distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    onChangeScores(val, name) {
        execWhen(() => this.refs.possible_score && this.refs.achieved_score).then(() => {
            const {possible_score, achieved_score} = this.refs;
            if (!possible_score || !achieved_score) return;

            let perc;
            const max = possible_score.value;
            val = achieved_score.value;
            if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
                perc = ((parseInt(val) / max) * 100);
            } else if (isNullable(val)) {
                perc = null;
            }
            this.state.compliance = perc;
        });
    }

    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 2) {
            if (!form.isValid('audit_findings')) {
                infoDialog.open('Audit Findings is required');
                return;
            }
            // if (!form.isValid('audit_summary')) {
            // 	infoDialog.open('Audit Summary is required');
            // 	return;
            // }
        }
        if (idx === 3) {
            // if (!form.isValid('achieved_score')) {
            // 	infoDialog.open('Achieved Score is required');
            // 	return;
            // }
        }

        return true;
    }

    onFormSave(e, btn) {
        const {
            form,
            item: {
                id,
                data: old_data,
            },
        } = this;

        const {idx} = btn.props;

        const onSubmit = (data, onProgress) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            if (!onProgress) {
                btn.text("Saving...").disabled();
                progressDialog.open();
            }
            return updateAuditItem({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                // onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();
                return true;
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        if (idx === 1) {
            if (!form.isValid('element')) {
                infoDialog.open('Element / Heading is required');
                return;
            }

            const {
                element,
                sub_element,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, old_data, element, 'element');
            ShouldUpdate.check(data, old_data, sub_element, 'sub_element');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            const {
                audit_findings,
                audit_summary,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, old_data, audit_findings, 'audit_findings');
            ShouldUpdate.check(data, old_data, audit_summary, 'audit_summary');

            onSubmit(data);
            return;
        }

        if (idx === 3) {
            const {
                possible_score,
                achieved_score,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, old_data, possible_score, 'possible_score');
            ShouldUpdate.check(data, old_data, achieved_score, 'achieved_score');

            onSubmit(data);
            return;
        }

        if (idx === 4) {
            const {
                target_date,
                due_date,
                responsible_person,
            } = form.data;

            const data = {};

            ShouldUpdate.checkDate(data, old_data, target_date, 'target_date');
            ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');
            ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person_id');

            onSubmit(data);
            return;
        }

        if (idx === 5) {
            const {
                comments,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, old_data, comments, 'comments');

            onSubmit(data);
            return;
        }

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, auditItem, savable} = this;

        if (!form.isValid('element')) {
            infoDialog.open('Element / Heading is required');
            return;
        }

        // if (!form.isValid('sub_element')) {
        // 	infoDialog.open('Sub-Element / Sub-Heading is required');
        // 	return;
        // }
        // if (!form.isValid('audit_summary')) {
        // 	infoDialog.open('Audit Summary is required');
        // 	return;
        // }
        // if (!form.isValid('achieved_score')) {
        // 	infoDialog.open('Achieved Score is required');
        // 	return;
        // }

        const {
            element, sub_element,
            responsible_person, target_date, due_date,
            audit_findings, audit_summary,
            possible_score, achieved_score,
            comments
        } = form.data;

        if (savable) {
            const data = {
                audit_id: auditItem.id,
                achieved_score,//
                audit_findings,//
                audit_summary,//
                comments,//
                compliance: this.state.compliance,//
                due_date: Dates.formatDateSQL(due_date),//
                element,//
                possible_score,//
                target_date: Dates.formatDateSQL(target_date),//
                responsible_person_id: responsible_person && responsible_person.id,//
                sub_element,//
            };

            console.log(data)

            progressDialog.open();
            insertAuditItem(data).then(res => {
                console.log("res", res)
                if (res) {
                    onSaved && onSaved(res.data);
                    infoDialog.open("Record successfully added.");
                    infoDialog.close(2000);
                    this.props.close();
                } else {
                    infoDialog.open("Record could not be added. Please try again later.");
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        } else {
            const data = {...form.data, compliance: this.state.compliance};

            console.log(data)

            onSaved(data);
            this.props.close();
        }

//        const {
//            audit_findings: audit_findings_ref,
//            audit_summary: audit_summary_ref,
//            possible_score: possible_score_ref,
//            achieved_score: achieved_score_ref,
//            comments: comments_ref
//        } = this.refs;
//        audit_findings_ref.reset();
//        audit_summary_ref.reset();
//        possible_score_ref.reset();
//        achieved_score_ref.reset();
//        comments_ref.reset();
    }

    render() {
        if (this.props.dialog.findById && !this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {onFormNext, onFormBack, onFormOpen, dialog} = this.props;
        const {item, savable, generalSavable} = this;

        let element = item && item.element || dialog.extraProp('element');
        let sub_element = item && item.sub_element || dialog.extraProp('sub_element');
        return (<FormControls>
            <Row
                active
                rendered
                idx={1}
                title="1. Element/Heading & Sub-Element/Sub-Heading"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={!generalSavable && this.onFormSave}
            >
                <SelectWrapper state={this.state} name="element" placeholder="Element / Heading..."
                               defaultValue={element}
                               className="col-lg-10 pull-left-1 form-control" onChange={this.form.onChange}
                               values="elements"/>
                <SelectWrapper state={this.state} name="sub_element" placeholder="Sub-Element / Sub-Heading..."
                               defaultValue={sub_element} className="col-lg-10 pull-left-1 form-control"
                               onChange={this.form.onChange} values="sub_elements"/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Audit Findings & Summary"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={!generalSavable && this.onFormSave}
            >
                <ClearableInput ref="audit_findings" name="audit_findings" type="textarea" placeholder="Audit Findings"
                                defaultValue={item && item.audit_findings} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="audit_summary" name="audit_summary" type="select" placeholder="Audit Summary"
                                defaultValue={item && item.audit_summary} required className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.audit_summary} returnValue/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Score & Compliance"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={!generalSavable && this.onFormSave}
            >
                <ClearableInput ref="possible_score" name="possible_score" type="number" placeholder="Possible Score"
                                defaultValue={item && item.possible_score || 5}
                                className="col-lg-6 margin-b-10 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="achieved_score" name="achieved_score" type="number" placeholder="Achieved Score"
                                min='0'
                                max={5} defaultValue={item && item.achieved_score} required
                                className="col-lg-6 margin-b-10 form-control" onChange={this.form.onChange}/>
                <hr/>
                <label className="hor-center">Compliance</label>
                <Compliance state={this.state}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Dates & Responsible Person"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={!generalSavable && this.onFormSave}
            >
                <ClearableInput name="target_date" type="date" placeholder="Target Date..."
                                className="col-lg-6 form-control"
                                defaultValue={item && item.target_date} onChange={this.form.onChange}/>
                <ClearableInput name="due_date" type="date" placeholder="Due Date..." className="col-lg-6 form-control"
                                defaultValue={item && item.due_date} onChange={this.form.onChange}/>
                <hr/>
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
                                     className="col-lg-12 form-control"
                                     defaultValue={item && item.responsible_person} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Comments / Root Cause"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={!generalSavable && this.onFormSave}
            >
                <ClearableInput ref="comments" name="comments" type="textarea" placeholder="Comments / Root Cause"
                                defaultValue={item && item.comments} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }
}

@observer
class Compliance extends React.Component {
    render() {
        const {onChange, state: {compliance}} = this.props;
        let color;
        if (isNumber(compliance)) {
            if (compliance < 25) {
                color = 'red';
            } else if (compliance < 50) {
                color = 'orange';
            } else if (compliance < 75) {
                color = 'yellow';
            } else if (compliance >= 75) {
                color = 'green';
            }
        } else {
            color = 'grey';
        }
        return <div key={Math.random()}
                    className={"Compliance w-80 h-80 hor-center " + color}>{isNumber(compliance) ? (compliance + '%') : 'N/A'}</div>;
    }
}

@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, className, onChange, defaultValue, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue} required
                               className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

export default NewAuditItemDialog;
