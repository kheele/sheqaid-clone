import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Grid, Paper, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import {execWhen} from '../../utils/Utils';
import {Button} from '../inputs';

import style from './FormHeader.lazy.css';

@observer
class FormHeader extends React.Component {
    
    @observable editing = true;
    
    constructor(props) {
        super(props);
        
        this.onEdit = this.onEdit.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentDidMount(){
        const {readonly} = this.props;
        this.editing = !readonly;
        
        execWhen(() => this.refs.secReadonly && this.refs.secEditting).then(() => {
            const {secReadonly, secEditting} = this.refs;

            if(readonly) {
                secReadonly.show();
                secEditting.hide();
            } else {
                secReadonly.hide();
                secEditting.show();
            }
        });
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    onToggleImpl() {
        const {secReadonly, secEditting} = this.refs;
        
        if(this.editing) {
            secReadonly.show();
            secEditting.hide();
        } else {
            secReadonly.hide();
            secEditting.show();
        }
    }
    
    onEdit(e, btn){
        this.onToggleImpl();
        this.editing = true;
        btn.hide();
    }
    
    onToggle({target: {nodeName}}) {
        const {formData, readonly} = this.props;
        if(readonly) return;
        nodeName = nodeName.toLowerCase();
        if(nodeName === "input" || nodeName === "textarea" || nodeName === "button") return;
        if(!formData.name || formData.name.isEmpty()) return;
        
        this.onToggleImpl();
        this.editing = !this.editing;
        
        this.refs.editBtn.toggle();
    }
    
    render() {
        const {formData, formData: {questions}, readonly} = this.props;
        return <Grid className="FormHeader" onClick={this.onToggle}>
           <div>
                <div>
                    <Paper elevation={2}>
                        <div>
                            {!readonly && <Typography variant="h3" className="text-center padding-b-5 margin-t-0 margin-b-15">
                                Template Builder
                                <Button ref="editBtn" shouldRender={false} onClick={this.onEdit} className="btn fa fa-edit pull-right circled font-size-15 padding-5 margin-t-5 w-30 h-30"/>
                            </Typography>}
                            <Divider />
                            <SecReadonly ref="secReadonly" formData={formData}/>
                            <SecEditting ref="secEditting" formData={formData}/>
                            
                            {readonly && <Divider className="margin-t-5 margin-b-5"/>}
                            {readonly && <Typography variant="subtitle1" className="text-center margin-t-0 margin-b-0">{questions.length} question(s)</Typography>}
                            {readonly && <Typography variant="subtitle1" className="text-center margin-t-0 margin-b-0">{questions.filter(q => q.answer).length} answer(s)</Typography>}
                        </div>
                    </Paper>
                </div> 
            </div>       
        </Grid> ;
    }
}

@observer
class ASec extends React.Component {
    
    @observable editing = true;
    
    constructor(props) {
        super(props);
    }
    
    show() {
        this.editing = true;
    }
    
    hide() {
        this.editing = false;
    }
    
}

@observer
class SecReadonly extends ASec {
    
    render() {
        if(!this.editing) return null;
        
        const {formData} = this.props;
        return <React.Fragment>
            <Typography variant="h4">{formData.name}</Typography>
            <Typography variant="subtitle1">{formData.desc}</Typography>    
        </React.Fragment>;
    }
}

@observer
class SecEditting extends ASec {
    
    render() {
        if(!this.editing) return null;
        
        const {formData} = this.props;
        return <React.Fragment>
            <TextField value={formData.name} placeholder="Form Name" onChange={e => formData.name = e.target.value}/>
            <TextField value={formData.desc} fullWidth={true} rows={1} rowsMax={10} multiline={true} placeholder="Form Description" onChange={e => formData.desc = e.target.value}/>   
        </React.Fragment>;
    }
}

export default FormHeader;
