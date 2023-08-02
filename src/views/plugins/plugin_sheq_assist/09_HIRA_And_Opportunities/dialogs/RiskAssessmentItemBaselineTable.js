import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
import {Button} from 'components/inputs';
import {Table} from 'components/tables';

import NewRiskAssessmentItemBaselineDialog from './NewRiskAssessmentItemBaselineDialog';
import RiskAssessmentItemTHead from './RiskAssessmentItemTHead';
import RiskAssessmentItemTBody from './RiskAssessmentItemTBody';

import style from "./RiskAssessmentItemTable.lazy.css";

@observer
class RiskAssessmentItemTable extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onEditItem = this.onEditItem.bind(this);
        this.onNew = this.onNew.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onEditItem(item) {
        return this.refs.newDialog.open(item);
    }
    
    onNew() {
        const {onChange, name} = this.props;
        const {tbody, newDialog} = this.refs;
        newDialog.open().then(item => {
            tbody.state.list.push(item);
            
            onChange && onChange(toJS(this.list), name, this);
        });
    }
    
    render() {
        const {name, readonly, isNew, defaultValue, onChange} = this.props;
        return (<Table className="ARiskAssessmentItemTable RiskAssessmentItemTable w-full min-h-380 padding-0 margin-0">
            {!readonly && <NewRiskAssessmentItemBaselineDialog ref="newDialog"/>}
            <RiskAssessmentItemTHead hasFrequency defaultValue={defaultValue}/>  
            <RiskAssessmentItemTBody ref="tbody" name={name} readonly={readonly} isNew={isNew} onEditItem={this.onEditItem} defaultValue={defaultValue} hasFrequency onChange={onChange}/>
            
            {!readonly && <Button className="btn btn-primary add-item-b" onClick={this.onNew}>
                <i className="fa fa-plus"/> Add Item
            </Button>}
        </Table>);
    }
}

export default RiskAssessmentItemTable;
