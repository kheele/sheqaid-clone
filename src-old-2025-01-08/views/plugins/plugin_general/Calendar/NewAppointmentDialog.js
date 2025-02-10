import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {TinyMCE} from 'components/documents';

import {
    Button,
    ClearableInput,
    PDFUploadButton,
    SelectClientInput,
    SelectDepartmentInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewAppointmentDialog.lazy.css";

@observer
class NewAppointmentDialog extends ANewDialog {
    pageKey = "NewAppointmentDialog";
    title = "Schedule Appointment";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/calendar/appointments/";

    @observable
    state = {
        participantList: [],
        showTinyMCE: true
    };
    filterData;

    constructor() {
        super();
        
        this.onSearch = this.onSearch.bind(this);
        this.onLoadListParticipants = this.onLoadListParticipants.bind(this);
        
        this.form = new Form();
    }
    
    onLoadListParticipants() {
        return neonBinding.events.emit('plugin_sheq_assist/employees/select/filter', this.filterData);
    }
    
    onSearch(){
        const {form} = this;
        if (!form.isValid('client_from')) {
            infoDialog.open('Company is required');
            return;
        }
        const {
            client_from, project_from, site_from, department, job_position
        } = form.data;
        this.filterData = {client_id: client_from.id};
        if(project_from) {
            this.filterData.project_id = project_from.id;
        }
        if(site_from) {
            this.filterData.site_id = site_from.id;
        }
        if(department) {
            this.filterData.department_id = department.id;
        }
        if(job_position) {
            this.filterData.job_position_id = job_position.id;
        }
        
        const {participantList} = this.state;
        this.refs.selectParticipantTable.setSelectedList(participantList).open().then(list => {
            this.state.participantList.clear(); 
            this.state.participantList.push(...list);
            this.filterData = null;
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form, state:{participantList}} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Title is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Appointment Date is required');
            return;
        }
        if(participantList.isEmpty()) {
            infoDialog.open('At least one Participant is required');
            return;
        }

        const {title, date, start_time, end_time, notes, doc, participants} = form.data;
        const data = {title};
        
        if(start_time) {
            const start_times = start_time.split(":");
            date.setHours(parseInt(start_times[0]));
            date.setMinutes(parseInt(start_times[1]));
            data.start = date.getTime();
        }
        
        if(end_time) {
            const end_times = end_time.split(":");
            date.setHours(parseInt(end_times[0]));
            date.setMinutes(parseInt(end_times[1]));
            data.end = date.getTime();
        }
        
        if(notes){
            data.notes = notes;
        }
        if(doc){
            data.doc = doc.path;
        }
        if(participants){
            data.participants = participants.map(val => {
                const {id, data: {fname, lname, email}} = val;
                const v = {id, fname, lname};
                if(email) {
                    v.email = email;
                }
                return v;
            });
        }

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            res.start = new Date(res.data.start);
            res.end = new Date(res.data.end);
            res.title = res.data.title;
            
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    renderTHeadParticipantsFrom() {
        return <THead>
            <div className="td">Name</div>
            <div className="td">Department</div>
            <div className="td fixed-flex no-padding min-w-70"></div>
        </THead>;
    }

    renderItemParticipantsFrom(item, n){
        const {id, data: {created_at, fname, lname, optional_info, client, project, site, client_id, project_id, site_id}} = item;
        return <React.Fragment key={id}>
            <div className="td">{fname + ' ' + lname}</div>
            <div className="td">{optional_info ? (optional_info.department ? optional_info.department.name : 'N/A') : 'N/A'}</div>
        </React.Fragment>;
    }
    
    render() {
        const defaultDate = this.props.dialog.extraProp('date');
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row col-lg-3 row-search">
                    <label className="text-center margin-b-20"><h4>Find Participant(s) To Invite:</h4></label>
                    <div className="row sec-group">    
                        <SelectClientInput name="client_from" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_from" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site_from" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectDepartmentInput name="department" placeholder="Department..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <Button className="btn btn-primary hor-center" onClick={this.onSearch}>
                            Find Participant(s)
                        </Button>
                    </div>
                    <SelectTable ref="selectParticipantTable" 
                        isDialog 
                        replaceCols 
                        name="participant" 
                        desc="Participants" 
                        title="Add Participant(s)" 
                        className="col-lg-12 no-padding SelectParticipantTable" 
                        renderTHead={this.renderTHeadParticipantsFrom} 
                        renderItem={this.renderItemParticipantsFrom} 
                        onLoadList={this.onLoadListParticipants}
                        isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
                <div className="row row-details col-lg-4 h-full pull-left">
                    <label className="text-center margin-b-20"><h4>Appointment Details:</h4></label>
                    <div className="row sec-group">    
                        <ClearableInput name="title" type="text" placeholder="Title" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Appointment Date..." defaultValue={defaultDate} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="start_time" type="time" placeholder="Start Time..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="end_time" type="time" placeholder="End Time..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                    <label className="text-center margin-t-10 margin-b-0">Participant(s)</label>
                    <SelectTable ref="selectedParticipantTable" 
                        replaceCols
                        name="participant" 
                        desc="Participants" 
                        title="Invited Participant(s)" 
                        className="col-lg-12 no-padding SelectedParticipantTable" 
                        renderTHead={this.renderTHeadParticipantsFrom} 
                        renderItem={this.renderItemParticipantsFrom} 
                        list={this.state.participantList}
                        isChecked={(item, selectedList) => true}/>
                </div>
                <div className="row row-notes col-lg-5 pull-right">
                    <label>Notes</label>
                    <div className="row sec-group">
			<TinyMCE state={this.state} name="notes" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row row-doc col-lg-5 pull-right h-full">
                    <label>Attach Document</label>
                    <div className="row sec-group">
                        <PDFUploadButton name="doc" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewAppointmentDialog;
