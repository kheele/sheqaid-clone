import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import style from "./ProfilePollutionRegisterDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePollutionRegisterDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Pollution Survey Register";
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
                    surveyed_by, date, list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row sec-group">
                    <ProfileField name="date" type="date" value={date} placeholder="Survey Date" required className="col-lg-6" onChange={this.form.onChange}/>
                    <ProfileField name="surveyed_by" value={surveyed_by} renderer={v => v.fname + ' ' + v.lname} placeholder="Surveyed By" required className="col-lg-6" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label>Pollution Survey Register List</label>
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
            <div className="td"><span>{item.department_or_area_or_workplace}</span></div>
	    <div className="td"><span>{item.pollution_agent_list}</span></div>
            <div className="td"><span>{item.pollution}</span></div>
            <div className="td"><span>{item.comments_or_recommendation_to_rectify_or_control_pollution}</span></div>
            <div className="td"><span>{item.action_by_who}</span></div>
            <div className="td fixed-flex min-w-120"><span>{Dates.formatDate(item.completion_date)}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Department / Area / Workplace</div>
		<div className="td">List Pollution Agents</div>
		<div className="td">Pollution</div>
		<div className="td">Comments/Recommendation To Rectify/Control Pollution</div>
		<div className="td">Action By Who</div>
		<div className="td fixed-flex min-w-120">Completion Date</div>
            </THead>
            <TBody ref="body" title="Emergency Roll Call Attendance Register" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
