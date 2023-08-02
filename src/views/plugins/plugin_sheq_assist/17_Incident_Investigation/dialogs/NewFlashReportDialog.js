import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {onAsyncSelectLoadFlashReportEmployersOrContractors} from 'views/plugins/utils';
import {Button, ClearableInput} from 'components/inputs';
import GridView from 'components/lists/GridView';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewFlashReportDialog.lazy.css";

@observer
class NewFlashReportDialog extends ANewDialog {
    pageKey = "new-flash-report";
    title = "Create Flash Report";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/flash-reports/";

    @observable
    state = {
        lists: {
            incident_type: ["Personal Inquiry", "Security", "Fire", "Environment", "Property Damage", "Vehicle", "Plant"]
        }
    };

    constructor() {
        super();
        
        this.onAsyncSelectLoadFlashReportEmployersOrContractorsxv = onAsyncSelectLoadFlashReportEmployersOrContractors.bind(this);

        this.onAddPhotograph = this.onAddPhotograph.bind(this);
        this.onRemovePhotograph = this.onRemovePhotograph.bind(this);
        this.renderPhotographItem = this.renderPhotographItem.bind(this);
        this.onLoadPhotographPlaceholderList = this.onLoadPhotographPlaceholderList.bind(this);
        
        this.form = new Form();
    }

    onAddPhotograph(e) {
        if (e.target.nodeName.toLowerCase() != 'button') {
            let elem = $(e.target);
            if (!elem.hasAttr('idx')) {
                elem = elem.closest('.col-lg-3');
            }
            const idx = elem.attr('idx');

            electronDialog.showOpenDialogImage().then(file => {
                this.refs.gridView.list[idx] = file;
            });
        } else {
            electronDialog.showOpenDialogImage().then(file => {
                const list = this.refs.gridView.list;
                let added = false;
                for (var n = 0; n < list.length; n++) {
                    if (list[n] === null) {
                        list[n] = file;
                        added = true;
                        break;
                    }
                }
                !added && list.push(file);
            });
        }
    }

    onRemovePhotograph(e) {
        let elem = $(e.target);
        if (!elem.hasAttr('idx')) {
            elem = elem.closest('.col-lg-3');
        }
        const idx = elem.attr('idx');
        const list = this.refs.gridView.list;
        if (list.length === 4) {
            list[idx] = null;
        } else {
            list.removeAt(idx);
        }
    }

    onLoadPhotographPlaceholderList() {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                const min = 4;
                const list = this.refs.gridView.list;
                if (list.isEmpty()) {
                    const nullList = [];
                    for (var n = 1; n <= min; n++) {
                        nullList.push(null);
                    }
                    resolve(nullList);
                } else if (list.filter(item => !!item).isEmpty()) {
                    resolve(list);
                } else {
                    //const 
                    resolve();
                }
            }.bind(this), 0);
        });
    }

    renderPhotographItem(item, n) {
        return <div key={"item-" + n} className="col-lg-3" idx={n}>
            {!!item && <div>
                <img src={item.previewPath}/>
                <i className="fa fa-times" onClick={this.onRemovePhotograph}></i>
            </div>}
            {!item && <div onClick={this.onAddPhotograph}>
                <h3>Add Evidence</h3>
                <i className="fa fa-images"></i>
            </div>}
        </div>;
    }
    
    get photoList(){
        return this.refs.gridView.list.filter(val => !!val);
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('area')) {
            infoDialog.open('Area is required');
            return;
        }
        if (!form.isValid('section')) {
            infoDialog.open('Section is required');
            return;
        }
        
        if (!form.isValid('name_of_injured_person')) {
            infoDialog.open('Name Of Injured Person is required');
            return;
        }
        if (!form.isValid('age')) {
            infoDialog.open('Age is required');
            return;
        }
        if (!form.isValid('occupation')) {
            infoDialog.open('Occupation is required');
            return;
        }
        
        if (!form.isValid('employer')) {
            infoDialog.open('Employer is required');
            return;
        }
        if (!form.isValid('employer_or_contractor')) {
            infoDialog.open('Employer / Contractor is required');
            return;
        }
        
        if (!form.isValid('incident_date')) {
            infoDialog.open('Date Of Incident is required');
            return;
        }
        if (!form.isValid('incident_time')) {
            infoDialog.open('Time Of Incident is required');
            return;
        }
        if (!form.isValid('location_of_incident')) {
            infoDialog.open('Location Of Incident is required');
            return;
        }
        if (!form.isValid('incident_type')) {
            infoDialog.open('Incident Type is required');
            return;
        }
        
        if (!form.isValid('desc_of_incident')) {
            infoDialog.open('Decription Of Incident is required');
            return;
        }
        
        if (!form.isValid('severity')) {
            infoDialog.open('Severity is required');
            return;
        }
        if (!form.isValid('immediate_causes_of_incident')) {
            infoDialog.open('Immediate Causes Of Incident is required');
            return;
        }
                    
        if (this.photoList.isEmpty()) {
            infoDialog.open('Evidence is required');
            return;
        }  
        
        if (!form.isValid('immediate_actions_taken_to_prevent_a_similar_incident')) {
            infoDialog.open('Immediate Actions Taken To Prevent A Similar Incident is required');
            return;
        }
        if (!form.isValid('distributions')) {
            infoDialog.open('Distributions is required');
            return;
        }
        
        if (!form.isValid('reported_by')) {
            infoDialog.open('Reported By is required');
            return;
        }
        if (!form.isValid('position')) {
            infoDialog.open('Position is required');
            return;
        }
        if (!form.isValid('date_reported')) {
            infoDialog.open('Date Reported is required');
            return;
        }
        
        const {
            area, section, 
            name_of_injured_person, age, occupation,
            employer, employer_or_contractor,
            incident_date, incident_time, location_of_incident, incident_type,
            desc_of_incident,
            severity, immediate_causes_of_incident,
            immediate_actions_taken_to_prevent_a_similar_incident, distributions,
            reported_by, position, date_reported
        } = form.data;
        const data = {
            area, section, 
            name_of_injured_person, age, occupation,
            employer, employer_or_contractor,
            incident_date: incident_date.getTime(), incident_time, location_of_incident, incident_type,
            desc_of_incident,
            severity, immediate_causes_of_incident,
            immediate_actions_taken_to_prevent_a_similar_incident, distributions,
            reported_by, position, date_reported: date_reported.getTime()
        };
        
        //three_why_1
        data.photo_list = this.photoList.map(val => {
            return val.path;
        });
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

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="area" type="text" placeholder="Area" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="section" type="text" placeholder="Section" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                    <hr/>
                    <div className="row sec-group">
                        <ClearableInput name="name_of_injured_person" type="text" placeholder="Name Of Injured Person" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="age" type="number" placeholder="Age" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="occupation" type="text" placeholder="Occupation" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                    <hr/>
                    <div className="row sec-group">
                        <ClearableInput name="employer" type="text" placeholder="Employer" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="employer_or_contractor" type="select" placeholder="Employer / Contractor..." required className="col-lg-6 form-control" onChange={this.form.onChange} add onAsyncSelectLoad={this.onAsyncSelectLoadFlashReportEmployersOrContractors} returnValue/>
                    </div>
                    <hr/>
                    <div className="row sec-group">
                        <ClearableInput name="incident_date" type="date" placeholder="Date Of Incident..." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="incident_time" type="time" placeholder="Time Of Incident..." className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="location_of_incident" type="text" placeholder="Location Of Incident" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="incident_type" type="select" placeholder="Incident Type..." required className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.incident_type} returnValue/>
                    </div>
                    <hr/>
                    <div className="row sec-group">
                        <ClearableInput name="desc_of_incident" type="text" placeholder="Decription Of Incident" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <hr/>
                    <div className="row sec-group">
                        <ClearableInput name="severity" type="text" placeholder="Severity" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="immediate_causes_of_incident" type="text" placeholder="Immediate Causes Of Incident" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row photo-grid">
                    <label>Evidence</label>
                    <div className="row sec-group">
                        <GridView key="gridView" ref="gridView" title="Upload Evidence" renderItem={this.renderPhotographItem} onLoadList={this.onLoadPhotographPlaceholderList}/>
                        <Button className="btn btn-primary" onClick={this.onAddPhotograph}>Add Evidence</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="immediate_actions_taken_to_prevent_a_similar_incident" type="text" placeholder="Immediate Actions Taken To Prevent A Similar Incident" required className="col-lg-8 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="distributions" type="text" placeholder="Distributions" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                    <hr/>
                    <div className="row sec-group">
                        <ClearableInput name="reported_by" type="text" placeholder="Reported By" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="position" type="text" placeholder="Position" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_reported" type="date" placeholder="Date Reported" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewFlashReportDialog;
