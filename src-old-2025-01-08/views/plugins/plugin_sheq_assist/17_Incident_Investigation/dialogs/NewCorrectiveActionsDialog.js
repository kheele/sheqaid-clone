//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS, extendObservable} from 'mobx';

import Form from 'utils/Form';
import {Dates, ShouldUpdate} from 'utils/Utils';

import {Button, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {ATableSavable, SelectTable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewCorrectiveActionsDialog.lazy.css";
import insertIncidentCorrectiveAction
    from "mutations/all/Incident/IncidentCorrectiveAction/insertIncidentCorrectiveAction";
import updateIncidentCorrectiveAction
    from "mutations/all/Incident/IncidentCorrectiveAction/updateIncidentCorrectiveAction";
import findByIdIncidentCauseAnalysisCause
    from "mutations/all/Incident/IncidentCauseAnalysisCause/findByIdIncidentCauseAnalysisCause";
import {FormControls, Row} from "components/FormComponents";
//</editor-fold>

//<editor-fold desc="NewCorrectiveActionsDialog">
@observer
class NewCorrectiveActionsDialog extends ANewDialog {
    pageKey = "NewCorrectiveActionsDialog";
    title = "Add Corrective Actions";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    @computed get topButtons() {
        return <>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel"
                    onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="Controls">
@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {
        lists: {
            personal_factors: [
                'Instruct How To Follow Revised Work Standard',
                'Have Medically Examined',
                'Transfer To Another Job',
                'Attend SHE Committee Meeting',
                'Enforce/Warn',
                'Attend Specific Training (On The Job)',
                'Mentor'
            ].map(text => {
                return {text};
            }),
            job_factors: [
                'Write Work Standards (Specifications)',
                'Revise Work Standards (Specifications)',
                'Review Risk Assessment',
                'Guard/Provide Protection',
                'Repair',
                'Modify',
                'Lock out',
                'Housekeeping',
                'Provide Protection',
                'Discuss Incident During Toolbox Talk'
            ].map(text => {
                return {text};
            })
        }
    };
    //</editor-fold>

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.onClickPredefined = this.onClickPredefined.bind(this);
        this.onEditPredefined = this.onEditPredefined.bind(this);
        this.onEditCustom = this.onEditCustom.bind(this);
        this.onAddCustom = this.onAddCustom.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.form = new Form();
    }

    //</editor-fold>

    //<editor-fold desc="onClickPredefined">
    async onClickPredefined(list, selectedList, corrective_action, action, tbl) {
        const {type} = tbl.props;
        const checkedItem = selectedList.find(v => v.text === corrective_action.text);
        if (action === "add") {
            const {newCorrectiveActionsItemDialog} = this.refs;
            await newCorrectiveActionsItemDialog.extraProp('type', type).extraProp('corrective_action_desc', true).open(checkedItem || corrective_action).then(corrective_action_updated => {
                selectedList.push(corrective_action_updated);

                const idx = list.indexOf(checkedItem || corrective_action);
                list.removeIf(v => v.text === corrective_action.text);
                list.insertAt(idx, corrective_action_updated);
            });
        } else if (action === "delete") {
            selectedList.removeIf(v => v.text === corrective_action.text);
            const idx = list.indexOf(corrective_action);
            list.removeIf(v => v.text === corrective_action.text);
            const {text} = corrective_action;
            list.insertAt(idx, {text});
        }
        tbl.props.onChange && tbl.props.onChange(toJS(selectedList), tbl.props.name, tbl);
    }

    //</editor-fold>

    //<editor-fold desc="onEditPredefined">
    onEditPredefined(e, btn) {
        const {newCorrectiveActionsItemDialog} = this.refs;
        const {name, idx, item: corrective_action} = btn.props;
        const tbl = this.refs[name];
        const {list, state: {selectedList}} = tbl;
        const checkedItem = selectedList.find(v => v.text === corrective_action.text);
        return newCorrectiveActionsItemDialog.extraProp('type', true).extraProp('corrective_action_desc', true).open(checkedItem || corrective_action).then(corrective_action_updated => {
            setTimeout(() => {
                const idx2 = selectedList.indexOf(corrective_action);
                selectedList.removeIf(v => v.text === corrective_action.text);
                selectedList.insertAt(idx2, corrective_action_updated);

                list.removeIf(v => v.text === corrective_action.text);
                list.insertAt(idx, corrective_action_updated);

                tbl.props.onChange && tbl.props.onChange(toJS(selectedList), tbl.props.name, tbl);
            });
        });
    }

    //</editor-fold>

    //<editor-fold desc="onEditCustom">
    onEditCustom(corrective_action) {
        const {newCorrectiveActionsItemDialog} = this.refs;
        return newCorrectiveActionsItemDialog.open(corrective_action);
    }

    //</editor-fold>

    //<editor-fold desc="onAddCustom">
    onAddCustom(type) {
        const {newCorrectiveActionsItemDialog} = this.refs;
        return newCorrectiveActionsItemDialog.extraProp('type', type).open();
    }

    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead(props) {
        const {desc} = props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-20">#</div>
            <div className="td">{desc}</div>
            <div className="td fixed-flex min-w-200">Responsible Person</div>
            <div className="td fixed-flex min-w-110">Cost</div>
            <div className="td fixed-flex min-w-115">Due Date</div>
            <div className="td fixed-flex min-w-60"></div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(key) {
        return (item, n, onClick) => {
            const {state: {selectedList}} = this.refs[key];
            const name = key;
            return <ItemRow
                item={item}
                n={n}
                key={new Date().getTime()}
                name={name}
                type={key}
                selectedList={selectedList}
                onEditPredefined={this.onEditPredefined}
            />;
        };
    }

    //</editor-fold>

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('personal_factors') && !form.isValid('job_factors') &&
            !form.isValid('custom_personal_factors') && !form.isValid('custom_job_factors')) {
            infoDialog.open('Please add at least one Corrective Action');
            return;
        }

        const {
            personal_factors, job_factors,
            custom_personal_factors, custom_job_factors
        } = form.data;
        const data = {};

        if (personal_factors) {
            data.personal_factors = personal_factors;
        }
        if (job_factors) {
            data.job_factors = job_factors;
        }
        if (custom_personal_factors) {
            data.custom_personal_factors = custom_personal_factors;
        }
        if (custom_job_factors) {
            data.custom_job_factors = custom_job_factors;
        }

        console.log(data)

        onSaved && onSaved(data);
        infoDialog.open("Record successfully added.");
        infoDialog.close(1500);
        this.props.close();
    }

    //</editor-fold>

    get cause() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.cause)
            return null;
        let {
            props: {onFormOpen, onFormBack, onFormNext,},
            cause, cause: {
                text,
                corrective_action_list_personal_factors, corrective_action_list_job_factors,
                corrective_action_list_custom_personal_factors, corrective_action_list_custom_job_factors
            }
        } = this;

        let {personal_factors, job_factors} = this.state.lists;

        corrective_action_list_personal_factors = corrective_action_list_personal_factors || [];
        corrective_action_list_job_factors = corrective_action_list_job_factors || [];

        personal_factors = [
            ...corrective_action_list_personal_factors,
            ...personal_factors.filter(v => corrective_action_list_personal_factors.noneMatch(v1 => v1.text === v.text)),
        ];

        job_factors = [
            ...corrective_action_list_job_factors,
            ...job_factors.filter(v => corrective_action_list_job_factors.noneMatch(v1 => v1.text === v.text)),
        ];

        const total_cost_personal_factors = personal_factors.map(v => v.cost).filter(v => !!v).map(v => parseFloat(v.replace('$', '').replace(',', ''))).reduce((v1, v2) => v1 + v2, 0);
        const sum_personal_factors = personal_factors.filter(v => v.id).length;

        const total_job_factors = job_factors.map(v => v.cost).filter(v => !!v).map(v => parseFloat(v.replace('$', '').replace(',', ''))).reduce((v1, v2) => v1 + v2, 0);
        const sum_job_factors = job_factors.filter(v => v.id).length;

        console.log('cause', cause)
        return <FormControls>
            <Row
                rendered
                activeAlways
                className="row-title"
                idx={0}
                title="Incident Cause"
            >
                <p className="title"><label>Corrective Actions Of</label> {cause.text}</p>
            </Row>
            <Row
                rendered
                idx={1}
                title="1. Personal Factors"
                rowClassName="h-400"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectTable
                    ref="personal_factors"
                    name="personal_factors"
                    type="personal_factors"
                    desc="Personal Factors"
                    className="col-lg-12 h-350 margin-b-10 no-padding"
                    list={personal_factors}
                    replaceCols
                    renderItem={this.renderItem('personal_factors')}
                    renderTHead={this.renderTHead}
                    onClick={this.onClickPredefined}
                    isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                    onChange={this.form.onChange}
                >
                    <div className="stats hor-center">
                        <div className="flex">
                            <div>
                                <label className="">Corrective Actions Total No.</label>
                                <span>{sum_personal_factors}</span>
                            </div>
                            <div>
                                <label className="">Corrective Actions Total Cost</label>
                                <span>{total_cost_personal_factors && total_cost_personal_factors.toCurrency('R ') || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </SelectTable>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Job Factors"
                rowClassName="h-500"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTable
                    ref="job_factors"
                    name="job_factors"
                    type="job_factors"
                    desc="Job Factors"
                    className="col-lg-12 h-440 margin-b-10 no-padding"
                    list={job_factors}
                    replaceCols
                    renderItem={this.renderItem('job_factors')}
                    renderTHead={this.renderTHead}
                    onClick={this.onClickPredefined}
                    isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                    onChange={this.form.onChange}
                >
                    <div className="stats hor-center">
                        <div className="flex">
                            <div>
                                <label className="">Corrective Actions Total No.</label>
                                <span>{sum_job_factors}</span>
                            </div>
                            <div>
                                <label className="">Corrective Actions Total Cost</label>
                                <span>{total_job_factors && total_job_factors.toCurrency('R ') || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </SelectTable>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Custom Personal Factors"
                rowClassName="min-h-200"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <CustomCorrectiveActionTable
                    name="custom_personal_factors"
                    type="custom_personal_factors"
                    desc="Personal Factors"
                    className="col-lg-12 min-h-200 margin-b-10 no-padding"
                    defaultValue={corrective_action_list_custom_personal_factors}
                    onChange={this.form.onChange}
                    onEditCustom={this.onEditCustom}
                    onAddCustom={this.onAddCustom}
                />
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Custom Job Factors"
                rowClassName="min-h-200"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <CustomCorrectiveActionTable
                    name="custom_job_factors"
                    type="custom_job_factors"
                    desc="Job Factors"
                    className="col-lg-12 min-h-200 margin-b-10 no-padding"
                    defaultValue={corrective_action_list_custom_job_factors}
                    onChange={this.form.onChange}
                    onEditCustom={this.onEditCustom}
                    onAddCustom={this.onAddCustom}
                />
            </Row>
            <NewCorrectiveActionsItemDialog ref="newCorrectiveActionsItemDialog" cause={cause}/>
        </FormControls>;
    }

    //</editor-fold>
}

//</editor-fold>

//<editor-fold desc="ItemRow">
@observer
class ItemRow extends React.Component {

    @observable
    state = {};

    constructor(props) {
        super(props);
    }

    @computed get selectedList() {
        const {selectedList} = this.props;
        return selectedList;
    }

    render() {
        let {name, item, n, onEditPredefined} = this.props;
        const checkedItem = this.selectedList.find(v => v.text === item.text);
        const {text, responsible_person = {}, cost, date_completed} = checkedItem || item;
        const {id, full_name} = responsible_person || {};

        console.log('render', item)
        return <React.Fragment key={new Date().getTime()}>
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td"><span>{text}</span></div>
            <div className="td fixed-flex min-w-200"><span>{full_name}</span></div>
            <div className="td fixed-flex min-w-110">{cost && <span>{String(cost).replace('$', 'R ')}</span>}</div>
            <div className="td fixed-flex min-w-120"><span>{Dates.formatDate(date_completed)}</span></div>
            <div className="td fixed-flex min-w-60">
                {checkedItem && <Button name={name} item={item} idx={n} action="edit"
                                        className="btn btn-primary pull-right w-40 margin-l-10"
                                        onClick={onEditPredefined}>
                    <i className="fa fa-pen"/>
                </Button>}
            </div>
        </React.Fragment>;
    }
}

//</editor-fold>

//<editor-fold desc="NewCorrectiveActionsItemDialog">
@observer
class NewCorrectiveActionsItemDialog extends ANewDialog {
    pageKey = "NewCorrectiveActionsItemDialog";
    title = "Add Corrective Action";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls2;
    }

    @computed get topButtons() {
        return <>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel"
                    onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="Controls2">
@observer
class Controls2 extends React.Component {

    @observable
    state = {};

    constructor() {
        super();

        this.form = new Form();
    }

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item, item: old_data, cause} = this;
        if (!form.isValid('text')) {
            infoDialog.open('Corrective Action is required');
            return;
        }

        const {
            text, responsible_person, date_completed, cost
        } = form.data;

        if (item.id) {
            const data = {};

            ShouldUpdate.check(data, old_data, text, 'text');
            ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');
            ShouldUpdate.checkDate(data, old_data, date_completed, 'date_completed');
            ShouldUpdate.check(data, old_data, cost, 'cost');

            if (Object.values(data).isEmpty()) {
                infoDialog.open("No changes available");
                return;
            }

            progressDialog.open();
            updateIncidentCorrectiveAction({id: item.id, ...data}).then(async res => {
                if (!res) {
                    infoDialog.open("Record couldn't be updated. Please try again.");
                    return;
                }

                const updatedCause = await findByIdIncidentCauseAnalysisCause(cause.id);
                if (updatedCause) {
                    extendObservable(cause, updatedCause.data);
                }

                onSaved && onSaved(res.data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(1500);
                this.props.close();
            }).catch(err => {
                console.error(err);
                infoDialog.open("An error occurred. Please try again.");
            }).finally(() => {
                setTimeout(() => progressDialog.close());
            });
        } else {
            const data = {
                cause_analysis_cause_id: cause.id,
                text,
                responsible_person_id: responsible_person && responsible_person.id,
                cost: cost && parseFloat(cost),
                date_completed: Dates.formatDateSQL(date_completed),
                type: this.correctiveActionType,
            };

            console.log(data)

            progressDialog.open();
            insertIncidentCorrectiveAction(data).then(async res => {
                if (!res) {
                    infoDialog.open("Record couldn't be added. Please try again.");
                    return;
                }

                const updatedCause = await findByIdIncidentCauseAnalysisCause(cause.id);
                if (updatedCause) {
                    extendObservable(cause, updatedCause.data);
                }

                onSaved && onSaved(res.data);
                infoDialog.open("Record successfully added.");
                infoDialog.close(1500);
                this.props.close();
            }).catch(err => {
                console.error(err);
                infoDialog.open("An error occurred. Please try again.");
            }).finally(() => {
                setTimeout(() => progressDialog.close());
            });
        }
    }

    //</editor-fold>

    get correctiveActionType() {
        return this.dialog.extraProp('type');
    }

    get cause() {
        return this.props.dialog.props.cause;
    }

    get item() {
        return this.props.state.item || {};
    }

    render() {
        if (!this.item) return null;

        let {
            props: {onFormOpen,},
            item, item: {
                text, responsible_person, date_completed, cost
            },
            cause,
        } = this;

        const corrective_action_desc = this.props.dialog.extraProp('corrective_action_desc');
        if (cost) {
            cost = parseFloat(String(cost).replace('$', ''));
        }

//        console.log('item', item)
        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={0}
                className="row-title"
                title="Incident Cause"
                onFormOpen={onFormOpen}
            >
                <p className="title"><label>Corrective Actions Of</label> {cause.text}</p>
            </Row>
            <Row
                rendered
                activeAlways
                idx={1}
                title="Corrective Action"
                onFormOpen={onFormOpen}
            >
                <ClearableInput name="text" type="text" placeholder="Corrective Action" required
                                defaultValue={text} isEditable={!corrective_action_desc}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
                                     defaultValue={responsible_person} className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
                <ClearableInput name="date_completed" type="date" placeholder="Due Date..." required
                                defaultValue={date_completed} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="cost" type="number" placeholder="Cost" required defaultValue={cost}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

//</editor-fold>

//<editor-fold desc="CustomCorrectiveActionTable">
@observer
class CustomCorrectiveActionTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        this.state.list = defaultValue || [];

        // this.state.list = (defaultValue || []).map(v => {
        //     return v ? {text: v.text || v} : null;
        // });

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.onEdit = this.onEdit.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    onEdit(e, btn) {
        const {onEditCustom, onChange, name, type} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const corrective_action = list[idx];
        onEditCustom(corrective_action, type).then(corrective_action_updated => {
            //text, responsible_person, date_completed, cost
            setTimeout(() => {
                list.removeIf((corrective_action, _idx) => _idx === idx);
                list.insertAt(idx, corrective_action_updated);
                onChange && onChange(toJS(list.filter(v => !!v)), name, this);
            });
        });
    }

    onAdd(e, btn) {
        const {onAddCustom, onChange, name, type} = this.props;
        onAddCustom(type).then(corrective_action => {
            //text, responsible_person, date_completed, cost
            this.state.list.push(corrective_action);
            onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);
        });
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {text, responsible_person, cost, date_completed} = item;
        const {id, full_name} = responsible_person || {};
        return <TRow key={"item-" + n} className="tr-readonly w-full">
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td"><span>{text}</span></div>
            <div className="td fixed-flex min-w-200"><span>{full_name}</span></div>
            <div className="td fixed-flex min-w-110"><span>{String(cost).replace('$', 'R ')}</span></div>
            <div className="td fixed-flex min-w-120"><span>{Dates.formatDate(date_completed)}</span></div>
            <div className="td fixed-flex min-w-130">
                <Button idx={n} action="edit" className="btn btn-primary pull-right w-40 margin-l-10"
                        onClick={this.onEdit}>
                    <i className="fa fa-pen"/>
                </Button>
                <Button idx={n} action="delete" className="btn btn-primary pull-right margin-l-10 w-40"
                        onClick={onClick}>
                    <i className="fa fa-times-circle"/>
                </Button>
            </div>
        </TRow>;
    }

    render() {
        const {desc} = this.props;
        const {list} = this.state;

        console.log('this.state.list', list)
        const total_cost = list.map(v => v.cost).filter(v => !!v).map(v => parseFloat(v.replace('$', '').replace(',', ''))).reduce((v1, v2) => v1 + v2, 0);
        const sum = list.length;

        return (<Table className="CustomCorrectiveActionTable col-lg-12 margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td">Custom {desc}</div>
                <div className="td fixed-flex min-w-200">Responsible Person</div>
                <div className="td fixed-flex min-w-110">Cost</div>
                <div className="td fixed-flex min-w-115">Due Date</div>
                <div className="td fixed-flex min-w-130 padding-0"></div>
            </THead>
            <TBody ref="body" title={"Custom " + desc} renderItem={this.renderItem} onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            <div className="stats hor-center">
                <Button className="btn btn-primary hor-center" text="Add Corrective Action" list={this.state.list}
                        onClick={this.onAdd}/>
                <div className="flex">
                    <div>
                        <label className="">Corrective Actions Total No.</label>
                        <span>{sum}</span>
                    </div>
                    <div>
                        <label className="">Corrective Actions Total Cost</label>
                        <span>{total_cost && total_cost.toCurrency('R ') || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </Table>);
    }
}

//</editor-fold>

export default NewCorrectiveActionsDialog;
