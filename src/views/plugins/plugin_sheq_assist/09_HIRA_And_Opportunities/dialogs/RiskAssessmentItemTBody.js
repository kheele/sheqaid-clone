import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import {Dates, RisksCodes} from "../../../../../utils/Utils";
import {Button} from '../../../../../components/inputs';
import {ATableSavable, TBody, TRow} from '../../../../../components/tables';

@observer
class RiskAssessmentItemTBody extends ATableSavable {
    
    constructor(props) {
        super(props);
        
        if(props.isNew) {
            this.state.list = [];
        }
        
        this.onEditItem = this.onEditItem.bind(this);
    }

    onEditItem(evt, btn) {
        const {onChange, name, onEditItem} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const item = list[idx];
        onEditItem(item).then(item_updated => {
            list.removeIf((v, n) => n === idx);
            list.insertAt(idx, item_updated);
            
            onChange && onChange(toJS(this.list), name, this);
        });
    }
    
    RenderItem({item, n, readonly, onClick, hasFrequency, onEditItem}) {
        let {
            task_step, hazard, risk,
            risk_type, control_measure_list, control_measure_list_additional,
            likelihood_1, frequency_1, consequence_1,
            likelihood_2, frequency_2, consequence_2,
            likelihood_3, frequency_3, consequence_3,
            responsible_person, target_date, due_date
        } = item;
        const contains = val => {
          val += " Risk";
          return risk_type === val || (risk_type.contains && risk_type.contains(val));
        };
        
        let responsible_personName = null;
        if(responsible_person) {
            const {fname, lname, data} = responsible_person;
            responsible_personName = (fname || data.fname).charAt(0).toUpperCase() + '. ' + (lname || data.lname);
        } else {
            responsible_personName = "";
        }
        
        const calcRiskRating = (likelihood, frequency, consequence) => {
            if(hasFrequency) {
                return ((likelihood + frequency) / 2) * consequence;
            } else {
                return likelihood * consequence;
            }
        };
        const calcRiskRank = (n) => {
            if (n <= 4) {
                return 'Low';
            } else if (n <= 8) {
                return 'Medium';
            } else if (n <= 15) {
                return 'High';
            } else if (n > 15){
                return 'Extreme';
            }
        };
        
        const risk_rating_1 = calcRiskRating(likelihood_1, frequency_1, consequence_1);
        const risk_rank_1 = calcRiskRank(risk_rating_1);
        
        const risk_rating_2 = calcRiskRating(likelihood_2, frequency_2, consequence_2);        
        const risk_rank_2 = calcRiskRank(risk_rating_2);
        
        let risk_rating_3, risk_rank_3;
        if(hasFrequency) {
            risk_rating_3 = calcRiskRating(likelihood_3, frequency_3, consequence_3);
            risk_rank_3 = calcRiskRank(risk_rating_3);
        }
        
        const checkIco = <i className="fa fa-check"/>;
        
        return <TRow key={"item-" + n}>
            <div className="td">
                <span className="counter max-w-20">{n + 1}</span>
                {task_step}
            </div>
            <div className="td">{hazard}</div>
            <div className="td">{risk}</div>
            
            <div className="td td-tr fixed-flex flex min-w-180 padding-0">
                <div className="td td-calc">{contains("Safety") && checkIco}</div>
                <div className="td td-calc">{contains("Health") && checkIco}</div>
                <div className="td td-calc">{contains("Environmental") && checkIco}</div>
                <div className="td td-calc">{contains("Quality") && checkIco}</div>
                <div className="td td-calc">{contains("Financial") && checkIco}</div>
            </div>
            
            <div className={"td td-risk-rating td-tr fixed-flex flex padding-0" + (hasFrequency ? " has-frequency" : "")}>
                {hasFrequency && <div className="td td-calc">{frequency_1}</div>}
                <div className="td td-calc">{likelihood_1}</div>
                <div className="td td-calc">{consequence_1}</div>
                <div className="td td-calc">{risk_rating_1}</div>
                <div className={"td fixed-flex td-calc td-Risk_Rank td-risk-level " + RisksCodes.colorClassName(risk_rank_1)}>{risk_rank_1}</div>
            </div>
            
            <div className="td td-risk-control-measures">{control_measure_list && control_measure_list.map((v, n) => <span><i className="counter">{n+1}</i>{v.text}</span>)}</div>
            <div className={"td td-risk-rating td-tr fixed-flex flex padding-0" + (hasFrequency ? " has-frequency" : "")}>
                {hasFrequency && <div className="td td-calc">{frequency_2 || "N/A"}</div>}
                <div className="td td-calc">{likelihood_2 || "N/A"}</div>
                <div className="td td-calc">{consequence_2 || "N/A"}</div>
                <div className="td td-calc">{risk_rating_2 || "N/A"}</div>
                <div className={"td fixed-flex td-calc td-Risk_Rank td-risk-level " + RisksCodes.colorClassName(risk_rank_2)}>{risk_rank_2}</div>
            </div>
            
            {hasFrequency && <React.Fragment>
                <div className="td td-risk-control-measures">{(control_measure_list_additional || []).map((v, n) => <span><i className="counter">{n+1}</i>{v.text}</span>)}</div>
                <div className={"td td-risk-rating td-tr fixed-flex flex padding-0" + (hasFrequency ? " has-frequency" : "")}>
                    <div className="td td-calc">{frequency_3 || "N/A"}</div>
                    <div className="td td-calc">{likelihood_3 || "N/A"}</div>
                    <div className="td td-calc">{consequence_3 || "N/A"}</div>
                    <div className="td td-calc">{risk_rating_3 || "N/A"}</div>
                    <div className={"td fixed-flex td-calc td-Risk_Rank td-risk-level " + RisksCodes.colorClassName(risk_rank_3)}>{risk_rank_3}</div>
                </div>
            </React.Fragment>}
            
            <div className="td td-tr fixed-flex flex min-w-110 min-h-120 padding-0">
                <div className="td fixed-flex td-calc td-rotate-single"><span>{responsible_personName}</span></div>
                <div className="td fixed-flex td-calc td-rotate-single"><span>{Dates.formatDate(target_date)}</span></div>
                <div className="td fixed-flex td-calc td-rotate-single"><span>{Dates.formatDate(due_date)}</span></div>
            </div>
            
            {!readonly && <div className="td td-actions">
                <Button idx={n} action="edit" className="btn btn-primary fa fa-edit pull-left no-border-radius-r" onClick={onEditItem}/>
                <Button idx={n} action="delete" className="btn btn-primary fa fa-times-circle pull-right no-border-radius-l" onClick={onClick}/>
            </div>}
        </TRow>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, hasFrequency} = this.props;
        const item = this.state.list[n];
        return <RenderItem key={new Date().getTime()} n={n} item={item} readonly={readonly} hasFrequency={hasFrequency} onClick={onClick} onEditItem={this.onEditItem}/>;
    }

    render() {
        return (<TBody 
            ref="body" 
            title="Assessed Items" 
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            state={this.state} 
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}/>);
    }
}

export default RiskAssessmentItemTBody;
