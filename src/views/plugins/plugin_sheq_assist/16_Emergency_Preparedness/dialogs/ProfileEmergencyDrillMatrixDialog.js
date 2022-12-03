import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileEmergencyDrillMatrixDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEmergencyDrillMatrixDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Emergency Drill Matrix";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at,
                    title, date, list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{title}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="title" title="Title" value={title} onChange={this.form.onChange}/>
                    <ProfileField name="date" type="date" placeholder="Date" value={date} onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label>Emergency Drills & Exercises Matrix</label>
                    <ListTable ref="table" name="list" defaultValue={list} onChange={this.form.onChange}/>
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
            <div className="td fixed-flex min-w-120"><span>{item.text}</span></div>
            <div className="td"><span>{item.management}</span></div>
            <div className="td"><span>{item.emergency_manager}</span></div>
            <div className="td"><span>{item.authorized_emergency_response_persons}</span></div>
            <div className="td"><span>{item.workers}</span></div>
            <div className="td"><span>{item.visitors_students_pupils_etc}</span></div>
            <div className="td"><span>{item.external_teams}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td fixed-flex min-w-120"></div>
                <div className="td">Management</div>
                <div className="td">Emergency Manager</div>
                <div className="td">Authorized Emergency Response Persons</div>
                <div className="td">Workers</div>
                <div className="td">Visitors, Students, Pupils, etc</div>
                <div className="td">External Teams</div>
            </THead>
            <TBody ref="body" title="Emergency Dills & Exercises Matrix" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
