import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Grid, Paper, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import {Button} from '../inputs';

import style from './FormHeader.lazy.css';

@observer
class FormHeader extends React.Component {
    
    @observable state = {
        editing: true
    };
    
    constructor(props) {
        super(props);
        
        this.onEdit = this.onEdit.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }
    
    componentWillMount(){
        style.use();
        const {readonly} = this.props;
        if(readonly) {
            this.state.editing = false;
        } else {
            this.state.editing = true;
        }
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    onEdit(e, btn){
        this.state.editing = true;
        btn.hide();
    }
    
    onToggle({target: {nodeName}}) {
        const {formData, readonly} = this.props;
        if(readonly) return;
        nodeName = nodeName.toLowerCase();
        if(nodeName === "input" || nodeName === "textarea" || nodeName === "button") return;
        if(!formData.name || formData.name.isEmpty()) return;
        
        this.state.editing = !this.state.editing;
        
        this.refs.editBtn.toggle();
    }
    
    render() {
        const {formData, formData: {question_list}, readonly, mainTitle} = this.props;
        console.log('FormHeader');
        return <Grid className="FormHeader" onClick={this.onToggle}>
           <div>
                <div>
                    <Paper elevation={2}>
                        <div>
                            {!readonly && <Typography variant="h3" className="text-center padding-b-5 margin-t-0 margin-b-15">
                                {mainTitle || 'Template Builder'}
                                <Button ref="editBtn" shouldRender={false} onClick={this.onEdit} className="btn fa fa-edit pull-right circled font-size-15 padding-5 margin-t-5 w-30 h-30"/>
                            </Typography>}
                            {!!readonly && mainTitle && <Typography variant="h3" className="text-center padding-b-5 margin-t-0 margin-b-15">
                                {mainTitle}
                            </Typography>}
                            <Divider />
                            <FormEditing state={this.state} formData={formData}/>
                            <FormReadonly state={this.state} formData={formData} readonly={readonly}/>
                        </div>
                    </Paper>
                </div> 
            </div>       
        </Grid> ;
    }
}

@observer
class FormEditing extends React.Component {

    render() {
        const {state: {editing}, formData} = this.props;
        if(!editing) return null;
        console.log('FormEditing', formData.desc, );
        return <React.Fragment key={`FormEditing`}>
            <TextField key={`FormEditing-name`} fullWidth={true} rows={1} value={formData.name} placeholder="Form Name" onChange={e => formData.name = e.target.value}/>
            <TextField key={`FormEditing-desc`} value={formData.desc} fullWidth={true} rows={1} rowsMax={10} multiline={true} placeholder="+ Add Description" onChange={e => formData.desc = e.target.value}/>
        </React.Fragment>;
    }
}

@observer
class FormReadonly extends React.Component {

    render() {
        const {state: {editing}, formData, readonly} = this.props;
        if(editing) return null;
        console.log('FormReadonly', );
        return <React.Fragment key={`FormReadonly`}>
            <Typography variant="h4">{formData.name}</Typography>
            <Typography variant="subtitle1">{formData.desc || (!readonly ? '+ Add Description' : 'No Description')}</Typography>
        </React.Fragment>;
    }
}

export default FormHeader;
