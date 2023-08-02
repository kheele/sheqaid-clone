import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../utils/Form';
import {ClearableInput} from '../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../components/tables';

@observer
class NewDialogSpecificComplianceRequirementsTab extends React.Component {
    pageKey = "NewDialogSpecificComplianceRequirementsTab";

    @observable
    state = {
        score: {
            max: 0,
            compliance: 0,
            non_compliance: 0
        }
    };

    constructor(props) {
        super(props);

        this.onCalculate = this.onCalculate.bind(this);
//        this.onChangeList = this.onChangeList.bind(this);

        this.form = new Form();
//        this.form.addChangeOne("list", this.onChangeList);
    }

    onCalculate(list, el) {
        const {onChange} = this.form;
        const max = (8 - list.filter(v => v.status === 'N/A').length) * 10;
        const c = list.filter(v => v.status === 'Comformance').length * 10;
        
        this.state.score.max = max;
        this.state.score.compliance = c;
        this.state.score.non_compliance = max - c;
        onChange && onChange(toJS(list), 'list', el);
    }
    
    render() {
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="controls col-lg-12">
                    <Calc state={this.state}/>
                    <div className="row col-lg-12">
                        <SpecificComplianceRequirementsTable name="list" className="col-lg-12 no-padding" onCalculate={this.onCalculate}/>
                    </div>
                    <div className="row col-lg-12">
                        <h6 className="text-center">Compliance Score required for Risk Assessment & SWP / SOP Training is calculated per item added to the team member on their profile page.</h6>
                    </div>
                </div>
            </div>
        </div>
    }
}

@observer
class Calc extends React.Component {
    render() {
        const {max, compliance, non_compliance} = this.props.state.score;
        return <React.Fragment>
            <div className="row col-lg-6">
                <h4 className="text-center">Minimum Compliance Score Required</h4>
                <h2 className="text-center">{compliance}/{max}</h2>
            </div>
            <div className="row col-lg-6 pull-right">
                <h4 className="text-center">Minimum Non-Compliance Score Required</h4>
                <h2 className="text-center">{non_compliance}/{max}</h2>
            </div>
        </React.Fragment>;
    }
}

@observer
class SpecificComplianceRequirementsTable extends ATableSavable {
    
    @observable
    selfState = {
    };
    
    constructor(props) {
        super(props);
        
        this.state.list = [
            {text: 'Induction Training', status: null},
            {text: 'Valid Medical Fitness Certificate', status: null},
            {text: 'Sign Company Safety Policy', status: null},
            {text: 'Risk Assessment Training', status: null},
            {text: 'SWP/ SOP Training', status: null},
            {text: 'Emergency Procedures Training', status: null},
            {text: 'PPE Issue Training', status: null},
            {text: 'Standards & Procedures Training', status: null}
        ];
    }
    
    onChange(val, name, el) {
        const idx = el.props.idx;
        const item = this.state.list[idx];
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item.status = val;
        } else if (isNullable(val)) {
            item.status = null;
        }
        this.props.onCalculate(this.state.list, this);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	const name = "item_" + n;
        const options = [
            {value: "Comformance", text: "C", checked: false},
            {value: "Non-Comformance", text: "NCR", checked: false},
            {value: "N/A", text: "N/A", checked: false}
        ];
	return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.text}</span></div>
            <div className="td fixed-flex min-w-250">
		<ClearableInput name={name} type="radio" className="form-control" idx={n} defaultValue="N/A" onChange={this.onChange} values={options}/>
            </div>
	</TRow>;
    }

    render() {
        const {compliance_requirements} = this.props;
        return (<Table>
            <THead className="align-left">
                <div className="td">Compliance Requirements</div>
                <div className="td padding-t-5 padding-l-5 padding-r-5">C = Comformance, NCR = Non-Comformance, N/A = Not Applicable</div>
            </THead>
            <TBody ref="body" title="Compliance Requirements" renderItem={this.renderItem} onClick={this.onClick} state={this.state} selectedList={compliance_requirements || []} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewDialogSpecificComplianceRequirementsTab;