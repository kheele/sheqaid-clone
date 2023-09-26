// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import {Document} from '../documents';
import ViewDocumentDialog from '../dialogs/ViewDocumentDialog';
import {Button} from './';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AShowFile">
@observer
class AShowFile extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		loadStatus: null,
		rotating: false,

		isPDF: false,
		isWord: false,
		isExcel: false,
		isPic: false,
		isVideo: false,

		previewPath: null,
		path: null
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onUpload = this.onUpload.bind(this);
		this.onClear = this.onClear.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentWillMount">
	componentWillMount() {
		const {name, defaultValue, readonly, onChange} = this.props;
		this.setLoading();
		if (defaultValue && (defaultValue.dlUrls || defaultValue.previewPath)) {
			if (readonly && defaultValue.previewPath) {
				extendObservable(this.state, toJS(defaultValue));
			} else {
				let url = defaultValue.dlUrls[0];

//            url = createPDFPreviewUrl(url);
//            if(url instanceof Promise) {
//                url = await url.then(res => res);
//            }

				const isPDF = FileTypes.isPDF(defaultValue);
				const isWord = FileTypes.isWord(defaultValue);
				const isExcel = FileTypes.isExcel(defaultValue);
				const isPic = FileTypes.isPic(defaultValue);
				const isVideo = FileTypes.isVideo(defaultValue);

				if (isPDF) {
					this.state.previewPath = createPDFPreviewUrl(url);
				} else if (isWord || isExcel) {
					this.state.previewPath = `https://docs.google.com/gview?url=${url}&embedded=true`;
				} else if (isPic || isVideo) {
					this.state.previewPath = url;
				}

				extendObservable(this.state, {
					isPDF, isWord, isExcel, isPic, isVideo,
					path: defaultValue
				});

				onChange && onChange(this.state, name, this);
			}
		}
		this.setLoaded();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onUpload">
	onUpload() {
		const {type} = this.props;
		this.setLoading();
		electronDialog.showOpenDialogDocs(type).then(res => {
			console.log(res);
			if (res) {
				this.state.rotating = false;
				this.state.previewPath = null;

				const {
					isPDF, isWord, isExcel, isPic, isVideo,
					previewPath, path
				} = res;

				extendObservable(this.state, {
					isPDF, isWord, isExcel, isPic, isVideo,
					previewPath, path
				});

				const {onChange} = this.props;
				onChange && onChange(this.state, this.props.name, this);
			}
		}).catch(err => {
			this.setLoadedError(err);
		}).finally(() => {
			this.setLoaded();
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onClear">
	onClear() {
		const {onChange, name} = this.props;
		extendObservable(this.state, {
			isPDF: false, isWord: false, isExcel: false, isPic: false, isVideo: false,
			previewPath: null, path: null,
			rotating: false,
			loadStatus: null
		});
		onChange && onChange(null, name, this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="setLoading, setLoaded, setLoadedError">
	setLoading() {
		this.state.loadStatus = "L";
	}

	setLoaded() {
		this.state.loadStatus = "D";
	}

	setLoadedError(err) {
		this.state.loadStatus = "E";
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="isLoading, isLoaded, isLoadedError">
	@computed
	get isLoading() {
		return this.state.loadStatus === "L";
	}

	@computed
	get isLoaded() {
		return this.state.loadStatus === "D";
	}

	@computed
	get isLoadedError() {
		return this.state.loadStatus === "E";
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="isPDF, isWord, isExcel, isPic, isVideo">
	@computed
	get isPDF() {
		return this.state.isPDF;
	}

	@computed
	get isWord() {
		return this.state.isWord;
	}

	@computed
	get isExcel() {
		return this.state.isExcel;
	}

	@computed
	get isPic() {
		return this.state.isPic;
	}

	@computed
	get isVideo() {
		return this.state.isVideo;
	}

	// </editor-fold>

}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ShowOnlyIcon">
@observer
class ShowOnlyIcon extends AShowFile {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onView = this.onView.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onView">
	onView() {
		const {state} = this;
		this.refs.viewDocumentDialog.open(state);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="showTrashIcon">
	@computed
	get showTrashIcon() {
		let {
			props: {readonly},
			state: {previewPath},
			isLoaded, isLoadedError
		} = this;
		return isLoaded && !isLoadedError && !!previewPath && !readonly &&
			<i className="fa fa-trash fixed-flex" onClick={this.onClear}/>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="fileIcon">
	@computed
	get fileIcon() {
		const {
			props: {onUpload, showOnlyIcon, readonly, buttonTitle, defaultValue},
			isPDF, isWord, isExcel, isPic, isVideo,
			isLoading, isLoadedError
		} = this;
		if (!showOnlyIcon)
			return null;

		if (isLoading) {
			return <i className={"fa fa-spinner fixed-flex flex"}>
				<span>Loading...</span>
			</i>;
		}
		if (isLoadedError) {
			return <i className={"fa fa-file-pdf-o fixed-flex flex"}>
				<span>Error Loading</span>
			</i>;
		}

		if (isPDF) {
			return <i className={"fa fa-file-pdf-o fixed-flex flex"}>
				<span>PDF Document</span>
				{this.showTrashIcon}
				<Button className="btn btn-primary fixed-flex" onClick={this.onView}>View</Button>
				{!readonly && <Button className="btn btn-primary fixed-flex" onClick={this.onUpload}>Change</Button>}
			</i>;
		} else if (isWord) {
			return <i className={"fa fa-file-word-o fixed-flex flex"}>
				<span>Word Document</span>
				{this.showTrashIcon}
				<Button className="btn btn-primary fixed-flex" onClick={this.onView}>View</Button>
				{!readonly && <Button className="btn btn-primary fixed-flex" onClick={this.onUpload}>Change</Button>}
			</i>;
		} else if (isExcel) {
			return <i className={"fa fa-file-excel-o fixed-flex flex"}>
				<span>Spreadsheet Document</span>
				{this.showTrashIcon}
				<Button className="btn btn-primary fixed-flex" onClick={this.onView}>View</Button>
				{!readonly && <Button className="btn btn-primary fixed-flex" onClick={this.onUpload}>Change</Button>}
			</i>;
		} else if (isPic) {
			return <i className={"fa fa-file-image fixed-flex flex"}>
				<span>Photo Document</span>
				{this.showTrashIcon}
				<Button className="btn btn-primary fixed-flex" onClick={this.onView}>View</Button>
				{!readonly && <Button className="btn btn-primary fixed-flex" onClick={this.onUpload}>Change</Button>}
			</i>;
		} else if (isVideo) {
			return <i className={"fa fa-file-video fixed-flex flex"}>
				<span>Video Document</span>
				{this.showTrashIcon}
				<Button className="btn btn-primary fixed-flex" onClick={this.onView}>View</Button>
				{!readonly && <Button className="btn btn-primary fixed-flex" onClick={this.onUpload}>Change</Button>}
			</i>;
		} else if (!readonly) {
			return <i className={"fa fa-file-upload fixed-flex flex"}>
				<span>{buttonTitle ? buttonTitle : 'Upload File'}</span>
				<Button className="btn btn-primary fixed-flex min-w-70" onClick={this.onUpload}>Upload</Button>
			</i>;
		} else if (readonly && !defaultValue) {
			return <div>
				{/*<label>{buttonTitle ? buttonTitle : 'File'}</label>*/}
				<div class="value">N/A</div>
			</div>;
		}
		return null;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		let {
			props: {readonly, showDownload, fileName, title, buttonTitle, className, showOnlyIcon},
			state: {previewPath},
			isPDF, isWord, isExcel, isPic, isVideo,
			fileIcon,
			isLoaded, isLoadedError
		} = this;

		if (!showOnlyIcon)
			return null;

		className = "UploadButton ShowOnlyIcon clearable-field-control grid-1 form-control" + (className ? (" " + className) : "");

		if (fileIcon) {
			className += " file-icon";
		}

		let type;
		if (isPDF) {
			type = 'PDF ';
		} else if (isWord) {
			type = 'Word ';
		} else if (isExcel) {
			type = 'Spreadsheet ';
		} else if (isPic) {
			type = 'Photo ';
		} else if (isVideo) {
			type = 'Video ';
		}
//UploadButton clearable-field-control form-control w-340 pull-left margin-t-0
		return <div className={className} style={{background: "#fafafa"}}>
			{readonly && (title || buttonTitle) && <label
				style={{
					height: "32px",
					background: "#f9f9f9",
					padding: "0 10px",
					display: "flex",
					alignItems: "center",
					fontSize: "14px",
					color: "#777",
				}}
			>{title || buttonTitle}</label>}
			{fileIcon}
			<ViewDocumentDialog ref="viewDocumentDialog" title={type + "Document"} showDownload={showDownload}
			                    fileName={fileName}/>
		</div>;
	}

	// </editor-fold>
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ShowFile">
@observer
class ShowFile extends AShowFile {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onRotate = this.onRotate.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onRotate">
	onRotate(evt, btn) {
		rotateImpl.call(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		let {
			props: {
				readonly, className, buttonTitle, showOnlyIcon
			},
			state, state: {previewPath},
			isPDF, isWord, isExcel, isPic, isVideo,
			isLoading, isLoadedError
		} = this;

		if (showOnlyIcon)
			return null;

		className = "UploadButton ShowFile " + (className ? (" " + className) : "");

		if (isLoading) {
			return <div className={className}>
				<i className={"fa fa-spinner fixed-flex flex"}>
					<span>Loading...</span>
				</i>
			</div>;
		}
		if (isLoadedError) {
			return <div className={className}>
				<i className={"fa fa-file-pdf-o fixed-flex flex"}>
					<span>Error Loading</span>
				</i>
			</div>;
		}

		if (isPDF || isWord || isExcel) {
			return <div className={className}>
				{!readonly && <>
					<Button
						className="btn btn-primary"
						onClick={this.onUpload}>
						{buttonTitle ? buttonTitle : 'Upload File'}
					</Button>
					{!!previewPath && <i className="fa fa-trash" onClick={this.onClear}/>}
				</>}
				{!!previewPath && <div className={"preview" + (readonly ? " readonly" : "")}>
					<Document previewPath={previewPath} className="fixed-center"/>
				</div>}
			</div>;
		} else if (isPic) {
			return <div className={className}>
				{!readonly && <>
					<Button
						className="btn btn-primary"
						onClick={this.onUpload}>
						{buttonTitle ? buttonTitle : 'Upload File'}
					</Button>
					{!!previewPath && <i className="fa fa-trash" onClick={this.onClear}/>}
				</>}
				{(!!previewPath) && <div className={"preview" + (readonly ? " readonly" : "")}>
					<img ref="img" src={previewPath} className="fixed-center"/>
					<Rotating state={state}/>
					<Button className="btn btn-primary btn-rotate" onClick={this.onRotate}>Rotate</Button>
				</div>}
			</div>;
		} else if (isVideo) {
			return <div className={className}>
				{!readonly && <>
					<Button
						className="btn btn-primary"
						onClick={this.onUpload}>
						{buttonTitle ? buttonTitle : 'Upload File'}
					</Button>
					{!!previewPath && <i className="fa fa-trash" onClick={this.onClear}/>}
				</>}
				{(!!previewPath) && <div className={"preview" + (readonly ? " readonly" : "")}>
					<video ref="video" src={previewPath} className="fixed-center" autoplay/>
				</div>}
			</div>;
		} else if (!readonly) {
			return <div className={className}>
				<Button className="btn btn-primary" onClick={this.onUpload}>{buttonTitle ? buttonTitle : 'Upload File'}</Button>
			</div>;
		}
		return null;
	}

	// </editor-fold>
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Rotating">
@observer
class Rotating extends React.Component {
	render() {
		let {state: {rotating}} = this.props;
		if (!rotating)
			return null;
		return <div className='Rotating'>Rotating Image...</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="rotateImpl">
function rotateImpl() {
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
			this.state.previewPath = dataURL;
			this.state.path = dataURL;
			const {onChange} = this.props;
			onChange && onChange(this.state, this.props.name, this);
			this.state.rotating = false;
		});
	};

	render();
}

// </editor-fold>

export {ShowOnlyIcon, ShowFile};
