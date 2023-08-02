import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {SelectTable} from 'components/tables';

@observer
class SpecificComplianceRequirementsTab extends React.Component {
    pageKey = "SpecificComplianceRequirementsTab";

    @observable
    state = {
        list: [
            'Induction Training', 
            'Valid Medical Fitness Certificate', 
            'Sign Company Safety Policy', 
            'Risk Assessment Training', 
            'SWP/ SOP Training', 
            'Emergency Procedures Training', 
            'PPE Issue Training', 
            'Standards & Procedures Training'
        ],
        score: {
            max: 0,
            compliance: 0,
            non_compliance: 0
        }
    };
    
    constructor(props) {
        super(props);
        
        this.onCalculate();
        this.form = new Form();
    }
    
    onCalculate() {
        const {list} = this.state;
        const {compliance_requirements} = this.props.item.data;
        if(compliance_requirements) {
            const max = (8 - compliance_requirements.filter(v => v.status === 'N/A').length) * 10;
            const c = compliance_requirements.filter(v => v.status === 'Comformance').length * 10;

            this.state.score.max = max;
            this.state.score.compliance = c;
            this.state.score.non_compliance = max - c;
        }
    }
    
    Calc({state}) {
        const {max, compliance, non_compliance} = state.score;
        return <div className="row col-lg-12 flex row-ComplianceScore">
            <div>
                <h4 className="text-center font-size-14">Minimum Compliance<br />Score Required</h4>
                <h2 className="text-center">{compliance}/{max}</h2>
            </div>
            <div>
                <h4 className="text-center font-size-14">Minimum Non-Compliance<br />Score Required</h4>
                <h2 className="text-center">{non_compliance}/{max}</h2>
            </div>
        </div>;
    }
    
    render() {
        const {
            item: {
                id, data: {
                    compliance_requirements
                }
            }
        } = this.props;
        const {Calc} = this;
        console.log('compliance_requirements', compliance_requirements)
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                {compliance_requirements && <div className="controls col-lg-12">
                    <Calc state={this.state}/>
                    <div className="row">
                        <SelectTable name="list" desc="Compliance Requirements" className="col-lg-12 no-padding" readonly list={this.state.list} defaultValue={compliance_requirements} onChange={this.form.onChange}/>
                    </div>
                    <div className="row">
                        <h6 className="text-center">Compliance Score required is calculated per item added to the team member on their profile page.</h6>
                    </div>
                </div>}
                {!compliance_requirements && <p className="not-available">N/A</p>}
            </div>
        </div>;
    }
}

export default SpecificComplianceRequirementsTab;