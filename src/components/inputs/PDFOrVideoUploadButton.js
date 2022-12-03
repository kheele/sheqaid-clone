import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Document} from '../documents';
import {Button} from './';

import style from "./PDFOrVideoUploadButton.lazy.css";

@observer
class PDFOrVideoUploadButton extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    @observable
    state = {
        thumbnail: null,
        base64: null,
        docState: null,
        path: null
    };

    constructor() {
        super();

        this.onCaptureFrame = this.onCaptureFrame.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    componentWillMount() {
        style.use();
        const {defaultValue, onChange} = this.props;
        if(defaultValue && defaultValue.dlUrls) {
            this.state.docState = {doc: {previewPath: createPDFPreviewUrl(defaultValue.dlUrls[0])}};//for pdf
            this.state.base64 = defaultValue.dlUrls[0];//for vid
            this.state.path = defaultValue;
            onChange && onChange(this.state, this.props.name, this);
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    onCaptureFrame() {
        const {video} = this.refs;
        
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        
        const initCanvas = function (e) {
            canvas.width = this.videoWidth;
            canvas.height = this.videoHeight;
        };
        
        const drawFrame = function(e) {
            video.pause();
            ctx.drawImage(video, 0, 0);
            /* 
             this will save as a Blob, less memory consumptive than toDataURL
             a polyfill can be found at
             https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
             */
            canvas.toBlob(function(blob) {
                console.log(blob)
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    this.state.thumbnail = JSON.stringify(Array.from(new Uint8Array(event.target.result)));
                    console.log(Array.from(new Uint8Array(event.target.result)))
                    
                    this.props.onChange && this.props.onChange(this.state, this.props.name, this);
                    video.removeEventListener('loadedmetadata', initCanvas);
                    video.removeEventListener('timeupdate', drawFrame);
                };
                fileReader.readAsArrayBuffer(blob);
            }.bind(this), 'image/jpeg');
        }.bind(this);

        video.muted = true;
        video.addEventListener('loadedmetadata', initCanvas, false);
        video.addEventListener('timeupdate', drawFrame, false);

        video.play();
    }

    onUpload() {
        electronDialog.showOpenDialogDocOrVideo().then(res => {
            console.log(res);
            if (res) {
                this.state.base64 = null;
                this.state.docState = null;

                const {isPDF, previewPath, path} = res;
                this.state.path = path;
                if (isPDF) {
                    this.state.docState = {doc: {previewPath}};
                    const {onChange} = this.props; 
                    onChange && onChange(this.state, this.props.name, this);
                } else {
                    this.state.base64 = previewPath;
                    setTimeout(this.onCaptureFrame, 0);
                }
            }
        });
    }

    onClear() {
        const {onChange} = this.props; 
        this.state.thumbnail = null;
        this.state.base64 = null;
        this.state.docState = null;
        this.props.onChange && this.props.onChange(null, this.props.name, this);
    }

    @computed
    get isVideo() {
        let {state: {base64, docState, path}} = this;
        return (!docState && !!base64);
    }

    @computed
    get isPDF() {
        let {state: {base64, docState}} = this;
        return (!base64 && !!docState);
    }

    @computed
    get hasFile() {
        let {state: {base64, docState}} = this;
        return (!!base64 || !!docState);
    }

    render() {
        let {isVideo, isPDF, hasFile, state: {base64, docState}, props: {className, buttonTitle}} = this;
        className = "PDFOrVideoUploadButton" + (isVideo ? ' video' : isPDF ? ' pdf' : '') + (className ? (" " + className) : "");
        return <div className={className}>
            <Button className="btn btn-primary" onClick={this.onUpload}>{buttonTitle ? buttonTitle : 'Upload PDF Document / Picture'}</Button>
            {hasFile && <i className="fa fa-trash" onClick={this.onClear}/>}
            {isVideo && <div className="preview"><video ref="video" src={base64} controls className="fixed-center"/></div>}
            {isPDF && <div className="preview"><Document state={docState} className="fixed-center"/></div>}
        </div>;
    }
}

export default PDFOrVideoUploadButton;
