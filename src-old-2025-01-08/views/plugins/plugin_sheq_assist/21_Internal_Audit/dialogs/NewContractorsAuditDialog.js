// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, Clickable} from 'components/inputs';
import {NavButtons, RowSecGroup} from 'components/FormComponents';
import {ATableSavable, Table, TBody, THead} from 'components/tables';
import {ANewDialog} from 'components/dialogs';

import {
    NewAdminTableData,
    NewAppointmentLettersTableData,
    NewRegistersTableData,
    NewSiteConditionsTableData
} from './NewContractorsAuditDialogData';
import {QuestionRegulationGroupRow} from './ContractorsAuditComponents';

import style from "./NewContractorsAuditDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewContractorsAuditDialog extends ANewDialog {
    pageKey = "NewContractorsAuditDialog";
    title = "Create Contractors Audit";
//    className = 'ANewTableFormDialog';

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
    path = "plugin_sheq_assist/21_Internal_Audit/construction-audits/";
    
    @observable state = {
        list_admin: [...NewAdminTableData()],
        list_registers: [...NewRegistersTableData()],
        list_appointment_letters: [...NewAppointmentLettersTableData()],
        list_site_conditions: [...NewSiteConditionsTableData()],
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onFormChange = this.onFormChange.bind(this);
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {execWhen} = this.props;
        const {
            administration_sec, registers_sec, appointment_letters_sec, site_conditions_sec,
            list_site_conditions: list_site_conditions_ref
        } = this.refs;
        
        const {list_admin, list_registers, list_appointment_letters, list_site_conditions} = this.state;
        const {data} = this.form;
        
        if(idx === 2) {
            execWhen(() => this.refs.list_admin).then(list_admin_ref => {
                list_admin_ref.setList(data.list_admin || list_admin);
            });
            administration_sec.show();
            registers_sec.hide();
            appointment_letters_sec.hide();
            site_conditions_sec.hide();
        }
        if(idx === 3) {
            execWhen(() => this.refs.list_registers).then(list_registers_ref => {
                list_registers_ref.setList(data.list_registers || list_registers);
            });
            registers_sec.show();
            administration_sec.hide();
            appointment_letters_sec.hide();
            site_conditions_sec.hide();
        }
        if(idx === 4) {
            execWhen(() => this.refs.list_appointment_letters).then(list_appointment_letters_ref => {
                list_appointment_letters_ref.setList(data.list_appointment_letters || list_appointment_letters);
            });
            appointment_letters_sec.show();
            administration_sec.hide();
            registers_sec.hide();
            site_conditions_sec.hide();
        }
        if(idx === 5) {
            execWhen(() => this.refs.list_site_conditions).then(list_site_conditions_ref => {
                list_site_conditions_ref.setList(data.list_site_conditions || list_site_conditions);
            });
            site_conditions_sec.show();
            administration_sec.hide();
            registers_sec.hide();
            appointment_letters_sec.hide();
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('date')) {
                infoDialog.open('Audit Date is required');
                return;
            }
            if (!form.isValid('auditor')) {
                infoDialog.open('Auditor is required');
                return;
            }
            if (!form.isValid('contractor')) {
                infoDialog.open('Contractor Name is required');
                return;
            }
            if (!form.isValid('contract_num')) {
                infoDialog.open('Contract Number is required');
                return;
            }
            if (!form.isValid('site_name')) {
                infoDialog.open('Site Name is required');
                return;
            }
            if (!form.isValid('contact_person')) {
                infoDialog.open('Contact Person is required');
                return;
            }
            if (!form.isValid('contact_phone')) {
                infoDialog.open('Contact Phone No. is required');
                return;
            }
            if (!form.isValid('contact_email')) {
                infoDialog.open('Contact Email Address is required');
                return;
            }
        }
//        if(idx === 3) {
//            if (!form.isValid('type')) {
//                infoDialog.open('Incident Type is required');
//                return;
//            }
//        }
//        if(idx === 5) {
//            if (!form.isValid('person_involved_list') || form.get('person_involved_list').isEmpty()) {
//                infoDialog.open('Person(s) Involved in the Incident are/is required');
//                return;
//            }
//        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('date')) {
            infoDialog.open('Audit Date is required');
            return;
        }
        if (!form.isValid('auditor')) {
            infoDialog.open('Auditor is required');
            return;
        }
        if (!form.isValid('contractor')) {
            infoDialog.open('Contractor Name is required');
            return;
        }
        if (!form.isValid('contract_num')) {
            infoDialog.open('Contract Number is required');
            return;
        }
        if (!form.isValid('site_name')) {
            infoDialog.open('Site Name is required');
            return;
        }
        if (!form.isValid('contact_person')) {
            infoDialog.open('Contact Person is required');
            return;
        }
        if (!form.isValid('contact_phone')) {
            infoDialog.open('Contact Phone No. is required');
            return;
        }
        if (!form.isValid('contact_email')) {
            infoDialog.open('Contact Email Address is required');
            return;
        }
         
//        if (!form.isValid('list_admin') || form.get('list_admin').isEmpty()) {
//            infoDialog.open('Non-Conformance And Corrective Actions are required');
//            return;
//        }
//        for (var n = 1; n <= form.get('list_admin').length; n++) {
//            const item = form.get('list_admin')[n - 1];
//            console.log(item.text, item, form.get(n + '-sec'))
//            if (!form.isValid(n + '-sec')) {
//                infoDialog.open(<p><b>"{item.element} > {item.sub_element}"</b> Non-Conformance And Corrective Actions table is not valid</p>);
//                return;
//            }
//        } 
        
//        if (!form.isValid('list_registers') || form.get('list_registers').isEmpty()) {
//            infoDialog.open('Non-Conformance And Corrective Actions are required');
//            return;
//        }
//        for (var n = 1; n <= form.get('list_registers').length; n++) {
//            const item = form.get('list_registers')[n - 1];
//            console.log(item.text, item, form.get(n + '-sec'))
//            if (!form.isValid(n + '-sec')) {
//                infoDialog.open(<p><b>"{item.element} > {item.sub_element}"</b> Non-Conformance And Corrective Actions table is not valid</p>);
//                return;
//            }
//        } 
        
//        if (!form.isValid('list_appointment_letters') || form.get('list_appointment_letters').isEmpty()) {
//            infoDialog.open('Non-Conformance And Corrective Actions are required');
//            return;
//        }
//        for (var n = 1; n <= form.get('list_appointment_letters').length; n++) {
//            const item = form.get('list_appointment_letters')[n - 1];
//            console.log(item.text, item, form.get(n + '-sec'))
//            if (!form.isValid(n + '-sec')) {
//                infoDialog.open(<p><b>"{item.element} > {item.sub_element}"</b> Non-Conformance And Corrective Actions table is not valid</p>);
//                return;
//            }
//        } 
        
//        if (!form.isValid('list_site_conditions') || form.get('list_site_conditions').isEmpty()) {
//            infoDialog.open('Non-Conformance And Corrective Actions are required');
//            return;
//        }
//        for (var n = 1; n <= form.get('list_site_conditions').length; n++) {
//            const item = form.get('list_site_conditions')[n - 1];
//            console.log(item.text, item, form.get(n + '-sec'))
//            if (!form.isValid(n + '-sec')) {
//                infoDialog.open(<p><b>"{item.element} > {item.sub_element}"</b> Non-Conformance And Corrective Actions table is not valid</p>);
//                return;
//            }
//        } 

        const {
            date, auditor, 
            contractor, contract_num, site_name, contact_person, contact_phone, contact_email,
            list_admin = [], list_registers = [], list_appointment_letters = [], list_site_conditions = []
        } = form.data;
        const data = {
            date: date.getTime(), auditor, 
            contractor, contract_num, site_name, contact_person, contact_phone, contact_email
        }; 
        
        const mapItems = (item, n) => {
            item = toJS(item);
            let {photos = []} = item;
            photos = (photos || []).map(p => p.path);
            return {...item, photos};
        };
        data.list_admin = list_admin.map(mapItems);
        data.list_registers = list_registers.map(mapItems);
        data.list_appointment_letters = list_appointment_letters.map(mapItems);
        data.list_site_conditions = list_site_conditions.map(mapItems);
        
        console.log(data)
        
        return;

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
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
//        const [NewAdminTableData1, NewAdminTableData2] = NewAdminTableData();
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="date" type="date" placeholder="Audit Date..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="auditor" type="text" placeholder="Auditor" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="site_name" type="text" placeholder="Site Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <hr />
                        <label>Contractor</label>
                        <ClearableInput name="contractor" type="text" placeholder="Contractor Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contract_num" type="text" placeholder="Contract Number" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="num_of_employees" type="text" placeholder="No. Of Employees" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <hr />
                        <label>Contacts</label>
                        <ClearableInput name="contact_person" type="text" placeholder="Contact Person" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contact_phone" type="text" placeholder="Contact Phone No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contact_email" type="email" placeholder="Contact Email Address" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-findings">
                    <label>
                        2. Administration
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <RowSecGroup ref="administration_sec" rendered={false}>
                        <NewTable ref="list_admin" showHead name="list_admin" onChange={this.form.onChange}/>
                    </RowSecGroup>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-findings">
                    <label>
                        3. Registers
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <RowSecGroup ref="registers_sec" rendered={false}>
                        <NewTable ref="list_registers" showHead name="list_registers" onChange={this.form.onChange}/>
                    </RowSecGroup>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-findings">
                    <label>
                        4. Appointment Letters
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <RowSecGroup ref="appointment_letters_sec" rendered={false}>
                        <NewTable ref="list_appointment_letters" showHead name="list_appointment_letters" onChange={this.form.onChange}/>
                    </RowSecGroup>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-findings">
                    <label>
                        5. Site Conditions
                        <Clickable idx={5} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <RowSecGroup ref="site_conditions_sec" rendered={false}>
                        <NewSiteConditionsTable ref="list_site_conditions" showHead name="list_site_conditions" onChange={this.form.onChange}/>
                    </RowSecGroup>
                    <NavButtons idx={5} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="NewTable">
@observer
class NewTable extends ATableSavable {

    selfRefs = {};
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onSetRef = this.onSetRef.bind(this);
        
        this.closeAll = this.closeAll.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
        
//        console.log(this.list.length)
    }
    // </editor-fold>
    
    onSetRef(regulationIdx, ref) {
        this.selfRefs[regulationIdx] = ref;
    }
    
    setList(val) {
        this.state.list = val;
    }

    @computed get listGroup() {
        const groups = this.list.groupBy('regulation');
        return Object.keys(groups).map(k => {
            let list = groups[k];
            return {regulation: k, list};
        });
    }
    
    closeAll(regulationIdx) {
        Object.keys(this.selfRefs).filter((k, n) => regulationIdx !== k).forEach((k, n) => {
            this.selfRefs[k].close();
        });
    }
    
    // <editor-fold defaultstate="collapsed" desc="onPostChange">
    onPostChange(item, requirementIdx, subjectIdx, regulationIdx){
        const {onChange} = this.props;
        console.log('onPostChange', item, requirementIdx, subjectIdx, regulationIdx, toJS(this.list))
        onChange && onChange(toJS(this.list), this.props.name, this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.listGroup[n];
        return <QuestionRegulationGroupRow 
            key={"item-new-" + n} 
            idx={n} 
            item={item}
            onChange={this.onPostChange}
            closeAll={this.closeAll}
            onSetRef={this.onSetRef}
        />;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<div className="ANewTable flex">
            <Table className="padding-0 margin-l-0 margin-t-5 margin-r-10">
                <TBody 
                    ref="body" 
                    title="" 
                    renderItem={this.renderItem} 
                    onClick={this.onClick} 
                    state={this.state} 
                    list={this.listGroup} 
                    disablePullToRefresh={true}
                />
            </Table>
        </div>);
    }
    // </editor-fold>
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewSiteConditionsTable">
@observer
class NewSiteConditionsTable extends NewTable {

    constructor(props) {
        super(props);
    }
    
    /*
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.list[n];
        if(!item) return null;
        item.achieved_score = item.achieved_score && parseInt(item.achieved_score);
        const achieved_scores = setAchievedScrores(item.possible_score);
        const na_score = [{text: '', checked: false}];
        return <TRow key="item-new">
            <div className="td">
                {item.subject}
            </div>
            <div className="td fixed-flex min-w-50 td-possible-score">
                <ClearableInput idx={n} ref={this.onSetRef} name="possible_score" type="text" defaultValue={item.possible_score} isEditable={false} readonly placeholder="" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-110 td-achieved-score">
                <ClearableInput idx={n} ref={this.onSetRef} name="achieved_score" type="select" placeholder="..." isClearable={false} required className="form-control" onChange={this.onChange} values={achieved_scores} returnValue/>
            </div>
            <div className="td fixed-flex min-w-50">
                <ClearableInput idx={n} ref={this.onSetRef} name="na_score" type="checkbox" placeholder="" isClearable={false} className="form-control" onChange={this.onChange} values={na_score}/>
            </div>
            <div className="td fixed-flex min-w-140">
                <Photos idx={n} item={item} name="photos" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput idx={n} ref={this.onSetRef} name="comments" type="text" placeholder="" className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-65 td-compliance">
                <Compliance idx={n} item={item} onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-60 padding-r-10">
                <Button idx={n} action="save" className="btn btn-primary pull-right w-40" onClick={onClick}>
                    <i className="fa fa-check"/>
                </Button>
            </div>
        </TRow>;
    }
    // </editor-fold>
    */
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return null;
        return <Table className="SubjectTable margin-0 w-full">
            <THead>
                <div className="td">Subject</div>
                <div className="td fixed-flex min-w-110 td-possible-score">Possible Score</div>
                <div className="td fixed-flex min-w-110 td-achieved-score">Achieved Score</div>
                <div className="td fixed-flex min-w-50">N/A</div>
                <div className="td fixed-flex min-w-140">Photos</div>
                <div className="td">Comments</div>
                <div className="td fixed-flex min-w-110 td-compliance">Compliance</div>
                <div className="td fixed-flex min-w-60 padding-0"></div>
            </THead>
            <TBody ref="body" title="" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>;
    }
    // </editor-fold>
}
// </editor-fold>

export default NewContractorsAuditDialog;
