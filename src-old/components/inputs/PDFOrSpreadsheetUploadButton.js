import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Document} from '../documents';
import {Button} from './';

import style from "./PDFOrSpreadsheetUploadButton.lazy.css";

@observer
class PDFOrSpreadsheetUploadButton extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    @observable
    state = {
        docState: null,
        path: null
    };

    constructor() {
        super();

        this.onUpload = this.onUpload.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    componentWillMount() {
        style.use();
        const {defaultValue, onChange} = this.props;
        if(defaultValue && defaultValue.dlUrls) {
            this.state.docState = {doc: {previewPath: createPDFPreviewUrl(defaultValue.dlUrls[0])}};
            this.state.path = defaultValue;
            onChange && onChange(this.state, this.props.name, this);
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    onUpload() {
        electronDialog.showOpenDialogPDFOrSpreadsheet().then(res => {
            console.log(res);
            if(res) {
                this.state.docState = null;

                const {previewPath, path} = res;
                this.state.docState = {doc: {previewPath}};

                this.state.path = path;
                const {onChange} = this.props; 
                onChange && onChange(this.state, this.props.name, this);
            }
        });
    }

    onClear() {
        const {onChange} = this.props; 
        this.state.docState = null;
        this.props.onChange && this.props.onChange(null, this.props.name, this);
    }

    render() {
        let {state: {docState, path}, props: {className, buttonTitle}} = this;
        className = "PDFOrSpreadsheetUploadButton" + (className ? (" " + className) : "");
        return <div className={className}>
            <Button className="btn btn-primary" onClick={this.onUpload}>{buttonTitle ? buttonTitle : 'Upload PDF / Spreadsheet Document'}</Button>
            {!!docState && <i className="fa fa-trash" onClick={this.onClear}/>}
            {!!docState && <div className="preview"><Document state={docState} className="fixed-center"/></div>}
        </div>;
    }
}

export default PDFOrSpreadsheetUploadButton;
