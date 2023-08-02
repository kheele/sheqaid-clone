// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ANewDialog} from 'components/dialogs';
import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {Row} from 'components/FormComponents';

import style from "./PPEIssueDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "PPEIssueDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "PPE Issue";
    }
    
    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            type: ['Teams', 'Departments', 'Job Positions'].map(text => {
                return {text, value: text, checked: false};
            })
        },
        type: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.form = new Form();
        this.form.addChangeOne("type", this.onChangeType.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeType(el, val) {
        this.state.type = val;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            },
            state
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="1. PPE Matrix" 
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="type" type="radio" placeholder="View By" vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
                    
                    <hr className="margin-0"/>
                    
                    <ViewByTeams state={state}/>
                    <ViewByDepartments state={state}/>
                    <ViewByJobPositions state={state}/>
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="ViewByTeams">
@observer
class ViewByTeams extends React.Component {
    
    render() {
        const {state, onChange} = this.props;
        if(state.type !== 'Teams') return null;
        return <div></div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByDepartments">
@observer
class ViewByDepartments extends React.Component {
    
    render() {
        const {state, onChange} = this.props;
        if(state.type !== 'Departments') return null;
        return <div></div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByJobPositions">
@observer
class ViewByJobPositions extends React.Component {
    
    render() {
        const {state, onChange} = this.props;
        if(state.type !== 'Job Positions') return null;
        return <div></div>;
    }
}
// </editor-fold>

export default NewDialog;
