import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import style from "./ProfileKPIDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileKPIDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "KPI (Key Perfomance Indicator)";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable state = {
        lists: {
            types: ['Employee', 'Department', 'Company']
        }
    };
    
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
                    target, name, list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="target" value={target} type="select" placeholder="Target" required className={(target === 'Company' ? "hor-center" : "pull-left-2") + " col-lg-4"} onChange={this.form.onChange} values={this.state.lists.types}/>
                        <ProfileField name="name" value={name} placeholder={target + " Name"} rendered={target !== 'Company'} className="pull-right-2 col-lg-4" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Key Perfomance Indicator</label>
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
            <div className="td"><span>{item.realistic_target}</span></div>
            <div className="td"><span>{item.achievement_or_frequency}</span></div>
            <div className="td"><span>{item.action_by.fname + ' ' + item.action_by.lname}</span></div>
            <div className="td"><span>{item.remarks}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Realistic Target</div>
		<div className="td">Achievement (Frequency)</div>
		<div className="td">Action By</div>
		<div className="td">Remarks</div>
            </THead>
            <TBody ref="body" title="Key Perfomance Indicator" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
