import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileEmergencyDrillDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEmergencyDrillDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Emergency Drill";
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
                    area, manager_or_supervisor, date, team_member_list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{area}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="area" title="Area" value={area} className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="manager_or_supervisor" title="Manager / Supervisor" value={manager_or_supervisor} renderer={v => (v.fname + ' ' + v.lname)} onChange={this.form.onChange}/>
                    <ProfileField name="date" type="date" placeholder="Date" value={date} onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ul>
                        <li>In case of Fire / High FDI - Phone/Call Drivers & Teams</li>
                        <li>Give clear message what the situation is</li>
                        <li>Evacuate an area immediately (Record Time to evacuate)</li>
                        <li>Gather at assembly point or demarcation area</li>
                        <li>Ensure all employees are accounted for</li>
                        <li>Stay calm at all times</li>
                        <li>Call fire emergency services hook emergency pump & go to filling point</li>
                        <li>Other employees awaiting further instructions</li>
                        <li>Report to Management as soon as possible</li>
                        <li>Wait for further instructions</li>
                    </ul>
                </div>
                <div className="row">
                    <label>Team Members</label>
                    <ListTable ref="table" name="team_member_list" defaultValue={team_member_list} onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}

@observer
class ListTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
        }
    };
    constructor(props) {
        super(props);
    }

    renderItem(n, onClick) {
        const item = this.list[n];
        console.log('item', n, this.list.length, item)
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
        <TBody ref="body" title="Team Members" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
