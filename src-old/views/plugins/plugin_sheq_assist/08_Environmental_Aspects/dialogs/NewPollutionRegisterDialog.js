import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates} from "../../../../../utils/Utils";

import {Button, ClearableInput, SelectEmployeeInput} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewPollutionRegisterDialog.lazy.css";

@observer
class NewPollutionRegisterDialog extends ANewDialog {
    pageKey = "NewTrainingRegisterDialog";
    title = "Create Pollution Survey Register";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/08_Environmental_Aspects/pollution-register/";

    @observable
    state = {
        list: []
    };

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('surveyed_by')) {
            infoDialog.open('Surveyed By is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('list')) {
            infoDialog.open('Pollution Survey Register List is required');
            return;
        }

        const {surveyed_by: {id, data: {fname, lname}}, date, list} = form.data;
        const data = {surveyed_by: {id, fname, lname}, date: date.getTime()};
        data.list = list.map(val => {
            val.completion_date = val.completion_date.getTime();
            return val;
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
                        <SelectEmployeeInput name="surveyed_by" placeholder="Surveyed By..." required className="col-lg-3 pull-left-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Survey Date" required className="col-lg-3 pull-right-3 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Pollution Survey Register List</label>
                    <div className="row sec-group">
                        <NewPollutionRegisterTable ref="table" name="list" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewPollutionRegisterTable extends ATableSavable {
    
    @observable
    selfState = {
        
    };
    
    constructor(props) {
        super(props);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.department_or_area_or_workplace}</span></div>
		<div className="td"><span>{item.pollution_agent_list}</span></div>
		<div className="td"><span>{item.pollution}</span></div>
		<div className="td"><span>{item.comments_or_recommendation_to_rectify_or_control_pollution}</span></div>
		<div className="td"><span>{item.action_by_who}</span></div>
		<div className="td"><span>{Dates.formatDate(item.completion_date)}</span></div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="department_or_area_or_workplace" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="pollution_agent_list" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="pollution" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="comments_or_recommendation_to_rectify_or_control_pollution" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="action_by_who" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="completion_date" type="date" placeholder="Select..." required className="form-control" onChange={this.onChange}/>
		</div>
                <div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Department / Area / Workplace</div>
		<div className="td">List Pollution Agents</div>
		<div className="td">Pollution</div>
		<div className="td">Comments/Recommendation To Rectify/Control Pollution</div>
		<div className="td">Action By Who</div>
		<div className="td">Completion Date</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Pollution Survey Register" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewPollutionRegisterDialog;
