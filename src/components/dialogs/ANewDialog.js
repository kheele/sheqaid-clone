import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {Button} from '../inputs';
import Dialog from './Dialog';

import AFormDialog from './AFormDialog';

@observer
class ANewDialog extends AFormDialog {
    key = "ANewDialog";

    constructor(props, style) {
        super(props, style);
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} shouldRender={false} className="btn btn-primary cancel"
                    onClick={this.onCancel}>
                <i className="fa fa-times icon-left"/>Cancel
            </Button>
            <Button ref={ref => this.refs.submit = ref} shouldRender={false} className="btn btn-primary save"
                    onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Save
            </Button>
        </React.Fragment>;
    }

    get isOpen() {
        const {dialog} = this.refs;
        return dialog && dialog.isOpen;
    }

    componentDidMount() {
        super.componentDidMount();
        this.execWhen(() => {
            if (!this.topButtons) return false;
            return this.refs.dialog;
        }).then(dialog => {
            dialog.setTopButtons(this.topButtons);
        });
    }

    open(item) {
        if (!this.topButtonsHiddenSave) {
            this.execWhen(() => this.refs.submit).then(submit => {
                submit.show();
            });
        }

        return super.open(item);
    }

    onCancel(e, btn) {
        confirmDialog.open(<>
            Do you wish to cancel the form?
            <p>Please note your form changes will not be saved.</p>
        </>).then(res => {
            if (res === 1) {
                this.close();
            }
        });
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
            <CircularProgressWrapper dialog={this} state={this.state}/>
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

@observer
class CircularProgressWrapper extends React.Component {

    render() {
        const {dialog: {findById}, state: {item, itemToView}} = this.props;
        if (findById && itemToView && !item) {
            return <CircularProgress className="fixed-center"/>;
        }

        return null;
    }
}

export default ANewDialog;
//192
