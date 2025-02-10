import React from "react";
import {observer} from 'mobx-react';
import {toJS, computed} from 'mobx';
import {Button} from 'components/inputs';
import {Table} from 'components/tables';

import NewRiskAssessmentItemTaskBasedDialog from './NewRiskAssessmentItemTaskBasedDialog';
import RiskAssessmentItemTHead from '../../RAComponents/RiskAssessmentItemTHead';
import RiskAssessmentItemTBody from '../../RAComponents/RiskAssessmentItemTBody';

import style from "../../RAComponents/RiskAssessmentItemTable.lazy.css";

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
    
    @computed get list() {
        return this.refs.tbody.state.list.filter(v => !!v);
    }
    
    render() {
        const {name, readonly, isNew, defaultValue, item, onChange} = this.props;
        // return (<>
        //     <iframe
        //         src="https://view.officeapps.live.com/op/embed.aspx?src=http://localhost:4000//templates/xlsx/risk-assessments/Template-List-BaselineRA.xlsx"
        //         frameborder="0"
        //         width="100%"
        //         style={{
        //             margin: "-5px 0 0 -10px",
        //             width: "calc(100% + 10px)",
        //             minHeight: "360px",
        //         }}>
        //     </iframe>
        //     {!readonly && <NewRiskAssessmentItemTaskBasedDialog ref="newDialog" mainItem={item}/>}
        //     {!readonly && <Button className="btn btn-primary add-item-b" onClick={this.onNew}>
        //         <i className="fa fa-plus"/> Add Item
        //     </Button>}
        // </>);
        return (<Table className="ARiskAssessmentItemTable RiskAssessmentItemTable overflow-hidden w-full min-h-380 padding-0 margin-0">
            {!readonly && <NewRiskAssessmentItemTaskBasedDialog ref="newDialog" mainItem={item}/>}
            <RiskAssessmentItemTHead className="h-175"/>
            <RiskAssessmentItemTBody ref="tbody" name={name} readonly={readonly} isNew={isNew} onEditItem={this.onEditItem} defaultValue={defaultValue} onChange={onChange}/>

            {!readonly && <Button className="btn btn-primary add-item-b" onClick={this.onNew}>
                <i className="fa fa-plus"/> Add Item
            </Button>}
        </Table>);
    }
}

export default RiskAssessmentItemTable;
