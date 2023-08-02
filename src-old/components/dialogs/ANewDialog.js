import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {Button} from '../inputs';
import Dialog from './Dialog';

import AFormDialog from './AFormDialog';

@observer
class ANewDialog extends AFormDialog {

    constructor(props, style) {
        super(props, style);
    }

    componentDidMount() {
        super.componentDidMount();
        this.execWhen(() => {
            if(!this.topButtons) return false;
            return this.refs.dialog;
        }).then(dialog => {
            dialog.setTopButtons(this.topButtons);
        });
    }
    
    open(item) {
        return new Promise((resolve, reject) => {
            !!item && (this.state.item = item);
            this.onResponse = resolve;
            
            const title = isFunction(this.title) ? this.title() : this.title;
            this.refs.dialog.open(title);
            
            if(!this.topButtonsHiddenCancel) {
                this.execWhen(() => this.refs.cancel).then(cancel => {
                    cancel.show();
                });
            }
        });
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} shouldRender={false} className="btn btn-primary cancel" onClick={this.onCancel}>
                <i className="fa fa-times icon-left"/>Cancel
            </Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Save
            </Button>
        </React.Fragment>;
    }

    render() {
        let className = this.pageKey + '-new-dialog';
        !!this.className && (className += ' ' + this.className);
        const Controls = this.controls;
        return (<Dialog 
            key={this.pageKey + '-new-dialog'} 
            ref="dialog" 
            className={className} 
            noBackAction={this.noBackAction || this.props.noBackAction}  
            preventEsc={this.preventEsc || this.props.preventEsc}
            topButtons={this.topButtons} 
            onCancel={this.onCancel}
            onClose={this.onClose}
            dialog={this}
        >
            <Controls 
                ref="controls" 
                dialog={this} 
                state={this.state} 
                path={this.props.path} 
                extraProps={this.extraProps} 
                close={this.close}
                onFormGoto={this.onFormGoto} 
                onFormGotoNext={this.onFormGotoNext} 
                onFormGotoPrev={this.onFormGotoPrev} 
                onFormNext={this.onFormNext} 
                onFormBack={this.onFormBack} 
                onFormOpen={this.onFormOpen} 
                execWhen={this.execWhen} 
            />
        </Dialog>);
    }
}

export default ANewDialog;
//192