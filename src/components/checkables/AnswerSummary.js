// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';

import {Typography} from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import {Button, ChatButton, ClearableInput} from '../../components/inputs';
import AnswerPreview from './AnswerPreview';

import style from './AnswerSummary.lazy.css';

// </editor-fold>

@observer
class AnswerSummary extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onViewTemplateDocDialog = this.onViewTemplateDocDialog.bind(this);
        this.onClickChat = this.onClickChat.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    onViewTemplateDocDialog(evt) {
        const {ques, onViewTemplateDocDialog} = this.props;
        onViewTemplateDocDialog && onViewTemplateDocDialog(ques);
    }
    
    // <editor-fold defaultstate="collapsed" desc="onClickChat">
    onClickChat(btn) {
        const {status, quesPath, ques, parentId, onChange} = this.props;
        chatBox.readonly(status === "CompleteAccepted").setActiveQuestion({parentId, quesPath, ques, btn}, newMsg => {
            newMsg.question_id = ques.id;
            onChange({parentId, quesPath, ques, newMsg}).then(res => {
                console.log('onClickChat res', res)
                if(res) {            
                    extendObservable(newMsg, res.data);
                }
            });
        });
    }
    // </editor-fold>

    @computed
    get isQuestion() {
        const {ques} = this.props;
        if(!('question_list' in ques)) return true;
        const {question_list} = ques;
        if(question_list.isEmpty()) return true;
        return false;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if(!this.isQuestion) {
            return null;
        }
        
        const {defaultType, status, mainQuestions, quesPath, ques, idx, sectionIdx, readonly, onViewTemplateDocDialog, parentId, notifyChange, onChange} = this.props;
        const className = "AnswerSummary" + (storage.is.isContractor ? " contractor" : "");
        
        const index = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');
        
//        console.log('AnswerSummary quesPath', index, quesPath.slice())
        
        const questionImage = ques.questionImage;

        console.log('questionImage', ques);
        return /*ques.open && */<AccordionSummary key={'AccordionSummary' + index} aria-controls="panel1a-content" id="panel1a-header" elevation={1} className={className}>
            <div className="w-full">
                <Typography variant="subtitle1">
                    {defaultType !== 'Title Page' && <span className="counter">{index}</span>}
                    {ques.isMandatory && <small className="isMandatory">*</small>}
                    {ques.questionText || 'Type Question'}
                </Typography>

                {!!questionImage && !!questionImage.dlUrls && <div className="questionImage">
                    <img src={questionImage.dlUrls[0]} width="400px" height="auto" />
                    <br/><br/>
                </div>}
                
                <AnswerPreview 
                    key={'AnswerPreview' + index}
                    isSummary
                    mainQuestions={mainQuestions}
                    quesPath={quesPath}
                    ques={ques} 
                    idx={idx}
                    readonly={readonly}
                    sectionIdx={sectionIdx}
                    parentId={parentId}
                    notifyChange={notifyChange}
                    onChange={onChange}/> 
                    
                <ChatBtn ques={ques} onClick={this.onClickChat}/>
                
                <QuestionScore status={status} parentId={parentId} ques={ques} idx={idx} sectionIdx={sectionIdx} onChange={onChange}/>
                
                <QuestionStatus ques={ques}/>
                
                {ques.linkDoc && <Button className="btn btn-primary margin-b-5" onClick={this.onViewTemplateDocDialog}>
                    <i className="fa fa-eye"/> View Template
                </Button>}
            </div>   
        </AccordionSummary>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="ChatBtn">
@observer
class ChatBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        const {onClick} = this.props;
        onClick(this.refs.btn);
    }
    
    render() {
        let {ques: {message_list = []}} = this.props;
//        console.log('message_list', message_list)
        message_list = message_list.isEmpty ? message_list : [];
        return <button 
            onClick={this.onClick}
            type="button" 
            className="rcw-launcher AnswerSummary-chat-btn" 
            aria-controls="rcw-chat-container">
                {!message_list.isEmpty() && <span className="counter">{message_list.length}</span>}
                <ChatButton ref="btn"/>
        </button>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="QuestionStatus">
@observer
class QuestionStatus extends React.Component {
    
    render() {
        const {ques: {answer, hasExpiry, expiry, questionType}} = this.props;
        let statusAnswerClass = !!answer ? 'Answered' : 'Unanswered';
        let statusExpiryClass = "";
        if(hasExpiry) {
            if(!expiry) {
                statusExpiryClass = ' D-Unanswered';
            }
        }
        return <div className={"question-status " + statusAnswerClass + statusExpiryClass}>
            {questionType !== 'NoAnswer' && <span className="answer-error">{statusAnswerClass}</span>}
            {hasExpiry && !expiry && <span className="expiry-error">Expiry Date Unanswered</span>}
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="QuestionScore">
@observer
class QuestionScore extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onMarkScore = this.onMarkScore.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    
    onMarkScore(val, name) {
        const {parentId, ques, ques: {score, maxScore}, idx, sectionIdx, onChange} = this.props;
        val = parseInt(val);
        if(val > maxScore) {
            const {score: score_ref} = this.refs;
            score_ref.value = 0;
            return;
        }
        
        if(val === score) {
            return;
        }
        
        ques.score = val;
        onChange && onChange({parentId, ques, idx, sectionIdx}).then(res => {
            console.log('onMarkScore res', res)
            if(res) {            
                extendObservable(ques, res.data);
            }
       });
    }
    
    onClick(evt) {
        const {canAllocateScore} = this;
        if(!canAllocateScore) {
            infoDialog.open('The question MUST be answered in order to allocate score');
        }
    }
    
    @computed get canAllocateScore() {
        const {ques: {answer}} = this.props;
        const {isComplete, hasScore} = this;
        return !isComplete && hasScore && !!answer;
    }
    
    @computed get isComplete() {
        const {status} = this.props;
        return status === "CompleteAccepted";
    }
    
    @computed get hasScore() {
        const {ques: {maxScore}} = this.props;
        return isNumber(maxScore) && maxScore > 0;
    }
    
    render() {
        const {isComplete, hasScore, canAllocateScore} = this;
        if(storage.is.isContractor || !hasScore) return null;
        
        const {status, ques, ques: {answer, score, maxScore}} = this.props;
        
        return <button type="button" className="AnswerSummary-question-score-btn flex cursor-default" aria-controls="rcw-chat-container">
            <span className="fixed-flex">Score</span>
            {!isComplete && <ClearableInput 
                ref="score" 
                name="score" 
                type="number" 
                defaultValue={score} 
                min="0" 
                max={maxScore} 
                isEditable={canAllocateScore}
                isClearable={false} 
                required 
                className="" 
                onChange={this.onMarkScore}
                onClick={this.onClick}/>}
            {isComplete && <span className="fixed-flex margin-l-5 margin-r-5 font-bold">{score ? score : "-"}</span>}
            <span className="fixed-flex line-diagnal">/</span>
            <span className="fixed-flex margin-l-5 font-bold">{maxScore}</span>
        </button>;
    }
}
// </editor-fold>

export default AnswerSummary;
