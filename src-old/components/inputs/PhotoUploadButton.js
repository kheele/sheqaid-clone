import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from './';

import style from "./PhotoUploadButton.lazy.css";

@observer
class PhotoUploadButton extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    @observable
    state = {
        base64: null,
        path: null,
        rotating: false
    };

    constructor() {
        super();

        this.onRotate = this.onRotate.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    componentWillMount() {
        style.use();
        const {defaultValue, onChange} = this.props;
        if (defaultValue && defaultValue.dlUrls) {
            this.state.base64 = defaultValue.dlUrls[0];
            this.state.path = defaultValue;
            onChange && onChange(this.state, this.props.name, this);
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    rotateImpl() {
        this.state.rotating = true;
        const {img} = this.refs;
        const boundaryRad = Math.atan(img.width / img.height);
        this.boundaryRad = boundaryRad;
        this.degree = 90;

        const calcProjectedRectSizeOfRotatedRect = (size, rad) => {
            const {width, height} = size;

            const rectProjectedWidth = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad));
            const rectProjectedHeight = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));

            return {width: rectProjectedWidth, height: rectProjectedHeight};
        };

        const getRotatedImage = (image, angle, cb) => {
            const canvas = document.createElement('canvas');
            const {degree, rad: _rad} = angle;

            const rad = _rad || degree * Math.PI / 180 || 0;

            const {width, height} = calcProjectedRectSizeOfRotatedRect({width: image.width, height: image.height}, rad);

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.save();

            const sin_Height = image.height * Math.abs(Math.sin(rad));
            const cos_Height = image.height * Math.abs(Math.cos(rad));
            const cos_Width = image.width * Math.abs(Math.cos(rad));
            const sin_Width = image.width * Math.abs(Math.sin(rad));

            let xOrigin, yOrigin;

            if (rad < this.boundaryRad) {
                xOrigin = Math.min(sin_Height, cos_Width);
                yOrigin = 0;
            } else if (rad < Math.PI / 2) {
                xOrigin = Math.max(sin_Height, cos_Width);
                yOrigin = 0;
            } else if (rad < Math.PI / 2 + this.boundaryRad) {
                xOrigin = width;
                yOrigin = Math.min(cos_Height, sin_Width);
            } else if (rad < Math.PI) {
                xOrigin = width;
                yOrigin = Math.max(cos_Height, sin_Width);
            } else if (rad < Math.PI + this.boundaryRad) {
                xOrigin = Math.max(sin_Height, cos_Width);
                yOrigin = height;
            } else if (rad < Math.PI / 2 * 3) {
                xOrigin = Math.min(sin_Height, cos_Width);
                yOrigin = height;
            } else if (rad < Math.PI / 2 * 3 + this.boundaryRad) {
                xOrigin = 0;
                yOrigin = Math.max(cos_Height, sin_Width);
            } else if (rad < Math.PI * 2) {
                xOrigin = 0;
                yOrigin = Math.min(cos_Height, sin_Width);
            }

            ctx.translate(xOrigin, yOrigin);
            ctx.rotate(rad);

            const tmpImg = new Image();
            tmpImg.width = image.width;
            tmpImg.height = image.height;
            tmpImg.crossOrigin = "Anonymous";
            tmpImg.src = image.src;
            tmpImg.onload = () => {
                ctx.drawImage(tmpImg, 0, 0, height, width);

                ctx.restore();

                const dataURL = canvas.toDataURL('image/png');

                cb(dataURL);
            };
        };

        const render = () => {
            getRotatedImage(img, {degree: this.degree}, dataURL => {
                this.state.base64 = dataURL;
                this.state.path = dataURL;
                const {onChange} = this.props;
                onChange && onChange(this.state, this.props.name, this);
                this.state.rotating = false;
            });
        };
        
        render();
    }

    onRotate(evt, btn) {
        const {img} = this.refs;
        this.rotateImpl();
    }

    onUpload() {
        const {onChange} = this.props;
        electronDialog.showOpenDialogImage().then(res => {
            console.log(res);
            if (res) {
                this.state.base64 = null;

                const {previewPath, path} = res;
                this.state.base64 = previewPath;
                this.state.path = path;
                const {onChange} = this.props;
                onChange && onChange(this.state, this.props.name, this);
            }
        });
    }

    onClear() {
        const {onChange} = this.props;
        this.state.base64 = null;
        this.props.onChange && this.props.onChange(null, this.props.name, this);
    }

    render() {
        let {state, state: {base64, path}, props: {className, buttonTitle}} = this;
        className = "PhotoUploadButton" + (className ? (" " + className) : "");
        return <div className={className}>
            <Button className="btn btn-primary" onClick={this.onUpload}>{buttonTitle ? buttonTitle : 'Upload Picture'}</Button>
            {!!base64 && <i className="fa fa-trash" onClick={this.onClear}/>}
            {!!base64 && <div className="preview">
                <img ref="img" src={base64} className="fixed-center"/>
                <Rotating state={state}/>
                <Button className="btn btn-primary btn-rotate" onClick={this.onRotate}>Rotate</Button>
            </div>}
        </div>;
    }
}

@observer
class Rotating extends React.Component {
    render() {
        let {state: {rotating}} = this.props;
        if(!rotating) return null;
        return <div className='Rotating'>Rotating Image...</div>;
    }
}

export default PhotoUploadButton;
