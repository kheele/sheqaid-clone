// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
// </editor-fold>

const calcCosts = (...args) => {
    return args.filter(v => !!v).map(v => v.cost || '0').map(v => parseFloat(v.replace('$', ''))).reduce((input, next) => input + next, 0);
};

const calcLengths = (...args) => {
    return args.filter(v => !!v).map(v => v.length).reduce((input, next) => input + next, 0);
};

// <editor-fold defaultstate="collapsed" desc="CauseAnalysisTable">
@observer
class CauseAnalysisTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {list} = this.props;
        this.state.list = list;
    }

    calcItemStats(item) {
        const {
            text,
            corrective_action_list_job_factors: job_factors = [],
            corrective_action_list_personal_factors: personal_factors = [],
            corrective_action_list_custom_job_factors: custom_job_factors = [],
            corrective_action_list_custom_personal_factors: custom_personal_factors = [],
        } = item;

        const total_cost = calcCosts(
            personal_factors,
            job_factors,
            custom_personal_factors,
            custom_job_factors,
        );

        const sum = calcLengths(
            personal_factors,
            job_factors,
            custom_personal_factors,
            custom_job_factors,
        );

        console.log('calcItemStats', item, total_cost)
        return {total_cost, sum};
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        const {text} = item;

        console.log('renderItem', item)
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td padding-l-0 padding-r-0">{text}</div>
            <div className="td fixed-flex min-w-0 padding-0"></div>
        </TRow>;
        ;
    }

    render() {
        const {title} = this.props;
        return (<Table className="CauseAnalysisTable w-full margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td padding-l-0 padding-r-0 font-size-12">{title}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CorrectiveActionListByCauseTable">
@observer
class CorrectiveActionListByCauseTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {list} = this.props;
        this.state.list = list;

        this.onEdit = this.onEdit.bind(this);
        this.renderReadonly = this.renderReadonly.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
    }

    onEdit(e, btn) {
        const {onAdded, group, title, onAddCorrectiveActionsToCause} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const cause = list[idx];
        onAddCorrectiveActionsToCause(cause).then(new_corrective_actions => {
            cause.corrective_actions = new_corrective_actions;
            list.removeIf((v, n) => n === idx);
            list.insertAt(idx, cause);
            onAdded && onAdded({group, sub_group: title, cause_name: cause.text, new_corrective_actions});
        });
    }

    calcItemStats(item) {
        const {
            text,
            corrective_action_list_job_factors: job_factors = [],
            corrective_action_list_personal_factors: personal_factors = [],
            corrective_action_list_custom_job_factors: custom_job_factors = [],
            corrective_action_list_custom_personal_factors: custom_personal_factors = [],
        } = item;

        const total_cost = calcCosts(
            personal_factors,
            job_factors,
            custom_personal_factors,
            custom_job_factors,
        );

        const sum = calcLengths(
            personal_factors,
            job_factors,
            custom_personal_factors,
            custom_job_factors,
        );

        console.log('calcItemStats', item, total_cost)
        return {total_cost, sum};
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        const {text} = item;

        const renderReadonly = () => {
            console.log('renderItem', item)
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td padding-l-0 padding-r-0">{text}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </TRow>;
        };

        const renderEditable = () => {
            const {total_cost, sum} = this.calcItemStats(item);
            console.log('renderItem', item)
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td"><span>{text}</span></div>
                <div className="td fixed-flex min-w-170"><span>{sum}</span></div>
                <div className="td fixed-flex min-w-80"><span>R {total_cost || '0.00'}</span></div>
                <div className="td fixed-flex min-w-100">
                    <Button idx={n} className="btn btn-primary pull-right w-80" onClick={this.onEdit}>
                        Add/Edit
                    </Button>
                </div>
            </TRow>;
        };

        return readonly ? renderReadonly() : renderEditable();
    }

    renderReadonly() {
        const {title} = this.props;
        return (<Table className="CorrectiveActionListByCauseTable w-full margin-0 padding-0 min-h-190">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td padding-l-0 padding-r-0 font-size-12">{title}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }

    renderEditable() {
        const {title} = this.props;
        const total_cost = this.state.list.map(item => this.calcItemStats(item).total_cost).reduce((v1, v2) => v1 + v2, 0);
        const sum = this.state.list.map(item => this.calcItemStats(item).sum).reduce((v1, v2) => v1 + v2, 0);
        return (<Table className="CorrectiveActionListByCauseTable w-full margin-0 padding-0 min-h-190">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td font-size-12">{title}</div>
                <div className="td fixed-flex min-w-170 font-size-12">No. Of Corrective Actions</div>
                <div className="td fixed-flex min-w-80 font-size-12">Sub-Total</div>
                <div className="td fixed-flex min-w-110 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            <div className="stats hor-center">
                <div className="flex">
                    <div className="grid-1 min-w-300">
                        <label className="w-full text-center">Corrective Actions Total No.</label>
                        <span className="hor-center">{sum}</span>
                    </div>
                    <div className="grid-1 min-w-300">
                        <label className="w-full text-center">Corrective Actions Total Cost</label>
                        <span className="hor-center">R {total_cost}</span>
                    </div>
                </div>
            </div>
        </Table>);
    }

    render() {
        const {readonly} = this.props;
        return readonly ? this.renderReadonly() : this.renderEditable();
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InvestigationFindingsTable">
@observer
class InvestigationFindingsTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        this.state.list = (defaultValue || []).map(v => {
            return v ? {text: v.text || v} : null;
        });

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item && item.text) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
                <div className="td"><span>{item.text}</span></div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text"
                                    placeholder="Type investigation finding here"
                                    required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10"
                            onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table className="col-lg-12 margin-0 padding-0 min-h-100">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td">Finding</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title="Investigation Finding" renderItem={this.renderItem} onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

// </editor-fold>

export {
    calcCosts, calcLengths,
    CauseAnalysisTable, CorrectiveActionListByCauseTable,
    InvestigationFindingsTable,
};
