import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';

import {Dates} from '../../../../utils/Utils';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField} from '../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../components/tables';

import style from "./ProfileAppointmentDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileAppointmentDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return this.props.title;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable state = {
        employees: [],
        employeesLoaded: false,
        type: null,
        showTinyMCE: true
    };
    
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        
        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    renderItem(item, n){
        const {id, data: {fname, lname}} = item;
        return fname + ' ' + lname;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at,
                    title, meeting_type, start, end, notes, doc, participants, expiry_date
                }
            }
        } = this;
        
        console.log('participants', this.item)

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">   
                        <ProfileField name="title" value={title} placeholder="Title" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">    
                        <ProfileField name="date" value={start} type="date" placeholder="Date" className="col-lg-12" onChange={this.form.onChange}/>
                        <ProfileField name="start_time" value={Dates.formatTimeExcSec(start)} type="time" placeholder="Start Time" className="col-lg-6" onChange={this.form.onChange}/>
                        <ProfileField name="end_time" value={Dates.formatTimeExcSec(end)} type="time" placeholder="End Time" className="col-lg-6" onChange={this.form.onChange}/>
                        <ProfileField name="expiry_date" value={expiry_date} type="date" placeholder="Expiry Date" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label className="hor-center">Notes</label>
                    <div className="row sec-group">  
                        <div className="col-lg-12 document-preview margin-t-10" dangerouslySetInnerHTML={{__html: notes}}/>
                    </div>
                </div>
                <div className="row row-doc">
                    <label className="hor-center">Attached Document</label>
                    <div className="row sec-group">  
                        <ProfileField name="doc" type="file" value={doc} className="col-lg-12" onChange={this.props.onChange}/>
                    </div>
                </div>
                <div className="row row-participants">
                    <label className="hor-center">Participants</label>
                    {participants && <ListTable ref="table" name="participants" defaultValue={participants} onChange={this.form.onChange}/>}
                    {!participants && <p className="col-lg-12 text-center margin-t-10">N/A</p>}
                </div>
            </div>
        </div>;
    }

}

@observer
class ListTable extends ATableSavable {
    @observable
    selfState = {
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.fname}</span></div>
            <div className="td"><span>{item.lname}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">First Name</div>
		<div className="td">Last Name</div>
            </THead>
            <TBody ref="body" title="Participants" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
