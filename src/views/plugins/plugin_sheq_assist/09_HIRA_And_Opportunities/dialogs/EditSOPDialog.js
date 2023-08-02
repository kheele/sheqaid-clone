import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadSOPLocations} from 'views/plugins/utils';

import {Dates} from "utils/Utils";
import {Button, ClearableInput, PhotoUploadButton, SelectEmployeeInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {AEditDialog} from 'components/dialogs';

import style from "./EditSOPDialog.lazy.css";

@observer
class EditSOPDialog extends AEditDialog {
    pageKey = "EditSOPDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Safe Operating Procedure";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/09_HIRA_And_Opportunities/sop/";

    @observable
    state = {
        lists: {
            category: [{text: 'Machine', value: 'Machine'}, {text: 'Task', value: 'Task'}, {text: 'Action', value: 'Action'}],
            risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}],
            location: []
        },
        loadedSelectLists: false
    };

    constructor() {
        super();
        
        this.form = new Form();
    }
    
    componentDidMount() {
        const loads = {location: onSelectLoadSOPLocations};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;
                 
        if (!form.isValid('category')) {
            infoDialog.open('Category is required');
            return;
        }
        if (!form.isValid('risk_level')) {
            infoDialog.open('Risk Assessment Level is required');
            return;
        }
        if (!form.isValid('prepared_by')) {
            infoDialog.open('Prepared By is required');
            return;
        }
        
        const {
            category, risk_level, location, 
            prepared_by, date_created, date_revised,
            photo,
            risk_list, close_down_list, safety_pre_requesite_list, custom_safety_pre_requesite_list, procedure_list, key_point_list, operation_list,
            other
        } = form.data;
        const data = {};
        if(category) {
            data.category = category;
        }
        if(risk_level) {
            data.risk_level = risk_level;
        }
        if(prepared_by && prepared_by.data) {
            const {id, data: {fname, lname}} = prepared_by;
            data.prepared_by = {id, fname, lname};
        }
        if(location) {
            data.location = location;
        }
        if(date_created) {
            data.date_created = date_created.getTime();
        }
        if(date_revised) {
            data.date_revised = date_revised.getTime();
        }
        if(photo && isString(photo.path)) {
            data.photo = photo.path;
        }
        
        if(risk_list) {
            data.risk_list = risk_list;
        }
        if(close_down_list) {
            data.close_down_list = close_down_list;
        }
        if(safety_pre_requesite_list) {
            data.safety_pre_requesite_list = safety_pre_requesite_list;
        }
        if(custom_safety_pre_requesite_list) {
            data.custom_safety_pre_requesite_list = custom_safety_pre_requesite_list;
        }
        if(procedure_list) {
            data.procedure_list = procedure_list;
        }  
        if(key_point_list) {
            data.key_point_list = key_point_list;
        }  
        if(operation_list) {
            data.operation_list = operation_list;
        }        
        
        if(other) {
            data.other = other;
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        let {
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at,
                    category, risk_level, location, 
                    prepared_by, date_created, date_revised,
                    photo,
                    risk_list, close_down_list, safety_pre_requesite_list, custom_safety_pre_requesite_list, procedure_list, key_point_list, operation_list,
                    other
                }
            }
        } = this;
        
        prepared_by = {label: prepared_by.fname + ' ' + prepared_by.lname, value: prepared_by};
        
        console.log(this.item)
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row col-lg-6 min-h-330">
                    <div className="row sec-group">
                        <ClearableInput name="category" type="radio" placeholder="Category" defaultValue={category} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.category}/>
                        <ClearableInput name="risk_level" type="radio" placeholder="Risk Level" defaultValue={risk_level} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level}/>
                        <SelectWrapper state={this.state} name="location" placeholder="Risk Task Location" defaultValue={location} className="col-lg-12 form-control" onChange={this.form.onChange} values="location"/>
                        
                        <SelectEmployeeInput name="prepared_by" placeholder="Prepared By..." defaultValue={prepared_by} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_created" type="date" placeholder="Date Created..." defaultValue={Dates.parse(date_created)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_revised" type="date" placeholder="Date Revised..." defaultValue={Dates.parse(date_revised)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-6 min-h-330 pull-right">
                    <label>Picture</label>
                    <div className="row sec-group h-275">
                        <PhotoUploadButton name="photo" buttonTitle="Upload Picture" defaultValue={photo} className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Risks Associated With The Equipment / Procedure</label>
                    <div className="row sec-group">
                        <NewRiskListTable name="risk_list" defaultValue={risk_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Close Down</label>
                    <div className="row sec-group">
                        <NewCloseDownListTable name="close_down_list" defaultValue={close_down_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Safety Pre-requesites</label>
                    <div className="row sec-group">
                        <NewSafetyPreRequesiteListTable name="safety_pre_requesite_list" defaultValue={safety_pre_requesite_list || []} onChange={this.form.onChange}/>
                    </div>
                    <label className="margin-t-10">Custom Safety Pre-requesites</label>
                    <div className="row sec-group">
                        <NewCustomSafetyPreRequesiteListTable name="custom_safety_pre_requesite_list" defaultValue={custom_safety_pre_requesite_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Procedures</label>
                    <div className="row sec-group">
                        <NewProcedureListTable name="procedure_list" defaultValue={procedure_list || []} onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <NewKeyPointListTable name="key_point_list" defaultValue={key_point_list || []} onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <NewOperationListTable name="operation_list" defaultValue={operation_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>OTHER - Add exit text into the block below if required. You can/paste from a text document.</label>
                    <div className="row sec-group">
                        <ClearableInput name="other" type="textarea" placeholder="Other" defaultValue={other} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class SelectWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, defaultValue, className, onChange, values} = this.props;
        if(!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue} required className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

@observer
class ANewListTable extends ATableSavable {
    @observable
    selfState = {
        
    };
    constructor(props) {
        super(props);
        
        this.state.list.push(null);
        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
		<div className="td"><span>{item.text}</span></div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new" className="padding-l-0">
                <div className="td fixed-flex min-w-20"></div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table className="w-full padding-0 margin-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td">{this.title}</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class NewRiskListTable extends ANewListTable {
    title = "Risk Associated With The Equipment / Procedure";
    constructor(props) {
        super(props);
    }
}
@observer
class NewCloseDownListTable extends ANewListTable {
    title = "Close Down";
    constructor(props) {
        super(props);
    }
}
@observer
class NewSafetyPreRequesiteListTable extends ATableSavable {
    
    constructor(props) {
        super(props);

        this.onChangeInternal = this.onChangeInternal.bind(this);
        this.renderItem = this.renderItem.bind(this);
        
        this.state.list = this.props.defaultValue || [
            {desc: "Safety Glasses", checked: true},
            {desc: "Hearing Protection", checked: true},
            {desc: "Gloves", checked: false},
            {desc: "Welding Protection", checked: false},
            {desc: "Face Shields", checked: false},
            {desc: "Machine Guards", checked: false},
            {desc: "Pre-use Inspection", checked: false},
            {desc: "Warning Signs", checked: true},
            {desc: "Lock-out Tags", checked: false},
            {desc: "Secure Access", checked: false},
            {desc: "Trained Operator", checked: false},
            {desc: "Work Permit", checked: false},
            {desc: "Close Supervision", checked: false},
            {desc: "Weld Screens", checked: false},
            {desc: "Extinguishers", checked: false}
        ];
    }

    onChangeInternal() {
        const {name} = this.props;
        const list = toJS(this.list);
        this.onChange(list, name, this);
        this.props.onChange && this.props.onChange(list, name, this);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td td-question"><h5 className="no-margin">{item.desc}</h5></div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
                <ButtonWrapper item={item} readonly={this.props.readonly} onChange={this.onChangeInternal}/>
            </div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead>
                <div className="td">Safety Pre-requesite</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60"></div>
            </THead>
            <TBody ref="body" title="Safety Pre-requesite" renderItem={this.renderItem} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}
@observer
class ButtonWrapper extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e, btn) {
        const {item, onChange} = this.props;
        item.checked = !item.checked;
        onChange();
    }

    @computed
    get isChecked() {
        return this.props.item.checked;
    }

    render() {
        return <Button className="btn btn-primary hor-center w-40" onClick={this.onChange}>
            {this.isChecked ? <i className="fa fa-check"/> : <i className="fa fa-square"/>}
        </Button>;
    }
}
@observer
class NewCustomSafetyPreRequesiteListTable extends ANewListTable {
    title = "Custom Safety Pre-requesites";
    constructor(props) {
        super(props);
    }
}
@observer
class NewProcedureListTable extends ANewListTable {
    title = "Pre-start Check";
    constructor(props) {
        super(props);
    }
}
@observer
class NewKeyPointListTable extends ANewListTable {
    title = "Key Points";
    constructor(props) {
        super(props);
    }
}
@observer
class NewOperationListTable extends ANewListTable {
    title = "Operations";
    constructor(props) {
        super(props);
    }
}

export default EditSOPDialog;
