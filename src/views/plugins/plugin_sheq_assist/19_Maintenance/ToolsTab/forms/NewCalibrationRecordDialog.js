import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates} from "utils/Utils";

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewCalibrationRecordDialog.lazy.css";

@observer
class NewCalibrationRecordDialog extends ANewDialog {
    pageKey = "NewCalibrationRecordDialog";
    title = "Create Asset Calibration Record";
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
    path = "plugin_sheq_assist/19_Maintenance/calibration-record/";

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

        if (!form.isValid('tool_list')) {
            infoDialog.open('At least one tool is required');
            return;
        }

        const {tool_list} = form.data;
        const data = tool_list.map(val => {
            val.calibration_date = val.calibration_date.getTime();
            val.next_calibration_date = val.next_calibration_date.getTime();
            return val;
        });
        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if(onSaved) {
                res.forEach(item => onSaved(item));
            }
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
                    <label>Asset Calibration Record</label>
                    <NewCalibrationRecordTable ref="table" name="tool_list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewCalibrationRecordTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
            maintanace_type: ['Calibration']
        }
    };
    
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td"><span>{item.asset_type}</span></div>
		<div className="td"><span>{item.equipment_name}</span></div>
		<div className="td"><span>{item.equipment_id}</span></div>
		<div className="td"><span>{item.maintanace_type}</span></div>
		<div className="td"><span>{item.reference_standard}</span></div>
		<div className="td"><span>{item.certificate_num}</span></div>
		<div className="td"><span>{item.company_calibrating}</span></div>
		<div className="td fixed-flex min-w-160"><span>{Dates.formatDate(item.calibration_date)}</span></div>
		<div className="td fixed-flex min-w-160"><span>{Dates.formatDate(item.next_calibration_date)}</span></div>
		<div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="asset_type" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.selfState.lists.asset_type} returnValue add/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="equipment_name" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="equipment_id" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="maintanace_type" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.selfState.lists.maintanace_type} returnValue add/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="reference_standard" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="certificate_num" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="company_calibrating" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-160">
                    <ClearableInput ref={this.onSetRef} name="calibration_date" type="date" placeholder="dd/mm/yyyy" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-160">
                    <ClearableInput ref={this.onSetRef} name="next_calibration_date" type="date" placeholder="dd/mm/yyyy" required className="form-control" onChange={this.onChange}/>
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
                <div className="td">Asset Type</div>
                <div className="td">Asset Name</div>
		<div className="td">Asset/Reg. No.</div>
		<div className="td">Maintanace Type</div>
		<div className="td">Reference Standard</div>
		<div className="td">Certificate No.</div>
		<div className="td">Company Calibrating</div>
		<div className="td fixed-flex min-w-160">Calibration Date</div>
		<div className="td fixed-flex min-w-160">Next Calibration Date</div>
		<div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Asset Calibration Record" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewCalibrationRecordDialog;
