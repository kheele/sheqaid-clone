import React from "react";
import {observer} from 'mobx-react';

import {Button, ProfileField, UploadButton} from 'components/inputs';
import {Slider} from 'components/lists';

import {NewQuestionnaireDialog} from './PlannedJobObservationsDialog/ObservationsTab/forms';

@observer
class PlannedJobObservationsTab extends React.Component {
    pageKey = "PlannedJobObservationsTab";

    constructor(props) {
        super(props);
        
        this.onCreate = this.onCreate.bind(this); 
        this.renderItem = this.renderItem.bind(this);
    }
    
    onCreate() {
        this.refs.newDialog.open(this.props.item);
    }

    renderItem(item, n, onClick) {
        const {data: {created_at, title, training, trainer, type, competency_type, issued_date, expiry_date, accreditation_num, doc}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Competency Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Certificate Type" name="type" className="col-lg-4" value={type}/>
                <ProfileField title="Competency Type" name="competency_type" className="col-lg-4" value={competency_type}/>
                <ProfileField title="Accreditation Number" name="accreditation_num" className="col-lg-4" value={accreditation_num}/>
                <ProfileField title="Date Of Issue" name="issued_date" type="date" className="col-lg-6" value={issued_date}/>
                <ProfileField title="Expiry Date" name="expiry_date" type="date" className="col-lg-6" value={expiry_date}/>
            </div>
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Training Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Training" name="training" className="col-lg-6" value={training && training.course_or_module} renderer={v => isString(v) ? v : (v.name || v.data.name)}/>
                <ProfileField title="Trainer" className="col-lg-6" value={trainer} renderer={v => v.lname + " " + v.fname}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-b-5 text-center">Certificate Details</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Competency Certificate Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField w-280 hor-center"
                />
            </div>
        </div>;
    }

    render() {
        const {
            item: {
                id, data: {
                    employee_competency_list = {}
                }
            }
        } = this.props;
        
        let list = Object.keys(employee_competency_list).map(id => {
            return {id, expiry_date: employee_competency_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        console.log('employees', list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        }))
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_competency_list[id]};
        });
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="controls pos-relative padding-0">
                    <Button className="btn btn-primary btn-create" onClick={this.onCreate}>
                        Create Competency Certificate
                    </Button>
                    {list.isEmpty() && <p className="no-results fixed-center font-size-20">No Planned Job Observations Available</p>}
                    {!list.isEmpty() && <Slider 
                        name="planned-job-observation-carousel"
                        renderer={this.renderItem} 
                        list={list} 
                        splitBy={1} 
                        colSize="col-lg-12" 
                        onClick={this.onClick}/>}
                </div>
            </div>
            <NewQuestionnaireDialog ref="newDialog"/>
        </div>;
    }
}

export default PlannedJobObservationsTab;