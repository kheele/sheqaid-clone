// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import {Divider, MenuItem, Select, TextField, Typography} from '@material-ui/core';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import IconButton from '@material-ui/core/IconButton';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import Preview from './Preview';

import style from './Details.lazy.css';
import updateQuestion from "mutations/all/Questionnaires/Questions/updateQuestion";
import updateQuestionOption from "mutations/all/Questionnaires/QuestionOptions/updateQuestionOption";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Details">
@observer
class Details extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.handleQuestionType = this.handleQuestionType.bind(this);//
		this.handleQuestionValue = this.handleQuestionValue.bind(this);//
		this.handleQuestionMaxScore = this.handleQuestionMaxScore.bind(this);//
		this.uploadImage = this.uploadImage.bind(this);//
		this.removeImage = this.removeImage.bind(this);//
		this.uploadOptionImage = this.uploadOptionImage.bind(this);
		this.removeOptionImage = this.removeOptionImage.bind(this);
	}
	
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount() {
		style.unuse();
	}
	
	// <editor-fold defaultstate="collapsed" desc="handleQuestionType">
	handleQuestionType(evt) {
		const {readonly} = this.props;
		if (readonly) return;
		
		const {value: questionType} = evt.target;
		const {isEditting, idx, ques} = this.props;
		
		switch (questionType) {
			case "Short Answer":
			case "Paragraph":
			case "Date":
			case "Time":
				delete ques.options;
				break;
			case "Multiple Choice":
			case "Checkboxes":
			case "Dropdown":
				extendObservable(ques, {options: [{optionText: "Option 1", optionImage: null, optionType: null}]});
				break;
			case "Person":
			case "Asset":
			case "Signature":
			case "Document":
			case "Photo":
			case "NoAnswer":
				delete ques.options;
				break;
			case "Safe,At Risk,N/A":
			case "Good,Fair,Poor,N/A":
			case "Pass,Fail,N/A":
			case "Yes,No,N/A":
			case "Compliant,Non-Compliant,N/A":
				delete ques.options;
				break;
//            case "Linear Scale":
//            case "Multiple Choice Grid":
//            case "Checkbox Grid":
//                extendObservable(ques, {options: [{optionText: "Option 1", optionImage: null}]});
//                break;
		}
		
		if(isEditting && ques.id) {
			updateQuestion({id: ques.id, questionType}).then(() => {
				ques.questionType = questionType;
			});
		} else {
			ques.questionType = questionType;
		}
	}
	
	// </editor-fold>
	
	//<editor-fold desc="handleQuestionValue">
	handleQuestionValue(evt) {
		const {readonly} = this.props;
		if (readonly) return;
		
		const {value: questionText} = evt.target;
		const {isEditting, idx, ques} = this.props;
		
		if(isEditting && ques.id) {
			updateQuestion({id: ques.id, questionText}).then(() => {
				extendObservable(ques, {questionText});
			});
		} else {
			extendObservable(ques, {questionText});
		}
	}
	
	//</editor-fold>
	
	//<editor-fold desc="handleQuestionMaxScore">
	handleQuestionMaxScore(evt) {
		const {readonly} = this.props;
		if (readonly) return;
		
		let {value: maxScore} = evt.target;
		const {isEditting, idx, ques} = this.props;
		
		maxScore = parseInt(maxScore);
		if (maxScore < 0) {
			maxScore = 0;
		}
		
		if(isEditting && ques.id) {
			updateQuestion({id: ques.id, maxScore}).then(() => {
				extendObservable(ques, {maxScore});
			});
		} else {
			extendObservable(ques, {maxScore});
		}
	}
	
	//</editor-fold>
	
	uploadImage() {
		const {isEditting, onUploadDialog} = this.props;
		onUploadDialog(['Photo']).then(questionImage => {
			if (questionImage) {
				const {ques, idx} = this.props;
				
				if(isEditting && ques.id) {
					updateQuestion({id: ques.id, questionImage}).then(() => {
						extendObservable(ques, {questionImage});
					});
				} else {
					extendObservable(ques, {questionImage});
				}
			}
		});
	}
	
	uploadOptionImage(option) {
		const {isEditting, ques, onUploadDialog} = this.props;
		onUploadDialog(['Photo']).then(optionImage => {
			if(optionImage) {
				if (isEditting && option.id) {
					updateQuestionOption({id: option.id, optionImage}).then(() => {
						extendObservable(option, {optionImage});
					});
				} else {
					extendObservable(option, {optionImage});
				}
			}
		});
	}
	
	removeImage() {
		const {isEditting, readonly} = this.props;
		if (readonly) return;
		
		const {idx, ques} = this.props;
		
		ques.questionImage = null;
	}
	
	removeOptionImage(option) {
		const {isEditting, readonly} = this.props;
		if (readonly) return;
		
		option.optionImage = null;
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {ques, idx, sectionIdx, isEditting, isLibrary, isPrivate, visibilityState, readonly} = this.props;
		return <AccordionDetails className={"Details" + (readonly ? " readonly" : "")}>
			<div className="Question">
				<div className="Question-row flex">
					<div className="td-question flex">
						{!readonly && <div className="drag-icon fixed-flex h-40 min-w-30 padding-t-10 padding-b-10 text-center">
							<DragIndicatorIcon/>
						</div>}
						
						<Typography className="fixed-flex h-40 padding-t-5 padding-b-5">
							<span className="counter">
								{isNumber(sectionIdx) ? ((sectionIdx + 1) + ".") : null}{idx + 1}
							</span>
							{ques.isMandatory ? <small className="isMandatory">*</small> : ''}
						</Typography>
						
						<TextField
							idx={idx}
							fullWidth={true}
							disabled={!!readonly}
							placeholder="Type Question"
							rows={-1}
							multiline={true}
							value={ques.questionText}
							variant="filled"
							onChange={this.handleQuestionValue}
						/>
						
						<QuestionIconButton
							ques={ques}
							readonly={readonly}
							onUploadImage={this.uploadImage}
							onRemove={this.removeImage}
						/>
					</div>
					<Select
						autoWidth={true}
						disabled={!!readonly}
						className="select-response fixed-flex min-w-300"
						defaultValue={ques.questionType}
						onChange={this.handleQuestionType}
					>
						<MenuItem value='NoAnswer'>No Answer</MenuItem>
						<MenuItem value='Safe,At Risk,N/A'>
							<label className="green">Safe</label>
							<label className="red">At Risk</label>
							<label className="grey">N/A</label>
						</MenuItem>
						<MenuItem value='Good,Fair,Poor,N/A'>
							<label className="green">Good</label>
							<label className="orange">Fair</label>
							<label className="red">Poor</label>
							<label className="grey">N/A</label>
						</MenuItem>
						<MenuItem value='Pass,Fail,N/A'>
							<label className="green">Pass</label>
							<label className="red">Fail</label>
							<label className="grey">N/A</label>
						</MenuItem>
						<MenuItem value='Yes,No,N/A'>
							<label className="green">Yes</label>
							<label className="red">No</label>
							<label className="grey">N/A</label>
						</MenuItem>
						<MenuItem value='Compliant,Non-Compliant,N/A'>
							<label className="green">Compliant</label>
							<label className="red">Non-Compliant</label>
							<label className="grey">N/A</label>
						</MenuItem>
						<Divider/>
						<MenuItem value='Person'>Person</MenuItem>
						<MenuItem value='Asset'>Asset</MenuItem>
						<Divider/>
						<MenuItem value='Signature'>Signature</MenuItem>
						<Divider/>
						<MenuItem value='Photo'>Photo</MenuItem>
						<MenuItem value='Document'>Document (PDF/Word/Spreadsheet)</MenuItem>
						<Divider/>
						<MenuItem value='Date'>Date</MenuItem>
						<MenuItem value='Time'>Time</MenuItem>
						<Divider/>
						<MenuItem value='Short Answer'>Short Answer</MenuItem>
						<MenuItem value='Paragraph'>Paragraph</MenuItem>
						<Divider/>
						<MenuItem value='Multiple Choice'>Multiple Choice</MenuItem>
						<MenuItem value='Checkboxes'>Checkboxes</MenuItem>
						<MenuItem value='Dropdown'>Dropdown</MenuItem>
						{/*<Divider/>
                        <MenuItem value='Linear Scale'>Linear Scale</MenuItem>
                        <MenuItem value='Multiple Choice Grid'>Multiple Choice Grid</MenuItem>
                        <MenuItem value='Checkbox Grid'>Checkbox Grid</MenuItem>*/}
					</Select>
					<TextField
						fullWidth={true}
						type="number"
						min="0"
						placeholder=""
						disabled={!!readonly}
						className="td-max-score fixed-flex min-w-90"
						value={ques.maxScore}
						variant="filled"
						onChange={this.handleQuestionMaxScore}
					/>
				</div>
				<Preview
					isSummary={false}
					ques={ques}
					idx={idx}
					uploadOptionImage={this.uploadOptionImage}
					removeOptionImage={this.removeOptionImage}/>
			</div>
		</AccordionDetails>;
	}
	
	// </editor-fold>
	
}

// <editor-fold defaultstate="collapsed" desc="QuestionIconButton">
@observer
class QuestionIconButton extends React.Component {
	
	componentWillMount() {
		const {ques, readonly} = this.props;
		if (!ques.questionImage) {
			extendObservable(ques, {questionImage: null});
		}
	}
	
	render() {
		const {ques, readonly, onUploadImage, onRemove} = this.props;
		if (!ques.questionImage) {
			if (readonly) {
				return null;
			}
			return <IconButton aria-label="upload image" className="icon-upload" onClick={onUploadImage}>
				<CropOriginalIcon/>
			</IconButton>;
		}
		
		const {previewPath, dlUrls} = ques.questionImage;
		const path = previewPath ? previewPath : (dlUrls ? dlUrls[0] : null);
		return <div className="fixed-flex pos-relative">
			<img src={path} height="58px"/>
			{!readonly && <IconButton size="small" onClick={onRemove}>
				<CloseIcon/>
			</IconButton>}
		</div>;
	}
}

// </editor-fold>

export default Details;
