import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import style from "./ReportsTab.lazy.css";

//import NewBaselineRiskAssessmentDialog from './dialogs/NewBaselineRiskAssessmentDialog';
//import ProfileBaselineRiskAssessmentDialog from './dialogs/ProfileBaselineRiskAssessmentDialog';
//import EditBaselineRiskAssessmentDialog from './dialogs/EditBaselineRiskAssessmentDialog';

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
        counts: {
            cost: null,
            completed_trainings: null,
            outstanding_trainings: null,
            accredited_trainings: null,
            non_accredited_trainings: null
        }
    };

    componentDidMount() {
        workers.emit(this.props.path + "stats").then(res => {
            this.state.counts = res.stats_count;
        }).catch(e => {
            console.log(e)
        });
    }

    @computed
    get dataLoaded() {
        return this.state.dataLoaded;
    }

    render() {
        const {cost, completed_trainings, outstanding_trainings, accredited_trainings, non_accredited_trainings} = this.state.counts;
        return <div className="stats-count">
            <div className="orange">
                <h4>Total Cost</h4>
                <div>{cost && cost.toCurrencyNoCents('R')}</div>
            </div>
            <div className="green">
                <h4>Completed Trainings</h4>
                <div>{completed_trainings}</div>
            </div>
            <div className="red">
                <h4>Outstanding Trainings</h4>
                <div>{outstanding_trainings}</div>
            </div>
            <div className="blue">
                <h4>Accredited Trainings</h4>
                <div>{accredited_trainings}</div>
            </div>
            <div className="purple">
                <h4>Non-Accredited Trainings</h4>
                <div>{non_accredited_trainings}</div>
            </div>
        </div>;
    }
}

export default ReportsTab;
