import React from 'react';
import {observer} from 'mobx-react';

import {TextField, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import OptionTypeIcon from '@material-ui/icons/Menu';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import CloseIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Popover from "../popovers/Popover";
import NavItem from "../navs/NavItem";
import {extendObservable} from "mobx";

@observer
class AOptionsInput extends React.Component {
        
    constructor(props) {
        super(props);
        
        this.addOption = this.addOption.bind(this);//
    }
    
    addOption() {
        const {idx, ques: {options}} = this.props;
        options.push({optionText: "Option " + (options.length + 1), optionImage: null});
    }
    
    get renderButton() {
        return <Button size="small">Add Option</Button>;
    }
    
    render() {
        const {ques, isSummary, uploadOptionImage, removeOptionImage, readonly} = this.props;
        return ques.questionType === this.key && <React.Fragment>
            <div className="Preview grid-1 padding-10 padding-b-0">
                <OptionList 
                    iconNode={this.icon}
                    ques={ques} 
                    isSummary={isSummary}
                    uploadOptionImage={uploadOptionImage}
                    removeOptionImage={removeOptionImage} 
                    readonly={readonly}
                />
                {!isSummary && <div className="Preview_options_add">
                    <FormControlLabel 
                        onClick={this.addOption} 
                        control={<i className="add-option font-size-28">+</i>} 
                        label={this.renderButton} 
                    />
                </div>} 
            </div>  
        </React.Fragment>;
    }
}

@observer
class InputMultipleChoice extends AOptionsInput {
    
    key = "Multiple Choice";
    icon = <Radio disabled />;
}

@observer
class InputCheckboxes extends AOptionsInput {
    
    key = "Checkboxes";
    icon = <Checkbox disabled />;
}

@observer
class InputDropdown extends AOptionsInput {
    
    key = "Dropdown";
}

@observer
class OptionList extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.handleOptionValue = this.handleOptionValue.bind(this);//
        this.removeOption = this.removeOption.bind(this);//
        this.renderOptions = this.renderOptions.bind(this);//
    }
    
    componentWillMount() {
//        const {idx, ques, ques: {options}} = this.props;
    }
    
    handleOptionValue(option, val){
        option.optionText = val;
        //newMembersEmail[i]= email;
    }
    
    removeOption(j) {
        const {idx, ques: {options}} = this.props;
        options.removeIf((v, n) => n === j);
    }
    
    renderOptions(option, n) {
        const {isSummary, uploadOptionImage, removeOptionImage, iconNode, readonly} = this.props;
        return <Option 
            key={n} 
            isSummary={isSummary} 
            iconNode={iconNode} 
            option={option} 
            idx={n} 
            readonly={readonly} 
            uploadOptionImage={uploadOptionImage} 
            removeOptionImage={removeOptionImage} 
            handleOptionValue={this.handleOptionValue} 
            removeOption={this.removeOption}
        />;
    }
    
    render() {
        const {ques, isSummary} = this.props;
        return <div className="OptionList">
            {ques.options.map(this.renderOptions)}
        </div>;
    }
}

@observer
class Option extends AOptionsInput {
        
    constructor(props) {
        super(props);
        
        this.handleOptionValue = this.handleOptionValue.bind(this);

        this.onOptionType = this.onOptionType.bind(this);
        this.renderOptionType = this.renderOptionType.bind(this);
        this.onChangeOptionType = this.onChangeOptionType.bind(this);

        this.uploadOptionImage = this.uploadOptionImage.bind(this);
        this.removeOption = this.removeOption.bind(this);
    }
    
    handleOptionValue(evt) {
        const {handleOptionValue, option} = this.props;
        handleOptionValue && handleOptionValue(option, evt.target.value);
    }

    onOptionType(evt) {
        const list = [
            {text: 'No Answer', value: "NoAnswer"},
            'Person', 'Asset', 'Signature', 'Photo',
            {text: 'Document (PDF/Word/Spreadsheet)', value: 'Document'},
            'Date', 'Time'
        ];
        this.refs.popover.settings({
            style: {minWidth: 200},
            fixedCenter: true,
            isDialog: true,
            contentNode: <div>
                <h4>Option Response Type:</h4>
                {list.map(this.renderOptionType)}
            </div>
        }).open();
    }

    renderOptionType(item) {
        return <NavItem optionType={item} onClick={this.onChangeOptionType} title={item.text || item}/>;
    }

    onChangeOptionType(evt, el) {
        let {optionType} = el.props;
        const {option} = this.props;
        extendObservable(option, {optionType: optionType.value || optionType});
    }
    
    uploadOptionImage() {
        const {uploadOptionImage, option} = this.props;
        uploadOptionImage && uploadOptionImage(option);
    }
    
    removeOption() {
        const {removeOption, idx} = this.props;
        removeOption && removeOption(idx);
    }
    
    render() {
        const {isSummary, handleOptionValue, removeOptionImage, readonly, iconNode, option, idx} = this.props;
        if(isSummary) {
            const {optionType, optionImage} = option;
            const {previewPath, dlUrls} = optionImage || {};
            const path = previewPath ? previewPath : (dlUrls ? dlUrls[0] : null);
            return <div className="questionOption" key={idx}>
                <div className="flex">
                    <FormControlLabel 
                        disabled 
                        control={iconNode || <i className="select-count">{idx+1}.</i>} 
                        label={<Typography>{option.optionText}</Typography>} 
                    />
                </div>
                {optionType && <div className="questionOptionType w-160">
                    {optionType}
                </div>}
                {path && <div className="questionOptionImg">
                    <img src={path} width="160px" height="auto" />
                </div>}
            </div>;
        }
        return <div className="Preview_options" key={idx}>
            <div className="Preview_options_1">
                <span className="counter margin-h-5 margin-t-0 select-count">{idx+1}</span>
                {iconNode}
                <TextField 
                    fullWidth={true} 
                    placeholder="Option Text"  
                    value={option.optionText}
                    onChange={this.handleOptionValue}
                />
                <IconButton
                    aria-label="option type"
                    onClick={this.onOptionType}
                >
                    <OptionTypeIcon />
                </IconButton>
                <IconButton 
                    aria-label="upload image" 
                    onClick={this.uploadOptionImage}
                >
                    <CropOriginalIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={this.removeOption}>
                    <CloseIcon />
                </IconButton>
            </div>
            <OptionImage option={option} removeOptionImage={removeOptionImage} readonly={readonly}/>
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

// <editor-fold defaultstate="collapsed" desc="OptionImage">
@observer
class OptionImage extends React.Component {
        
    constructor(props) {
        super(props);
        
        this.removeOptionImage = this.removeOptionImage.bind(this);
    }
    
    removeOptionImage() {
        const {removeOptionImage, option, readonly} = this.props;
        if(readonly) return;
        
        removeOptionImage && removeOptionImage(option);
    }
    
    render() {
        const {option, readonly} = this.props;
        if(!option.optionImage) {
            return null;
        }
        
        const {previewPath, dlUrls} = option.optionImage;
        const path = previewPath ? previewPath : (dlUrls ? dlUrls[0] : null);
        return <div className="Preview_OptionImage">
            <div>
                <img src={path} width="90px" height="auto"/>
                <IconButton size="small" onClick={this.removeOptionImage}>
                    <CloseIcon />
                </IconButton>
            </div>
        </div>;
    }
}
// </editor-fold>

export {InputMultipleChoice, InputCheckboxes, InputDropdown};