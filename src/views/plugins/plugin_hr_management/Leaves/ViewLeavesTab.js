import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button, ProfileField, UploadButton} from 'components/inputs';
import {Slider} from 'components/lists';

import {EditDialog, NewDialog, ProfileDialog} from './forms';

@observer
class LeavesTab extends React.Component {
    pageKey = "LeavesTab";
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
                
        this.onCreate = this.onCreate.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    onCreate() {
        this.refs.newLeaveDialog.open();
    }
    
    renderItem(item, n, onClick) {
        const {data: {created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Leave Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Leave Due To" name="due_to" value={due_to} className="col-lg-6"/>
                <ProfileField title="Leave Type" name="type" value={type} type="select" className="col-lg-6"/>
                <ProfileField title="Leave Start Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Leave Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="No. Of Days Booked" name="days_booked" value={days_booked} className="col-lg-12"/>
                <ProfileField title="Reason Of Leave" name="reason" value={reason} type="textarea" className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments} type="textarea" className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Proof Of Sick Note" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6 pull-left-3"
                />
            </div>
        </div>;
    }
    
    render() {
        const {
            item: {
                id, data: {
                    employee_leave_list = {}
                }
            }
        } = this.props;
        
        let list = Object.keys(employee_leave_list).map(id => {
            return {id, expiry_date: employee_leave_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        const l = list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        });
//        console.log('employees test', l)
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_leave_list[id]};
        });
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="controls pos-relative padding-0">
                    {!storage.is.isEmployee && <Button className="btn btn-primary btn-create" onClick={this.onCreate}>
                        Create Leave
                    </Button>}
                    {list.isEmpty() && <p className="no-results fixed-center font-size-20">No Leaves Available</p>}
                    {!list.isEmpty() && <Slider 
                        name="leave-carousel" 
                        renderer={this.renderItem} 
                        list={list} 
                        splitBy={1} 
                        colSize="col-lg-12" 
                        onClick={this.onClick}/>}
                </div>
            </div>
            <NewDialog ref="newLeaveDialog"/>
        </div>;
    }
}

export default LeavesTab;