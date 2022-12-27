import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button, PhotoUploadButton} from '../inputs';
import Dialog from '../dialogs/Dialog';

import style from "./UploadDialog.lazy.css";

@observer
class UploadDialog extends React.Component {

    onResponse;
    @observable state = {
        image: null
    };

    constructor(props) {
        super(props);

        this.onChangeImage = this.onChangeImage.bind(this);

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

    onChangeImage(value, name, el) {
        this.state.image = value;
    }

    open() {
        return new Promise((resolve, reject) => {
            this.onResponse = resolve;
            this.refs.dialog.open(this.title);
        });
    }

    close() {
        this.refs.dialog.close();
    }

    onCancel(e, btn) {
        this.close();
    }

    onDone(e, btn) {
        const {image} = this.state;
        if (image) {
            this.onResponse(image);
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
        return (<Dialog
            key='UploadDialog'
            ref="dialog"
            className='UploadDialog'
            topButtons={this.topButtons}
            dialog={this}
        >
            <PhotoUploadButton onChange={this.onChangeImage}/>
        </Dialog>);
    }
}

export default UploadDialog;
