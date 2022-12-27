import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {execWhen} from '../../utils/Utils';
import {Button, UploadButton} from '../inputs';
import Dialog from '../dialogs/Dialog';

import style from "./UploadDialog.lazy.css";

@observer
class UploadDialog extends React.Component {
    
    onResponse;
    @observable state = {
        file: null,
        type: null
    };

    constructor(props) {
        super(props);

        this.onChangeFile = this.onChangeFile.bind(this);
        
        this.onCancel = this.onCancel.bind(this);
        this.onDone = this.onDone.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onChangeFile(value, name, el) {
        this.state.file = value;
    }

    open(type) {
        this.state.type = type;
        return new Promise((resolve, reject) => {
            this.onResponse = resolve;
            execWhen(() => this.refs.dialog).then(dialog => {
                dialog.open(this.title);
            });
        });
    }

    close() {
        this.state.file = null;
        this.state.type = null;
        this.refs.dialog.close();
    }

    onCancel(e, btn) {
        this.close();
    }

    onDone(e, btn) {
        const {file} = this.state;
        if(file) {
            this.onResponse(file);
            this.close();
        } else {
            infoDialog.open("Please select a file");
        }
    }

    get topButtons() {
        return <React.Fragment>
            <Button ref="reset" className="btn btn-primary reset" onClick={this.onCancel}>Cancel</Button>
            <Button ref="submit" className="btn btn-primary save" onClick={this.onDone}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }

    render() {
        const {type} = this.state; 
        if(!type) return null;
        return (<Dialog
            key={new Date().getTime()}
            ref="dialog"
            className='UploadDialog'
            topButtons={this.topButtons}
            dialog={this}
        >
            <UploadButton 
                buttonTitle={`Upload ${(type || []).join(', ')}`} 
                type={type}
                showOnlyIcon 
                className="hor-center"
                onChange={this.onChangeFile}
            />
        </Dialog>);
    }
}

export default UploadDialog;
