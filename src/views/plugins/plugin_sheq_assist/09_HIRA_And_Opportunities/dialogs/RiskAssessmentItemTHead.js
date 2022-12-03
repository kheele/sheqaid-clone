import React from "react";
import {observer} from 'mobx-react';
import {THead} from '../../../../../components/tables';

@observer
class RiskAssessmentItemTHead extends React.Component {

    constructor() {
        super();
        
        this.renderAdditionalCols = this.renderAdditionalCols.bind(this);
    }
    
    renderAdditionalCols() {
        const {hasFrequency} = this.props;
        if(!hasFrequency) return null;
        return <React.Fragment>
            <div className="td text-center">Additional Risk Control Measures</div>
            <div className="td td-risk-rating td-tr fixed-flex has-frequency">
                <div className="td text-center">Risk Rating With Controls</div>
                <div className="td td-tr">
                    <div className="td fixed-flex td-calc td-rotate">Frequency</div>
                    <div className="td fixed-flex td-calc td-rotate">Probability</div>
                    <div className="td fixed-flex td-calc td-rotate">Severity</div>
                    <div className="td fixed-flex td-calc td-rotate">Risk Rating</div>
                    <div className="td fixed-flex td-calc td-rotate td-Risk_Rank">Risk Rank</div>
                </div>
            </div>
        </React.Fragment>;
    }

    render() {
        const {hasFrequency} = this.props;
        return (<THead className="h-140">
            <div className="td text-center">Basic Task Step</div>
            <div className="td text-center">Hazard</div>
            <div className="td text-center">Potential Risk</div>
            <div className="td td-tr fixed-flex min-w-180">
                <div className="td text-center">Risk Type</div>
                <div className="td td-tr">
                    <div className="td fixed-flex td-calc td-rotate">Safety</div>
                    <div className="td fixed-flex td-calc td-rotate">Health</div>
                    <div className="td fixed-flex td-calc td-rotate">Environmental</div>
                    <div className="td fixed-flex td-calc td-rotate">Quality</div>
                    <div className="td fixed-flex td-calc td-rotate">Financial</div>
                </div>
            </div>
            <div className={"td td-risk-rating td-tr fixed-flex" + (hasFrequency ? " has-frequency" : "")}>
                <div className="td text-center">Risk Rating Without Controls</div>
                <div className="td td-tr">
                    {hasFrequency && <div className="td fixed-flex td-calc td-rotate">Frequency</div>}
                    <div className="td fixed-flex td-calc td-rotate">Probability</div>
                    <div className="td fixed-flex td-calc td-rotate">Severity</div>
                    <div className="td fixed-flex td-calc td-rotate">Risk Rating</div>
                    <div className="td fixed-flex td-calc td-rotate td-Risk_Rank">Risk Rank</div>
                </div>
            </div>

            <div className="td text-center">Risk Control Measures</div>
            <div className={"td td-risk-rating td-tr fixed-flex" + (hasFrequency ? " has-frequency" : "")}>
                <div className="td text-center">Risk Rating With Controls</div>
                <div className="td td-tr">
                    {hasFrequency && <div className="td fixed-flex td-calc td-rotate">Frequency</div>}
                    <div className="td fixed-flex td-calc td-rotate">Probability</div>
                    <div className="td fixed-flex td-calc td-rotate">Severity</div>
                    <div className="td fixed-flex td-calc td-rotate">Risk Rating</div>
                    <div className="td fixed-flex td-calc td-rotate td-Risk_Rank">Risk Rank</div>
                </div>
            </div>

            {this.renderAdditionalCols()}

            <div className="td fixed-flex min-w-110 padding-0">
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-140 text-center">Responsible Person</div>
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-140 text-center">Target Date</div>
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-140 text-center">Due Date</div>
            </div>
        </THead>);
    }
}

export default RiskAssessmentItemTHead;
