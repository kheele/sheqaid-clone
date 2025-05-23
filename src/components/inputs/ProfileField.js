import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {Dates, execWhen} from '../../utils/Utils';
import {Button} from './';
import SignatureCanvas from 'react-signature-canvas';

import PDFUploadButton from './PDFUploadButton.js';

import ErrorBoundary from '../ErrorBoundary';

import style from "./ProfileField.lazy.css";
import {insertErrorReporting} from "mutations/createWithCustomArgs";

@observer
class ProfileField extends React.Component {

    @observable
    state = {
        editing: false, title: null, placeholder: null
    };

    constructor() {
        super();

        this.setEditable = this.setEditable.bind(this);
    }

    get isPDFJS() {
        const {docViewer} = this.props;
        return docViewer && isString(docViewer) && docViewer.toLowerCase() === "pdfjs";
    }

    get isDoc() {
        let {value, type} = this.props;
        if (type === 'file' && value && value.dlUrls && value.dlUrls[0]) {
            value = value.dlUrls[0];
            return value.contains('.pdf') || value.contains('.docx') || value.contains('.doc');
        }
    }

    get isPDF() {
        let {value, type} = this.props;
        if (type === 'file' && value && value.dlUrls && value.dlUrls[0]) {
            value = value.dlUrls[0];
            return value.contains('.pdf');
        }
    }

    get isWord() {
        let {value, type} = this.props;
        if (type === 'file' && value && value.dlUrls && value.dlUrls[0]) {
            value = value.dlUrls[0];
            return value.contains('.docx') || value.contains('.doc');
        }
    }

    @computed get hasValue() {
        let {value, defaultValue, values, type} = this.props;
        return value || defaultValue;
    }

    get renderSignatureCanvas() {
        const canvasProps = {width: 'auto', height: 80, className: 'sigCanvas'};
        return <SignatureCanvas
            ref="signature"
            name="signaturePicker"
            penColor='green'
            canvasProps={canvasProps}
        />;
    }

    componentWillMount() {
        style.use();
        let {title, placeholder} = this.props;
        this.state.title = title;
        this.state.placeholder = placeholder;
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.type === 'signature' && this.props.value) {
                const value = this.props.value[0];
                this.refs.signature.fromData(value);
                this.refs.signature.off();
            }
        }, 0);
        if (this.isDoc) {
            if (this.isPDFJS) {
                return;
            }
            execWhen(() => this.refs.iframe).then(iframe_ref => {
                let {value} = this.props;
                const remotePath = value.gcsUri;
                workers.emit("default/docs/doc/view", remotePath).then(res => {
                    //              iframe_ref.src = `https://docs.google.com/document/d/${res.data.id}/edit?usp=drivesdk`;
                    iframe_ref.src = `https://docs.google.com/document/d/${res.data.id}/preview`;
                });
            });
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    setTitle(title) {
        this.state.title = title;
        return this;
    }

    setPlaceholder(placeholder) {
        this.state.placeholder = placeholder;
        return this;
    }

    setEditable(val) {
        this.state.editing = val;
    }

    getErrorBoundaryProps(title, className) {
        return {title, className};
    }

    render() {
        let {title, placeholder} = this.state;
        let {
            value,
            defaultValue,
            renderer,
            rendered,
            values,
            type,
            docViewer,
            autoplay,
            onChange,
            className,
            required
        } = this.props;
        if ('rendered' in this.props && !rendered) return null;
        title = title || placeholder;
        if (!className) {
            className = "col-lg-6";
        }
        if (!className.contains('col-')) {
            className += " col-lg-6";
        }

        try {
            value = value || defaultValue;

            if (!value) {
                value = <div className="no-value">Not Available</div>;
            } else {
                if (type === 'video' && value.video) {
                    if (value.video.dlUrls)
                        value = value.video.dlUrls[0];
                    value = <div className="value file">
                        <video src={value} controls autoPlay={autoplay}/>
                    </div>;
                } else if (type === 'file') {
                    if (this.isDoc) {
                        className += " pdf doc";
                        if (this.isPDFJS || this.isPDF) {
                            value = <div className="value file">
                                <PDFUploadButton defaultValue={value} readonly/>
                            </div>;
                        } else {
                            value = <div className="value file">
                                <iframe ref="iframe" sandbox="allow-scripts allow-same-origin" width="100%"
                                        height="100%" frameBorder="0" padding="0"/>
                            </div>;
                        }
                    } else {
                        let dlUrls;
                        if (value.dlUrls)
                            dlUrls = value.dlUrls[0];
                        className += " img";
                        value = <div className="value file">
                            <img src={dlUrls}/>
                        </div>;
                    }
                } else if (type === "date") {
                    if (isObject(value) && ('date_from' in value || 'date_to' in value)) {
                        let {date_from, date_to} = value;
                        date_from = Dates.formatDate(date_from);
                        date_to = Dates.formatDate(date_to);
                        value = <div className="value flex date-range">
                            <span className="flex">
                                <span className="fixed-flex">From</span>
                                {date_from || 'N/A'}
                            </span>
                            <span className="fixed-flex">-</span>
                            <span className="flex">
                                <span className="fixed-flex">To</span>
                                {date_to || 'N/A'}
                            </span>
                        </div>;
                    } else {
                        value = Dates.formatDate(value);
                        value = <div className="value">
                            {renderer ? renderer(value) : value}
                        </div>;
                    }
                } else if (type === "signature") {
                    value = <div className="value signature">
                        {this.renderSignatureCanvas}
                    </div>;
                } else {
                    let val;
                    if (renderer) {
                        val = renderer(value);
                    } else {
                        val = (isArray(value) || isObservableArray(value)) ? value.join(', ') : value;
                    }
                    value = <div className="value">
                        {val}
                    </div>;
                }
            }

            return <ErrorBoundary
                CustomErrorBoundary={CustomErrorBoundary}
                customErrorBoundaryProps={this.getErrorBoundaryProps(title, className)}
            >
                <div className={"ProfileField " + className}>
                    <div>
                        {title && <label>{title}</label>}
                        {value}
                    </div>
                </div>
            </ErrorBoundary>;
        } catch (err) {
            return <CustomErrorBoundary error={err} title={title} className={className}/>;
        }
    }
}

@observer
class CustomErrorBoundary extends React.Component {

    constructor() {
        super();

        this.onReport = this.onReport.bind(this);
    }

    onReport(e, btn) {
        const {error, errorInfo} = this.props;
        insertErrorReporting({error, errorInfo}).finally(() => {
            btn.text("Report Problem").enabled();
        });
    }

    render() {
        const {title, className, onReport} = this.props;
        return <div className={"ProfileField error " + className}>
            <div>
                {title && <label>{title}</label>}
                <p>An error occurred in this field</p>
                <Button className="btn btn-primary hor-center" text="Report Problem"
                        onClick={onReport || this.onReport}/>
            </div>
        </div>;
    }
}

export default ProfileField;
