import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';

import {Button, ClearableInput, SelectEmployeeInput} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewKPIDialog.lazy.css";

@observer
class NewKPIDialog extends ANewDialog {
    pageKey = "NewKPIDialog";
    title = "Create KPI (Key Perfomance Indicator)";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/06_Communication_And_Participation/kpi/";

    @observable state = {
        lists: {
            types: ['Employee', 'Department', 'Company']
        }
    };
    
    constructor() {
        super();

        this.form = new Form();
        
        this.onChangeTarget = this.onChangeTarget.bind(this);
        this.form.addChangeOne("target_group", this.onChangeTarget);
    }

    onChangeTarget(el, val) {
        setTimeout(function(){
            if (val) {
                if (val === 'Employee' || val === 'Department') {
                    const node = this.refs.name.setPlaceholder(val + " Name").setRendered(true).setEditable(true).setReadonly(false).getDOMNode();
                    $(node).addClass('pull-right-2');
                    $(el.getDOMNode()).removeClass('hor-center').addClass('pull-left-2');
                } else if (val === 'Company') {
                    this.refs.name.setRendered(false);
                    $(el.getDOMNode()).removeClass('pull-left-2').addClass('hor-center');
                }
            } else {
                this.refs.name.setRendered(false);
                $(el.getDOMNode()).removeClass('pull-left-2').addClass('hor-center');
            }
        }.bind(this), 0);
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('target_group')) {
            infoDialog.open('Target is required');
            return;
        }
        if (form.get('target_group') !== 'Company' && !form.isValid('name')) {
            infoDialog.open(form.get('target_group') + ' Name is required');
            return;
        }
        if (!form.isValid('list')) {
            infoDialog.open('Key Perfomance Indicator is required');
            return;
        }

        const {target_group, name, list} = form.data;
        const data = {target_group};
        if(name) {
            data.name = name;
        }
        data.list = toJS(list.map(val => {
            const {id, data: {fname, lname}} = val.action_by;
            val.action_by = {id, fname, lname};
            return val;
        }));
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
                        <ClearableInput name="target_group" type="select" placeholder="Target..." required className="hor-center col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.types} returnValue/>
                        <ClearableInput ref="name" name="name" type="text" placeholder="Department/Employee Name" rendered={false} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Key Perfomance Indicator</label>
                    <NewKPITable ref="table" name="list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewKPITable extends ATableSavable {

    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            console.log(item)
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td"><span>{item.realistic_target}</span></div>
		<div className="td"><span>{item.achievement_or_frequency}</span></div>
		<div className="td"><span>{item.action_by.data.fname + ' ' + item.action_by.data.lname}</span></div>
		<div className="td"><span>{item.remarks}</span></div>
		<div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new">
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="realistic_target" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="achievement_or_frequency" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <SelectEmployeeInput ref={this.onSetRef} name="action_by" placeholder="Select..." required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="remarks" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
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
                <div className="td">Realistic Target</div>
		<div className="td">Achievement (Frequency)</div>
		<div className="td">Action By</div>
		<div className="td">Remarks</div>
		<div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Key Perfomance Indicator" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewKPIDialog;
