import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';
import {Button, ClearableInput, Clickable, SelectClientInput} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';
import {NewEmployeeListTable} from '../../../../../components/FormTableComponents';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import {ANewDialog} from '../../../../../components/dialogs';

import AuditItemTable from './AuditItemTable';

import style from "./NewAuditDialog.lazy.css";

@observer
class NewAuditDialog extends ANewDialog {
    pageKey = "NewAuditDialog";
    title = "Create Audit";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/21_Internal_Audit/audit/";

    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
        
        this.form = new Form();
    }
    
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        const {isConsultant} = storage.is;
        if(idx === 1) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            if (!form.isValid('date')) {
                infoDialog.open('Audit Date is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('representative_list')) {
                infoDialog.open('Company Representative(s) is required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('auditor_list')) {
                infoDialog.open('Auditor(s) is required');
                return;
            }
        }
        
        return true;
    }

    onFormChange(idx) {
        const {list} = this.refs;
        if(idx === 5 && list) {
            list.refresh();
        }
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Audit Date is required');
            return;
        }
        
        if (!form.isValid('representative_list') || form.get('representative_list').isEmpty()) {
            infoDialog.open('Company Representative(s) is/are required');
            return;
        }
        if (!form.isValid('auditor_list') || form.get('auditor_list').isEmpty()) {
            infoDialog.open('Auditor(s) is/are required');
            return;
        }
        
        if (!form.isValid('list') || form.get('list').isEmpty()) {
            infoDialog.open('Findings are required');
            return;
        }

        const {
            client, scope, date, type, 
            representative_list,
            auditor_list,
            definition_list, list
        } = form.data;
        const data = {
            client: {id: client.id, name: client.data.name}, date: date.getTime()
        }; 
        const mapPersonDetails = (v) => {
            const {other_person, employee} = v;
            if(other_person) {
                return toJS(other_person);
            } else if(employee) {
                const {id, data, fname, lname} = employee;
                return {id, fname: fname || data.fname, lname: lname || data.lname};
            } else {
                return toJS(v);
            }
        };
        data.representative_list = toJS(representative_list.map(mapPersonDetails));
        data.auditor_list = toJS(auditor_list.map(mapPersonDetails));
        data.list = toJS(list.map(v => toJS(v)));
        
        if(scope) {
            data.scope = scope;
        }
        if(type) {
            data.type = type;
        }
        if(definition_list) {
            data.definition_list = toJS(definition_list.map(v => toJS(v)));
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    get item() {
        return this.props.state.item;
    }
    
    render() {
        const {item} = this;
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        let _client, _scope, _date, _type, _representative_list, _auditor_list, _definition_list, _list;
        if(item) {
            const {client, scope, date, type, representative_list, auditor_list, definition_list, list} = item.data;
            _client = client;
            _scope = scope;
            _date = date;
            _type = type;
            _representative_list = representative_list;
            _auditor_list = auditor_list;
            _definition_list = definition_list;
            _list = list;
        }
        
        const {isConsultant} = storage.is;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. General Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">  
                        <div className="flex"> 
                            <div className="margin-t-10 margin-r-20">
                                {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={_client} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>}
                                <ClearableInput name="scope" type="text" placeholder="Scope Of Audit" defaultValue={_scope} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                            </div>
                            <div className="margin-t-10 margin-l-20">
                                <ClearableInput name="date" type="date" placeholder="Audit Date..." defaultValue={_date || new Date()} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <ClearableInput name="type" type="text" placeholder="Audit Type" defaultValue={_type} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                            </div>
                        </div>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-representatives">
                    <label>
                        2. Company Representative(s)
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="representative_list" defaultValue={_representative_list ? [..._representative_list, null] : [null]} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-auditors">
                    <label>
                        3. Auditor(s)
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="auditor_list" defaultValue={_auditor_list ? [..._auditor_list, null] : [null]} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-definitions">
                    <label>
                        4. Definitions
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <DefinitionsTable name="definition_list" defaultValue={_definition_list ? [..._definition_list, null] : [null]} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-table">
                    <label>
                        5. Findings
                        <Clickable idx={5} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group row-findings">
                        <AuditItemTable ref="list" name="list" defaultValue={_list} isNew={!item} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={5} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class DefinitionsTable extends ATableSavable {

    @observable
    selfState = {
    };

    constructor(props) {
        super(props);
        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-300">{item.title}</div>
                <div className="td">{item.desc}</div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td fixed-flex min-w-300">
                    <ClearableInput ref={this.onSetRef} name="title" type="text" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="desc" type="text" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex w-70">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table className="DefinitionsTable">
            <THead className="align-left">
                <div className="td fixed-flex min-w-300">Title</div>
                <div className="td">Description</div>
		<div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Definitions" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewAuditDialog;
