// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {toJS, extendObservable} from 'mobx';

import {Button, ClearableInput, UploadButton} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import insertInvestigationDocument
    from "mutations/all/Incident/InvestigationDocument/insertInvestigationDocument";
import updateInvestigationDocument
    from "mutations/all/Incident/InvestigationDocument/updateInvestigationDocument";
import updateInvestigationFinding
    from "mutations/all/Incident/InvestigationFinding/updateInvestigationFinding";
import insertInvestigationFinding
    from "mutations/all/Incident/InvestigationFinding/insertInvestigationFinding";
// </editor-fold>

const calcCosts = (...args) => {
    return args.filter(v => !!v).map(v => v.cost || '0').map(v => parseFloat(v.replace('$', '').replace(',', ''))).reduce((input, next) => input + next, 0);
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
        const {title, readonly} = this.props;
        return (<Table className="CauseAnalysisTable w-full margin-0 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td padding-l-0 padding-r-0 font-size-12">{title}</div>
                <div className="td fixed-flex min-w-0 padding-0"></div>
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={!readonly && this.onClick}
                   state={this.state}
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

        const {total_cost, sum} = this.calcItemStats(item);
        console.log('renderItem', item)

        return <TRow key={"item-" + n} className="tr-readonly w-full">
            <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
            <div className="td"><span>{text}</span></div>
            <div className="td fixed-flex min-w-170"><span>{sum}</span></div>
            <div className="td fixed-flex min-w-80"><span>R {total_cost || '0.00'}</span></div>
            {!readonly && <div className="td fixed-flex min-w-100">
                <Button idx={n} className="btn btn-primary pull-right w-80" onClick={this.onEdit}>
                    Add/Edit
                </Button>
            </div>}
            {readonly && <div className="td fixed-flex min-w-0"/>}
        </TRow>;
    }

    render() {
        const {title, readonly} = this.props;
        const total_cost = this.state.list.map(item => this.calcItemStats(item).total_cost).reduce((v1, v2) => v1 + v2, 0);
        const sum = this.state.list.map(item => this.calcItemStats(item).sum).reduce((v1, v2) => v1 + v2, 0);
        return (<Table className="CorrectiveActionListByCauseTable padding-0 min-h-190">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20 font-size-12">#</div>
                <div className="td font-size-12">{title}</div>
                <div className="td fixed-flex min-w-170 font-size-12">No. Of Corrective Actions</div>
                <div className="td fixed-flex min-w-80 font-size-12">Sub-Total</div>
                {!readonly && <div className="td fixed-flex min-w-110 padding-0"></div>}
                {readonly && <div className="td fixed-flex min-w-0"/>}
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} onClick={!readonly && this.onClick}
                   state={this.state}
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
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InvestigationFindingsTable">
@observer
class InvestigationFindingsTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        this.state.list = (defaultValue || []);

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
    }

    onClickComplete(e, el) {
        let {savable, item: investigationItem, onUpdated} = this.props;

        if (savable && investigationItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {investigation_findings_list}
            } = investigationItem;

            const {id, desc} = item;

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (item.id) {
                    promise = updateInvestigationFinding({
                        id,
                        desc,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be updated.");
                        } else {
                            infoDialog.open("Record successfully updated.");

                            extendObservable(item, savedItem.data);
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertInvestigationFinding({
                        investigation_id: investigationItem.id,
                        desc,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            if (!savedItem) {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            } else {
                                investigation_findings_list = investigation_findings_list || [];
                                investigation_findings_list.push(savedItem.data);

                                infoDialog.open("Record successfully added.");

                                extendObservable(old_data, {investigation_findings_list});
                            }
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    updateInvestigationFinding({
                        id,
                        removed: true,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            investigation_findings_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
        }
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item && item.desc) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
                <div className="td"><span>{item.desc}</span></div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full grid-1 grid-gap-10 padding-t-10 padding-b-10">
                <ClearableInput
                    ref={this.onSetRef}
                    name="desc"
                    type="textarea"
                    placeholder="Type investigation finding here"
                    required className="form-control col-lg-12 w-full margin-t-10"
                    onChange={this.onChange}
                />

                <Button
                    idx={n}
                    action="save"
                    className="btn btn-primary hor-center w-100  border-radius-20"
                    onClick={onClick}
                >
                    <i className="fa fa-check"/> Add
                </Button>
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
            <TBody
                ref="body"
                title="Investigation Finding"
                renderItem={this.renderItem}
                onClick={this.onClick}
                state={this.state}
                onLoadList={this.onLoadList}
                disablePullToRefresh={false}
            />
        </Table>);
    }
}

// </editor-fold>

//<editor-fold desc="NewDocumentTable">
@observer
class NewDocumentTable extends ATableSavable {

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        if (defaultValue) {
            this.state.list = toJS(defaultValue);
        }

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
    }

    onClickComplete(e, el) {
        let {savable, item: investigationItem, onUpdated} = this.props;

        if (savable && investigationItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {document_list}
            } = investigationItem;

            const {id, doc} = item;

            alert(action)

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (item.id) {
                    promise = updateInvestigationDocument({
                        id,
                        doc,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be updated.");
                        } else {
                            infoDialog.open("Record successfully updated.");

                            extendObservable(item, savedItem.data);
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertInvestigationDocument({
                        investigation_id: investigationItem.id,
                        doc,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            if (!savedItem) {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            } else {
                                document_list = document_list || [];
                                document_list.push(savedItem.data);

                                infoDialog.open("Record successfully added.");

                                extendObservable(old_data, {document_list});
                            }
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    updateInvestigationDocument({
                        id,
                        removed: true,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            document_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
        }
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {doc} = item;
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td">
                    <UploadButton
                        name="doc"
                        buttonTitle="Upload Document"
                        type={['PDF', 'Word']}
                        defaultValue={doc}
                        showOnlyIcon
                        readonly={readonly}
                        className="col-lg-12"
                        onChange={this.onChange}
                    />
                </div>
                {!readonly ? <div className="td fixed-flex min-w-50 padding-l-0">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div> : null}
                {readonly ? <div className="td fixed-flex min-w-0 padding-0"/> : null}
            </TRow>;
        } else {
            // alert(this.list.length)
            return <TRow key="item-new" className="w-full grid-1 grid-gap-10 padding-t-10 padding-b-10">
                <UploadButton
                    ref={this.onSetRef}
                    name="doc"
                    buttonTitle="Upload Document"
                    type={['PDF', 'Word']}
                    showOnlyIcon
                    className="col-lg-12 w-full margin-t-10"
                    onChange={this.onChange}
                />
                <Button
                    idx={n}
                    action="save"
                    className="btn btn-primary hor-center w-100  border-radius-20"
                    onClick={onClick}
                >
                    <i className="fa fa-check"/> Add
                </Button>
            </TRow>;
        }
    }

    render() {
        const {readonly} = this.props;
        return (<Table
            className="NewDocumentTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td fixed-flex min-w-160 font-size-14">Document</div>
                <div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
            </THead>
            <TBody
                ref="body"
                title="Incident Investigation Documents"
                renderItem={this.renderItem}
                onClick={this.onClick}
                state={this.state}
                onLoadList={this.onLoadList}
                disablePullToRefresh={false}
            />
        </Table>);
    }
}

//</editor-fold>

export {
    calcCosts, calcLengths,
    CauseAnalysisTable, CorrectiveActionListByCauseTable,
    InvestigationFindingsTable,
    NewDocumentTable,
};
