import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileEnviroRADialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEnviroRADialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Environmental Risk Assessment";
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
                    title, list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="title" value={title} placeholder="Title" className="hor-center" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label>Environmental Risk Assessment List</label>
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
            <div className="td"><span>{item.issue}</span></div>
            <div className="td"><span>{item.hazard}</span></div>
            <div className="td"><span>{item.consequence}</span></div>
            <div className="td"><span>{item.impact}</span></div>
            <div className="td fixed-flex td-calc td-letter">{item.L1}</div>
            <div className="td fixed-flex td-calc td-letter">{item.C1}</div>
            <div className="td fixed-flex td-calc td-letter">{item.R1}</div>
            <div className="td"><span>{item.risk_control}</span></div>
            <div className="td fixed-flex td-calc td-letter">{item.L2}</div>
            <div className="td fixed-flex td-calc td-letter">{item.C2}</div>
            <div className="td fixed-flex td-calc td-letter">{item.R2}</div>
            <div className="td"><span>{item.overall_risk}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-center">
                <div className="td">Issue</div>
                <div className="td">Hazard</div>
                <div className="td">Consequence</div>
                <div className="td">Impact</div>
                <div className="td td-tr fixed-flex">
                    <div className="td">Risk Rating</div>
                    <div className="td td-tr flex">
                        <div className="td td-calc td-letter">L</div>
                        <div className="td td-calc td-letter">C</div>
                        <div className="td td-calc td-letter">R</div>
                    </div>
                </div>
                <div className="td">Risk Control</div>
                <div className="td td-tr fixed-flex">
                    <div className="td">Risk Rating</div>
                    <div className="td td-tr flex">
                        <div className="td td-calc td-letter">L</div>
                        <div className="td td-calc td-letter">C</div>
                        <div className="td td-calc td-letter">R</div>
                    </div>
                </div>
                <div className="td">What Is The Overall Risk</div>
            </THead>
            <TBody ref="body" title="Environmental Risk Assessment" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
