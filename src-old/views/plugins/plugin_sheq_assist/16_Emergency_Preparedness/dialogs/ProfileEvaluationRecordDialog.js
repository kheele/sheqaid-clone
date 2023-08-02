import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileEvaluationRecordDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEvaluationRecordDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Evacuation Record";
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
                    method_of_announcing_emergency, training_date, starting_time, ending_time, desc,
                    question_list, drill_observation_list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="method_of_announcing_emergency" title="Method Of Announcing Emergency" value={method_of_announcing_emergency} className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="training_date" type="date" title="Training Date" value={training_date} className="col-lg-4" onChange={this.form.onChange}/>
                    <ProfileField name="starting_time" type="time" placeholder="Starting Time" value={starting_time} className="col-lg-4" onChange={this.form.onChange}/>
                    <ProfileField name="ending_time" type="time" placeholder="Ending Time" value={ending_time} className="col-lg-4" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="desc" value={desc} type="textarea" placeholder="Short Description Of Emergency" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label>Questions & Drill Observations</label>
                    <QuestionsTable ref="newQuestionsTable" name="question_list" defaultValue={question_list} onChange={this.form.onChange}/>
                    <DrillObservationsTable ref="newDrillObservationsTable" name="drill_observation_list" defaultValue={drill_observation_list} onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}


@observer
class ATableImpl extends ATableSavable {
    @observable
    selfState = {
        lists: {}
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.list[n];
	return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.text}</span></div>
            <div className={"td fixed-flex min-w-40 " + item.status}>
                <span>{item.status}</span>
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
class QuestionsTable extends ATableImpl {
    title = 'Questions';
    key = 'question';
    
    constructor(props) {
        super(props);
        
    }
}

@observer
class DrillObservationsTable extends ATableImpl {
    title = 'Drill Observations';
    key = 'drill_observation';
    
    constructor(props) {
        super(props);
    }
}

export default ProfileDialog;
