// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import * as faceapi from 'face-api.js';

import {execWhen} from '../../utils/Utils';
import {Button, Clickable} from '../inputs';

//faceapi.env.monkeyPatch({
//    Canvas: HTMLCanvasElement,
//    Image: HTMLImageElement,
//    ImageData: ImageData,
//    Video: HTMLVideoElement,
//    createCanvasElement: () => document.createElement('canvas'),
//    createImageElement: () => document.createElement('img')
//});
faceapi.env.setEnv(faceapi.env.createBrowserEnv());
// </editor-fold>

@observer
class CapturedImgView extends React.Component {
    
    @observable src;
    
    constructor(props) {
        super(props);
        
        this.onCancel = this.onCancel.bind(this);
    }
    
    set src(val) {
        this.src = val;
//        execWhen(() => this.refs.img).then(img => {
//            $(img).addClass('active');
//        });
        console.log('faceImgSrc', val)
    }
    
    onCancel() {
        this.src = null;
        this.props.onCancel && this.props.onCancel();
    }
    
    get imgSrc() {
        return this.src;
    }
    
    render() {
        if(!this.src) return null;
        return <div className="CapturedImgView fixed-center">
            <img ref="img" src={this.src}/>
            <Button className="btn btn-primary pull-left" text="Cancel" onClick={this.onCancel}/>
            <Button className="btn btn-primary pull-right" text="Submit" onClick={this.props.onSubmit}/>
        </div>;
    }
}

const loadFaceModels = function() {
    return Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('models'),
        //detectors
//        faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('models'),
//        faceapi.nets.mtcnn.loadFromUri('models'),
        //others
//        faceapi.nets.faceLandmark.loadFromUri('/models'),
//        faceapi.nets.faceLandmarkTinyModel.loadFromUri('/models'),
//        faceapi.nets.faceRecognition.loadFromUri('/models'),
//        faceapi.nets.faceExpression.loadFromUri('/models')
    ]).catch(err => {
        return loadFaceModels();
    });

//        Promise.all([
//            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
//        ]).then(() => {
//            this.state.modelsLoaded = true;
//        });
};

const startVideo = async function(evt, btn) {
    if(btn) {
        const {action} = btn.props;
        this.isTryAgain = action === "try-again";
        if(this.isTryAgain) {
            infoDialog.close();
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
    }
    execWhen(() => this.refs.video || this.refs.biometricView).then(() => {
        let {biometricView = {}, video} = this.refs;
        const {refs = {}} = biometricView;
        video = video || refs.video;
        video.play();
        navigator.getUserMedia({video: {}}, stream => {
            if (video.mozSrcObject !== undefined) {
                video.mozSrcObject = stream;
            } else {
                video.srcObject = stream;
            }
        }, err => {
            infoDialog.open(<div className="text-left">
                The device camera couldn't be accessed.<br/><br/>
                Please make sure:<br/><br/>
                1) No other software like Microsoft Teams,<br/>
                TeamViewer, etc is currently using the device<br/>camera<br/>
                2) The device has a working camera<br/>
                3) The device is connected to a working camera<br/>
                4) You have allowed this application to use your<br/> device camera<br/><br/>
                Please make sure the above requirements are<br/>satisfied then <Clickable action="try-again" onClick={this.startVideo}>
                    <a href="#">Try Again</a>
                </Clickable>
            </div>).then(() => {
                if(!this.isTryAgain) {
                    let {dialog} = this.props;
                    if(!dialog) {
                        dialog = this.refs.dialog;
                    }

                    if(dialog) {
                        dialog.close();
                    }
                }
                delete this.isTryAgain;
            });       
            console.error(err);
        });
    });
};

const onVideoPlay = function() {
    let {biometricView = {}, video, videoContainer} = this.refs;
    const {refs = {}} = biometricView;
    video = video || refs.video;
    videoContainer = videoContainer || refs.videoContainer;

    execWhen(() => {
        try {
            return faceapi.createCanvasFromMedia(video);
        } catch (ex) {
            return false;
        }
    }).then(canvas => {
        videoContainer.append(canvas);

        const {width, height} = video;
        const displaySize = {width, height};
        faceapi.matchDimensions(canvas, displaySize);

        this.detect(canvas, displaySize);
    });
};

const detect = async function(canvas, displaySize) {
    let {biometricView = {}, video} = this.refs;
    const {refs = {}} = biometricView;
    video = video || refs.video;
    if(!video) {
        clearTimeout(this.detectTO);
        return;
    }

//    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
//    const detection = await faceapi.detectSingleFace(video, new faceapi.SsdMobilenetv1Options({minConfidence: 0.6})).withFaceLandmarks().withFaceDescriptor();
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({inputSize: 608, scoreThreshold: 0.5})).withFaceLandmarks().withFaceDescriptor();
//    const detection = await faceapi.detectSingleFace(video, new faceapi.MtcnnOptions({scaleFactor: 0.6})).withFaceLandmarks().withFaceDescriptor();
//    console.log('detection', detection)
    if (detection) {
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        const {width, height} = canvas;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);

        faceapi.draw.drawDetections(canvas, resizedDetection);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

        this.currFaceBox = detection.detection.box;
        this.currFaceDescriptor = resizedDetection.descriptor;
        this.currDisplaySize = displaySize;
    }
    
    this.detectTO = setTimeout(() => this.detect(canvas, displaySize), 100);
};

const onCaptureFace = async function() {
    if (!this.currFaceBox)
        return;
    const {currFaceBox: box, currFaceDescriptor, currDisplaySize} = this;
    let {biometricView = {}, video, capturedImgView, videoContainer} = this.refs;
    const {refs = {}} = biometricView;
    video = video || refs.video;
    videoContainer = videoContainer || refs.videoContainer;
    capturedImgView = capturedImgView || refs.capturedImgView;
    this.isSendingUserImage = true;

    const regionsToExtract = [new faceapi.Rect(box.x - 50, box.y - 100, box.width + 100, box.height + 100)];

    const faceImages = await faceapi.extractFaces(video, regionsToExtract);
    capturedImgView.src = faceImages[0].toDataURL('image/png');
    capturedImgView.faceDescriptor = currFaceDescriptor;
    capturedImgView.displaySize = currDisplaySize;
    
//    stop.call(this);
};

const stop = function() {
    if (this.detectTO) {
        clearTimeout(this.detectTO);
        this.detectTO = null;
    }
    let {biometricView = {}, video} = this.refs;
    const {refs = {}} = biometricView;
    video = video || refs.video;
    if (video) {
        const mediaStream = video.srcObject;
        if (mediaStream) {
            const tracks = mediaStream.getTracks();
            tracks.forEach(track => track.stop());
        }
        video.pause();
        video.currentTime = 0;
    }
};

const onUnmount = function() {
    stop.call(this);

    this.state.modelsLoaded = false;
};

export {CapturedImgView, loadFaceModels, startVideo, onVideoPlay, detect, onCaptureFace, onUnmount};
