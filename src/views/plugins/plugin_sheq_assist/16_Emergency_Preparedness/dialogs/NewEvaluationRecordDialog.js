import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewEvaluationRecordDialog.lazy.css";

@observer
class NewEvaluationRecordDialog extends ANewDialog {
    pageKey = "NewEvaluationRecordDialog";
    title = "Create Evacuation Record";
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
    path = "plugin_sheq_assist/16_Emergency_Preparedness/evaluation-record/";

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form, refs: {newQuestionsTable, newDrillObservationsTable}} = this;

        if (!form.isValid('method_of_announcing_emergency')) {
            infoDialog.open('Method Of Announcing Emergency is required');
            return;
        }
        if (!form.isValid('training_date')) {
            infoDialog.open('Training Date is required');
            return;
        }
        if (!form.isValid('starting_time')) {
            infoDialog.open('Starting Time is required');
            return;
        }
        if (!form.isValid('ending_time')) {
            infoDialog.open('Ending Time is required');
            return;
        }
        if (!form.isValid('desc')) {
            infoDialog.open('Short Description Of Emergency is required');
            return;
        }
        
        const question_list = newQuestionsTable.list.filter(item => !!item.status);
        if (question_list.isEmpty()) {
            infoDialog.open('Questions are required');
            return;
        } else if(question_list.length !== newQuestionsTable.list.length){
            for(var n = 0; n < newQuestionsTable.list; n++){
                const item = newQuestionsTable.list[n];
                if(!item.status) {
                    infoDialog.open('Please answer: ' + item.text);
                    return;
                }
            }
        }
        const drill_observation_list = newDrillObservationsTable.list.filter(item => !!item.status);
        if (drill_observation_list.isEmpty()) {
            infoDialog.open('Drill Observations are required');
            return;
        } else if(drill_observation_list.length !== newDrillObservationsTable.list.length){
            for(var n = 0; n < newDrillObservationsTable.list; n++){
                const item = newDrillObservationsTable.list[n];
                if(!item.status) {
                    infoDialog.open('Please answer: ' + item.text);
                    return;
                }
            }
        }

        const {method_of_announcing_emergency, training_date, starting_time, ending_time, desc} = form.data;
        const data = {
            method_of_announcing_emergency, 
            training_date: training_date.getTime(), 
            starting_time,
            ending_time,
            desc,
            question_list,
            drill_observation_list
        };
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
                    <div className="row sec-group first-row">
                        <ClearableInput name="method_of_announcing_emergency" type="text" placeholder="Method Of Announcing Emergency" required className="form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="training_date" type="date" placeholder="Training Date" required className="form-control fixed-flex" onChange={this.form.onChange}/>
                        <ClearableInput name="starting_time" type="time" placeholder="Starting Time" required className="form-control fixed-flex" onChange={this.form.onChange}/>
                        <ClearableInput name="ending_time" type="time" placeholder="Ending Time" required className="form-control fixed-flex" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ClearableInput name="desc" type="textarea" placeholder="Short Description Of Emergency" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Questions & Drill Observations</label>
                    <NewQuestionsTable ref="newQuestionsTable" name="question_list"/>
                    <NewDrillObservationsTable ref="newDrillObservationsTable" name="drill_observation_list"/>
                </div>
            </div>
        </div>);
    }
}

@observer
class ANewTableImpl extends ATableSavable {
    @observable
    selfState = {
        lists: {}
    };
    constructor(props) {
        super(props);
    }
    
    onChange(val, name, el) {
        const idx = el.props.idx;
        const item = this.state.list[idx];
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item.status = val;
        } else if (isNullable(val)) {
            item.status = null;
        }
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	const name = this.key + "_" + n;
        this.selfState.lists[n] = [{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}];
        const options = this.selfState.lists[n];
	return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.text}</span></div>
            <div className="td fixed-flex min-w-180">
		<ClearableInput name={name} type="radio" className="form-control" idx={n} data-list={this.key} onChange={this.onChange} values={options}/>
            </div>
	</TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">{this.title}</div>
            </THead>
            <TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class NewQuestionsTable extends ANewTableImpl {
    title = 'Questions';
    key = 'question';
    
    constructor(props) {
        super(props);
        this.state.list = [
				{text: "Has the announcement been clearly heard/seen?", status: null},
				{text: "Was there any effort to stop the accident?", status: null},
				{text: "Did workers have adequate equipment at the place of the accident?", status: null},
				{text: "Was electricity turned off?", status: null},
				{text: "Were windows closed?", status: null},
				{text: "Were evacuation roads passable?", status: null},
				{text: "Did conjestion happen at the exit door?", status: null},
				{text: "Did employees arrive at the place for evacuation in acceptable time?", status: null},
				{text: "Did all employees arrive at the place for evacuation?", status: null},
				{text: "Was coming to the place of assembly done quietly and without panic?", status: null},
				{text: "Did employees bring personal belongings to the place of evacuation?", status: null},
				{text: "Were authorized services called for help?", status: null},
				{text: "Was time of authority's arrival acceptable?", status: null},
				{text: "Have the authorized persons in the organization been notified about the accident?", status: null},
				{text: "Did employees return to work after termination of emergency in an orderly manner?", status: null}
			];
    }
}

@observer
class NewDrillObservationsTable extends ANewTableImpl {
    title = 'Drill Observations';
    key = 'drill_observation';
    
    constructor(props) {
        super(props);
        this.state.list = [
				{text: "Does procedure for Emergency Response need to be reviewed?", status: null},
				{text: "Is there a need for corrective actions?", status: null}
			];
    }
}

export default NewEvaluationRecordDialog;