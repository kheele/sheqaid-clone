import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {SelectTable, THead} from '../../../../../components/tables';
import {Clickable, ProfileField} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';

import style from "./ProfileTrainingRegisterDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTrainingRegisterDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Register";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
        lists: {
            audit_summary: ['Major NCR', 'Minor NCR', 'Complaint', 'Good Practice', 'Observation', 'Note'],
            achieved_score: ['0', '1', '2', '3', '4', '5']
        }
    };
    
    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }

    onNext(e, btn) {        
        return true;
    }

    get item() {
        return this.props.state.item;
    }

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
                    created_at, type, training, trainer, time_or_duration, date, list_proof, list_table
                }
            }
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row active">
                    <label>
                        1. Register Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField name="time_or_duration" placeholder="Time / Duration" value={time_or_duration} required className="col-lg-6" onChange={this.form.onChange}/>
                        <ProfileField name="date" type="date" placeholder="Date" value={date} required className="col-lg-6" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Training Details
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField title="Training Type" value={type} className="col-lg-12"/>
                        <ProfileField title="Job Title" value={training.job_title} renderer={v => v.name} className="col-lg-6"/>
                        <ProfileField title="Course" value={training.course_or_module} renderer={v => isObject(v) ? (v.name || v.data.name) : v} className="col-lg-6"/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        3. Trainer Details
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField title="First Name" value={trainer.fname} className="col-lg-6"/>
                        <ProfileField title="Last Name" value={trainer.lname} className="col-lg-6"/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        4. Register Details
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        {list_proof && <ProfileField name="list_proof" type="file" value={list_proof} required className="col-lg-12" onChange={this.form.onChange}/>}
                        {list_table && <Employees list_table={list_table} title="Employees"/>}
                    </div>
                    <NavButtons idx={4} onBack={onFormBack}/>
                </div>
            </div>
        </div>;
    }

}

@observer
class Employees extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        
        this.form = new Form();
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Employee No.</div>
            <div className="td">Name</div>
            <div className="td fixed-flex min-w-140">ID/Passport No.</div>
            <div className="td">Site</div>
            <div className="td fixed-flex min-w-140">Signature</div>
            <div className="td fixed-flex min-w-0 padding-0"></div>
        </THead>;
    }

    renderItem(item, n){
        const {signature, employee: {id, fname, lname, id_num, passport_num, employee_num, site}} = item;
        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-120">{employee_num || 'N/A'}</div>
            <div className="td">{lname} {fname}</div>
            <div className="td fixed-flex min-w-140">{id_num || passport_num}</div>
            <div className="td">{site && site.name && site.data.name}</div>
            <div className="td td-signature fixed-flex min-w-140"><ProfileField idx={n} name="signature" type="signature" value={signature} className="w-full"/></div>
        </React.Fragment>;
    }
    
    render() {
        const {list_table, title} = this.props;
        console.log('list_table', list_table)
        return <div className="row SelectedEmployees">
            <div className="row sec-group row-table">
                <SelectTable 
                    ref="selectTable" 
                    replaceCols 
                    name="employee" 
                    desc="Employees" title={title} 
                    className="col-lg-12 margin-l-0 margin-r-10 no-padding" 
                    renderTHead={this.renderTHead} renderItem={this.renderItem} 
                    list={list_table}/>
            </div>
        </div>;
    }
}

export default ProfileDialog;
