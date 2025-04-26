import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewEmergencyDrillMatrixDialog.lazy.css";

@observer
class NewEmergencyDrillMatrixDialog extends ANewDialog {
    pageKey = "NewEmergencyDrillMatrixDialog";
    title = "Create Emergency Drill Matrix";
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
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/matrix/";

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

        if (!form.isValid('title')) {
            infoDialog.open('Title is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('list') || form.get('list').isEmpty()) {
            infoDialog.open('Emergency Drills & Exercises Matrix is required');
            return;
        }

        const {title, date, list} = form.data;
        const data = {title, date: date.getTime(), list};
        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(res => {
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
                        <ClearableInput name="title" type="text" placeholder="Title" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Date..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Emergency Drills & Exercises Matrix</label>
                    <NewAttendanceRegisterTable name="list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewAttendanceRegisterTable extends ATableSavable {
    @observable
    selfState = {

    };
    constructor(props) {
        super(props);
        this.state.list = [
            {text: "Planning"},
            {text: "Implementation"},
            {text: "Exercises"},
            {text: "Aftermath"}
        ];
        
        this.onPostChange = this.onPostChange.bind(this);
    }
    
    onPostChange(val, name, el){
        const {onChange} = this.props;
        const item = this.state.list[el.props.idx];
        if(!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item[name] = val;
        } else {
            delete item[name];
        }
        
        if(this.list.filter(v => Object.keys(v).length === 1).length === 4) {
            val = null;
        } else {
            val = toJS(this.list);
        }
        onChange && onChange(val, this.props.name, this);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-120"><span>{item.text}</span></div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="management" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="emergency_manager" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="authorized_emergency_response_persons" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="workers" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="visitors_students_pupils_etc" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="external_teams" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td fixed-flex min-w-120"></div>
                <div className="td">Management</div>
                <div className="td">Emergency Manager</div>
                <div className="td">Authorized Emergency Response Persons</div>
                <div className="td">Workers</div>
                <div className="td">Visitors, Students, Pupils, etc</div>
                <div className="td">External Teams</div>
            </THead>
            <TBody ref="body" title="Emergency Dills & Exercises Matrix" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewEmergencyDrillMatrixDialog;
