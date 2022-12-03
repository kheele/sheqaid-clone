import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import style from "./ReportsTab.lazy.css";

import TrainingsDialog from "./dialogs/TrainingsDialog";

//training checklist

//other (training expires after certain period)
@observer
class ReportsTab extends React.Component {
    path;
    pageKey = "ReportsTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'reports/';
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return <div id={this.pageKey + "-tab"} className={this.pageKey + "-tab"}>
            <StatsCount ref="stats" path={this.path}/>
        </div>
    }
}

@observer
class StatsCount extends React.Component {

    @observable
    state = {
        dataLoaded: false,
        dataError: false,
        counts: {
            completed_trainings: null,
            outstanding_trainings: null,
            accredited_trainings: null,
            non_accredited_trainings: null
        }
    };

    constructor(props) {
        super(props);
        this.getDialogRef = this.getDialogRef.bind(this);
    }
    
    componentDidMount() {
        neonBinding.events.emit(this.props.path + "stats").then(res => {
            this.state.counts = res.stats_count;
            this.state.dataLoaded = true;
            this.state.dataError = false;
        }).catch(e => {
            console.log(e)
            this.state.dataLoaded = true;
            this.state.dataError = true;
        });
    }

    @computed
    get dataLoaded() {
        return this.state.dataLoaded;
    }
    
    getDialogRef(){
        return this.refs.trainingsDialog;
    }

    render() {
        const {
            dataLoaded, dataError,
            counts: {completed_trainings, outstanding_trainings, accredited_trainings, non_accredited_trainings}
        } = this.state;
        return <div className="stats-count">
            {!dataLoaded && <div className="results-loading">
                <CircularProgress/>
                Loading reports...
            </div>}
            {(dataLoaded && dataError) && <div className="results-none">
                An error occurred while loading
            </div>}
            {(dataLoaded && !dataError) && <React.Fragment>
                <Stat color="green" title="Completed Trainings" value={completed_trainings} filter={{key: "status", value: "Completed"}} getDialogRef={this.getDialogRef}/>
                <Stat color="red" title="Outstanding Trainings" value={outstanding_trainings} filter={{key: "status", value: "Outstanding"}} getDialogRef={this.getDialogRef}/>
                <Stat color="blue" title="Accredited Trainings" value={accredited_trainings} filter={{key: "training_provider_requirement", value: "Accredited"}} getDialogRef={this.getDialogRef}/>
                <Stat color="purple" title="Non-Accredited Trainings" value={non_accredited_trainings} filter={{key: "training_provider_requirement", value: "Non-Accredited"}} getDialogRef={this.getDialogRef}/>
                <TrainingsDialog ref="trainingsDialog" path={this.props.path}/>
            </React.Fragment>}
        </div>;
    }
}

@observer
class Stat extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick(e){
//        const {filter: {key, value}, getDialogRef} = this.props;
//        const dialog = getDialogRef();
//        dialog.open(key, value);
    }
    
    render() {
        const {color, title, value: {count, cost}, dialog} = this.props;
        const className = color + " panel";
        return <div className={className} onClick={this.onClick}>
            <h4>{title}</h4>
            <div className="count">{count}</div>
            <div className="currency">{cost.toCurrencyNoCents('R')}</div>
        </div>;
    }
}

export default ReportsTab;
