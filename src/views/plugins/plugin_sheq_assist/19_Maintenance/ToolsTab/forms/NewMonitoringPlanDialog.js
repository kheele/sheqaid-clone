import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewMonitoringPlanDialog.lazy.css";

@observer
class NewMonitoringPlanDialog extends ANewDialog {
    pageKey = "NewMonitoringPlanDialog";
    title = "Create Asset Monitoring Plan";
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
    path = "plugin_sheq_assist/19_Maintenance/monitoring-plan/";

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
        const data = tool_list;
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
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
                    <label>Asset Monitoring Plan</label>
                    <NewMonitoringPlanTable ref="table" name="tool_list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewMonitoringPlanTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
            service: ['Within Service Time', 'Due For Service']
        },
	cost_price: 12.50
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            const isHours = item.asset_type.contains('Plant');
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td"><span>{item.asset_type}</span></div>
		<div className="td"><span>{item.equipment_name}</span></div>
		<div className="td"><span>{item.equipment_id}</span></div>
		<div className="td"><span>{item.service}</span></div>
		<div className="td fixed-flex min-w-190"><span>{item.fuel_usage} litres / week</span></div>
		<div className="td fixed-flex min-w-140"><span>{item.working_hrs_or_km}{isHours ? 'hours' : 'km'} / week</span></div>
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
                    <ClearableInput ref={this.onSetRef} name="service" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.selfState.lists.service} returnValue/>
		</div>
		<div className="td fixed-flex min-w-190 td-number flex">
                    <ClearableInput ref={this.onSetRef} name="fuel_usage" type="number" required isClearable={false} className="form-control" onChange={this.onChange}/>
                    <label className="fixed-flex min-w-110 text-center">litres / week</label>
		</div>
		<div className="td fixed-flex min-w-140 td-number flex">
                    <ClearableInput ref={this.onSetRef} name="working_hrs_or_km" type="number" isClearable={false} required className="form-control" onChange={this.onChange}/>
                    <label className="fixed-flex min-w-60 text-center">/ week</label>
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
		<div className="td">Service</div>
		<div className="td fixed-flex min-w-190">Fuel Usage</div>
		<div className="td fixed-flex min-w-140">Working<br />Hours / Kilometres</div>
		<div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Asset Monitoring Plan" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewMonitoringPlanDialog;
