import React from "react";
import {observer} from 'mobx-react';

import Form from '../../../../../utils/Form';
import {Dates} from '../../../../../utils/Utils';

import {ToolList} from '../../../../../components/page-lists';

import {Button, ClearableInput, SelectTeamInput} from '../../../../../components/inputs';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewToolsDailyRegisterDialog.lazy.css";

@observer
class NewToolsDailyRegisterDialog extends ANewDialog {
    pageKey = "NewToolsDailyRegisterDialog";
    title = "Daily Tool Register";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/19_Maintenance/tools/daily-register/";

    list = [];

    constructor() {
        super();
        
        this.onScanBarcode = this.onScanBarcode.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        
        this.onClick = this.onClick.bind(this);
        
        this.form = new Form();
    }
    
    onScanBarcode(){
        
    }

    onClick(e, btn){
        const {list} = this;
        let idx = btn.props.idx;
        const id = this.refs.toolList.list[idx].id;
        if(list.contains(id)){
            list.remove(id);
            btn.text("Select");
        } else {
            list.push(id);
            btn.text("Unselect");
        }
        
        const node = btn.getDOMNode();
        const tr = node.parentNode.parentNode;
        tr.classList.toggle('selected');
        if(tr.classList.contains('selected')){
            tr.style.background = 'rgba(2, 168, 168, 0.2)';
        } else {
            tr.style.background = 'none';
        }
        
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('team')) {
            infoDialog.open('Team is required');
            return;
        }
        if (!form.isValid('store_keeper_signature')) {
            infoDialog.open('Store Keeper Signature is required');
            return;
        }
        if (!form.isValid('team_supervisor_signature')) {
            infoDialog.open('Team Supervisor Signature is required');
            return;
        }
        
        let tool_list = this.list;
        if (tool_list.isEmpty()) {
            infoDialog.open('At least one tool is required');
            return;
        }

        const {team, store_keeper_signature, team_supervisor_signature} = form.data;
        const data = {team_id: team.id, store_keeper_signature, team_supervisor_signature, tool_list};
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if(onSaved) {
                res.forEach(onSaved);
            }
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    
    renderLeftButtons() {
        return <div className="left-buttons pull-left">
            <Button key="buttonScanBarcode" className="btn btn-primary pull-right" onClick={this.onScanBarcode}>
                <i key="buttonScanBarcodeIcon" className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>
        </div>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="category" type="select" placeholder="Category..." className="fixed-flex min-w-300 form-control" onChange={onChange}/>
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <Button className="form-control btn btn-primary fixed-flex min-w-195" onClick={this.onScanBarcode}>
                <i className="fa fa-barcode icon-left"/>Scan Barcode
            </Button>
        </div>;
    }

    get action() {
        return <React.Fragment><i className="fa fa-check"/>Select</React.Fragment>;
    }

    render() {
        const date = new Date();
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <SelectTeamInput name="team" placeholder="Team..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="store_keeper_signature" type="signature" placeholder="Store Keeper Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="team_supervisor_signature" type="signature" placeholder="Team Supervisor Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group warning-row">
                        <p>Please Ensure That You <b>Scan</b> A Tool <b>Barcode</b> Using A <b>Mobile App</b>.</p> 
                    </div>
                </div>
                <div className="row">
                    <label>{Dates.getWeekday(date)} ({Dates.formatDateTime(date)})</label>
                    <ToolList 
                        ref="toolList"
                        pageTitle="Tools"
                        path={this.path}
                        renderLeftButtons={this.renderLeftButtons}
                        renderFilterNode={this.renderFilterNode}
                        action={this.action}
                        onClick={this.onClick}/>
                </div>
            </div>
        </div>);
    }
}

export default NewToolsDailyRegisterDialog;
