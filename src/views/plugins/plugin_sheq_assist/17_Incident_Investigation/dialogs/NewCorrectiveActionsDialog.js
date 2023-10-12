//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';

import {Button, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {ATableSavable, SelectTable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewCorrectiveActionsDialog.lazy.css";
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
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel"
                    onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }
}

//</editor-fold>

//<editor-fold desc="Controls">
@observer
class Controls extends React.Component {

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

    constructor() {
        super();

        this.onClickPredefined = this.onClickPredefined.bind(this);
        this.onEditPredefined = this.onEditPredefined.bind(this);
        this.onEditCustom = this.onEditCustom.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.form = new Form();
    }

    async onClickPredefined(list, selectedList, corrective_action, action, tbl) {
        const checkedItem = selectedList.find(v => v.text === corrective_action.text);
        if (action === "add") {
            const {newCorrectiveActionsItemDialog} = this.refs;
            await newCorrectiveActionsItemDialog.extraProp('corrective_action_desc', true).open(checkedItem || corrective_action).then(corrective_action_updated => {
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

    onEditPredefined(e, btn) {
        const {newCorrectiveActionsItemDialog} = this.refs;
        const {name, idx, item: corrective_action} = btn.props;
        const tbl = this.refs[name];
        const {list, state: {selectedList}} = tbl;
        const checkedItem = selectedList.find(v => v.text === corrective_action.text);
        return newCorrectiveActionsItemDialog.extraProp('corrective_action_desc', true).open(checkedItem || corrective_action).then(corrective_action_updated => {
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

    onEditCustom(corrective_action) {
        const {newCorrectiveActionsItemDialog} = this.refs;
        return newCorrectiveActionsItemDialog.open(corrective_action);
    }

    onAdd() {
        const {newCorrectiveActionsItemDialog} = this.refs;
        return newCorrectiveActionsItemDialog.open();
    }

    renderTHead(props) {
        const {desc} = props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-20">#</div>
            <div className="td">{desc}</div>
            <div className="td fixed-flex min-w-185">Responsible Person</div>
            <div className="td fixed-flex min-w-85">Cost</div>
            <div className="td fixed-flex min-w-85">Due Date</div>
            <div className="td fixed-flex min-w-60"></div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(key) {
        return (item, n, onClick) => {
            const {state: {selectedList}} = this.refs[key];
            const name = key;
            return <ItemRow item={item} n={n} key={new Date().getTime()} name={name} selectedList={selectedList}
                            onEditPredefined={this.onEditPredefined}/>;
        };
    }

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

    get cause() {
        return this.props.state.item;
    }

    render() {
        if (!this.cause)
            return null;
        let {
            cause, cause: {
                text, corrective_actions = {}
            }
        } = this;
        const {
            personal_factors: default_personal_factors = [],
            job_factors: default_job_factors = [],
            custom_personal_factors: default_custom_personal_factors = [],
            custom_job_factors: default_custom_job_factors = []
        } = corrective_actions;
        const {personal_factors, job_factors} = this.state.lists;

        console.log('cause', cause)
        return (<div className="NewCorrectiveActionsDialog controls-wrapper">
            <div className="controls">
                <div className="row row-title">
                    <div className="row sec-group">
                        <p className="title"><label>Corrective Actions Of</label> {cause.text}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <SelectTable
                            ref="personal_factors"
                            name="personal_factors"
                            desc="Personal Factors"
                            className="col-lg-12 margin-b-10 no-padding"
                            list={personal_factors}
                            defaultValue={default_personal_factors}
                            replaceCols
                            renderItem={this.renderItem('personal_factors')}
                            renderTHead={this.renderTHead}
                            onClick={this.onClickPredefined}
                            isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                            onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <SelectTable
                            ref="job_factors"
                            name="job_factors"
                            desc="Job Factors"
                            className="col-lg-12 margin-b-10 no-padding"
                            list={job_factors}
                            defaultValue={default_job_factors}
                            replaceCols
                            renderItem={this.renderItem('job_factors')}
                            renderTHead={this.renderTHead}
                            onClick={this.onClickPredefined}
                            isChecked={(item, selectedList) => selectedList.anyMatch(v => v.text === item.text)}
                            onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <CustomCorrectiveActionTable
                            name="custom_personal_factors"
                            desc="Personal Factors"
                            className="col-lg-12 margin-b-10 no-padding"
                            defaultValue={default_custom_personal_factors}
                            onChange={this.form.onChange}
                            onEdit={this.onEditCustom}
                            onAdd={this.onAdd}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <CustomCorrectiveActionTable
                            name="custom_job_factors"
                            desc="Job Factors"
                            className="col-lg-12 margin-b-10 no-padding"
                            defaultValue={default_custom_job_factors}
                            onChange={this.form.onChange}
                            onEdit={this.onEditCustom}
                            onAdd={this.onAdd}/>
                    </div>
                </div>
            </div>
            <NewCorrectiveActionsItemDialog ref="newCorrectiveActionsItemDialog"/>
        </div>);
    }
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
        let {id, data, fname, lname} = responsible_person;

        if (data) {
            fname = data.fname;
            lname = data.lname;
        }

        console.log('render', item)
        return <React.Fragment key={new Date().getTime()}>
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td"><span>{text}</span></div>
            <div className="td fixed-flex min-w-185"><span>{lname && (lname + ' ' + fname)}</span></div>
            <div className="td fixed-flex min-w-85">{isNumber(cost) && <span>R {cost}</span>}</div>
            <div className="td fixed-flex min-w-85"><span>{Dates.formatDate(date_completed)}</span></div>
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
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel"
                    onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
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

    onSubmit(e, btn, onSaved) {
        const {form} = this;
        if (!form.isValid('text')) {
            infoDialog.open('Corrective Action is required');
            return;
        }

        const {
            text, responsible_person, date_completed, cost
        } = form.data;
        const data = {};

        if (text) {
            data.text = text;
        }
        if (responsible_person) {
            data.responsible_person = responsible_person;
        }
        if (date_completed) {
            data.date_completed = date_completed;
        }
        if (cost) {
            data.cost = parseFloat(cost);
        }

        console.log(data)

        onSaved && onSaved(data);
        infoDialog.open("Record successfully added.");
        infoDialog.close(1500);
        this.props.close();
    }

    get item() {
        return this.props.state.item || {};
    }

    render() {
        let {
            item, item: {
                text, responsible_person, date_completed, cost
            }
        } = this;
        let responsible_personDefault = null;
        if (responsible_person) {
            const {id, data: {fname, lname}} = responsible_person;
            responsible_personDefault = {label: lname + ' ' + fname, value: responsible_person};
        }

        const corrective_action_desc = this.props.dialog.extraProp('corrective_action_desc');

//        console.log('item', item)
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="text" type="text" placeholder="Corrective Action" required
                                        defaultValue={text} isEditable={!corrective_action_desc}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
                                             defaultValue={responsible_personDefault} className="col-lg-12 form-control"
                                             onChange={this.form.onChange}/>
                        <ClearableInput name="date_completed" type="date" placeholder="Due Date..." required
                                        defaultValue={date_completed} className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                        <ClearableInput name="cost" type="number" placeholder="Cost" required defaultValue={cost}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

//</editor-fold>

//<editor-fold desc="CustomCorrectiveActionTable">
@observer
class CustomCorrectiveActionTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        this.state.list = (defaultValue || []).map(v => {
            return v ? {text: v.text || v} : null;
        });

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.onEdit = this.onEdit.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    onEdit(e, btn) {
        const {onEdit, onChange, name} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const corrective_action = list[idx];
        onEdit(corrective_action).then(corrective_action_updated => {
            //text, responsible_person, date_completed, cost
            setTimeout(() => {
                list.removeIf((corrective_action, _idx) => _idx === idx);
                list.insertAt(idx, corrective_action_updated);
                onChange && onChange(toJS(list.filter(v => !!v)), name, this);
            });
        });
    }

    onAdd(e, btn) {
        const {onAdd, onChange, name} = this.props;
        onAdd().then(corrective_action => {
            //text, responsible_person, date_completed, cost
            this.state.list.push(corrective_action);
            onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);
        });
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {text, responsible_person, cost, date_completed} = item;
        const {id, data: {fname, lname}} = responsible_person;
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td"><span>{text}</span></div>
            <div className="td fixed-flex min-w-185"><span>{lname + ' ' + fname}</span></div>
            <div className="td fixed-flex min-w-85"><span>R {cost || 0}</span></div>
            <div className="td fixed-flex min-w-85"><span>{Dates.formatDate(date_completed)}</span></div>
            <div className="td fixed-flex min-w-130">
                <Button idx={n} action="edit" className="btn btn-primary pull-right w-40 margin-l-10"
                        onClick={this.onEdit}>
                    <i className="fa fa-pen"/>
                </Button>
                <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                    <i className="fa fa-times-circle"/>
                </Button>
            </div>
        </TRow>;
    }

    render() {
        const {desc} = this.props;
        const {list} = this.state;
        console.log('this.state.list', list)
        const total_cost = list.map(v => v.cost).reduce((v1, v2) => v1 + v2, 0);
        const sum = list.length;
        return (<Table className="CustomCorrectiveActionTable col-lg-12 margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td">Custom {desc}</div>
                <div className="td fixed-flex min-w-185">Responsible Person</div>
                <div className="td fixed-flex min-w-85">Cost</div>
                <div className="td fixed-flex min-w-85">Due Date</div>
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
                        <span>R {total_cost}</span>
                    </div>
                </div>
            </div>
        </Table>);
    }
}

//</editor-fold>

export default NewCorrectiveActionsDialog;
