import React from "react";
import {observer} from 'mobx-react';

import {Button, ProfileField, UploadButton} from '../../../../components/inputs';
import {Slider} from '../../../../components/lists';

import NewWarningDialog from './NewWarningDialog';

@observer
class WarningsTab extends React.Component {
    pageKey = "WarningsTab";
    
    constructor(props) {
        super(props);
                
        this.onCreate = this.onCreate.bind(this);      
        this.renderItem = this.renderItem.bind(this);
    }
    
    onCreate() {
        this.refs.newWarningDialog.open();
    }
    
    renderItem(item, n, onClick) {
        const {data: {created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, doc}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Warning Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Warning Issued By" name="issued_by" value={issued_by} renderer={v => v.lname + ' ' + v.fname} type="select" className="col-lg-12"/>
                <ProfileField title="Warning Type" name="type" value={type} type="select" className="col-lg-12"/>
                <ProfileField title="Warning Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Warning Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="Details Of Misconduct" name="details" value={details} type="textarea" className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments} type="textarea" className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Document" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-12"
                />
            </div>
        </div>;
    }
    
    render() {
        const {
            item: {
                id, data: {
                    employee_warning_list = {}
                }
            }
        } = this.props;
        
        let list = Object.keys(employee_warning_list).map(id => {
            return {id, expiry_date: employee_warning_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        const l = list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        });
//        console.log('employees test', l)
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_warning_list[id]};
        });
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="controls pos-relative padding-0">
                    {!storage.is.isEmployee && <Button className="btn btn-primary btn-create" onClick={this.onCreate}>
                        Create Warning
                    </Button>}
                    {list.isEmpty() && <p className="no-results fixed-center font-size-20">No Warnings Available</p>}
                    {!list.isEmpty() && <Slider 
                        name="warning-carousel" 
                        renderer={this.renderItem} 
                        list={list} 
                        splitBy={1} 
                        colSize="col-lg-12" 
                        onClick={this.onClick}/>}
                </div>
            </div>
            <NewWarningDialog ref="newWarningDialog"/>
        </div>;
    }
}

export default WarningsTab;