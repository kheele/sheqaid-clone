import React from 'react';
import {observer} from 'mobx-react';
import {computed, toJS} from 'mobx';

import {Draggable} from "react-beautiful-dnd";
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';

import {Button} from '../inputs';

import OpenCloseBtn from './OpenCloseBtn';

import Details from './Details';
import Actions from './ActionsAsArray';
import FormBody from './FormBodyAsArray';

import style from './List.lazy.css';

@observer
class List extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.expandCloseAll = this.expandCloseAll.bind(this);
        
        this.renderDraggables = this.renderDraggables.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentWillUnmount(){
        style.unuse();
    }

    expandCloseAll() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.props.questions.forEach(q => q.open = false);
                resolve();
            });
        });
    }
        
    renderDraggables(ques, idx) {
        const {questions, indexes = [], idx: sectionIdx, isLibrary, isPrivate, visibilityState, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly} = this.props;
        return (provided, snapshot) => <ListDraggable 
            innerRef={provided.innerRef} 
            {...provided.draggableProps} 
            {...provided.dragHandleProps} 
            ques={ques} 
            idx={idx} 
            readonly={readonly}
        >
            <AccordionWrappper 
                questions={questions} 
                ques={ques} 
                sectionIdx={sectionIdx} 
                idx={idx} 
                indexes={[...indexes, sectionIdx, idx]}
                expandCloseAll={this.expandCloseAll} 
                clearQuestions={clearQuestions}  
                addMoreSectionField={addMoreSectionField} 
                addMoreQuestionField={addMoreQuestionField}
                onSelectNotified={onSelectNotified} 
                onUploadDialog={onUploadDialog}
                onSelectTemplateDocDialog={onSelectTemplateDocDialog} 
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                isLibrary={isLibrary}
                isPrivate={isPrivate}
                visibilityState={visibilityState}
                readonly={readonly}/>
        </ListDraggable>;
    }
    
    renderQuestion(ques, idx) {
        return <Draggable key={idx} draggableId={idx + 'id'} index={idx}>{this.renderDraggables(ques, idx)}</Draggable>;
    }
    
    render() {
        const {questions} = this.props;
        return <React.Fragment>{questions.map(this.renderQuestion)}</React.Fragment>;
    }
}

@observer
class AccordionWrappper extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleExpand = this.handleExpand.bind(this);
    }
    
    handleExpand() {
        const {ques, idx, expandCloseAll, readonly} = this.props;
        if(readonly) return;
        return expandCloseAll().then(() => {
            ques.open = true;
        });
    }
    
    @computed
    get isQuestion() {
        const {ques} = this.props;
        return !('sectionText' in ques);
    }
    
    render() {
        const {questions, ques, indexes = [], idx, isLibrary, isPrivate, visibilityState, sectionIdx, expandCloseAll, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly} = this.props;
        console.log('ques', ques)
//        console.log('AccordionWrappper indexes', indexes)
        return <Accordion onChange={this.handleExpand} expanded={ques.open}>
            {this.isQuestion && <React.Fragment>
                <Details 
                    ques={ques} 
                    idx={idx} 
                    sectionIdx={sectionIdx} 
                    indexes={[...indexes, sectionIdx, idx]} 
                    onUploadDialog={onUploadDialog} 
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly} 
                />
                <Actions 
                    ques={ques} 
                    idx={idx} 
                    sectionIdx={sectionIdx} 
                    indexes={[...indexes, sectionIdx, idx]} 
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly} 
                    questions={questions} 
                    onSelectNotified={onSelectNotified} 
                    onSelectTemplateDocDialog={onSelectTemplateDocDialog} 
                    onViewTemplateDocDialog={onViewTemplateDocDialog}
                    expandCloseAll={expandCloseAll}
                />
            </React.Fragment>}
            <Section 
                questions={questions} 
                ques={ques}
                idx={idx} 
                sectionIdx={sectionIdx} 
                indexes={[...indexes, sectionIdx, idx]}
                clearQuestions={clearQuestions}  
                addMoreSectionField={addMoreSectionField} 
                addMoreQuestionField={addMoreQuestionField}
                onSelectNotified={onSelectNotified} 
                onUploadDialog={onUploadDialog} 
                onSelectTemplateDocDialog={onSelectTemplateDocDialog} 
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                expandCloseAll={expandCloseAll}
                isLibrary={isLibrary}
                isPrivate={isPrivate}
                visibilityState={visibilityState}
                readonly={readonly}/>
        </Accordion>;
    }
}

@observer
class Section extends React.Component {
    
    constructor(props) {
        super(props);
        this.onRemoveSection = this.onRemoveSection.bind(this);
        this.onCopySection = this.onCopySection.bind(this);
    }
    
    onCopySection() {
        const {ques, questions, expandCloseAll} = this.props;
        expandCloseAll().then(() => {
            const newQ = toJS(ques);
            newQ.open = true;
            questions.push(newQ);
        });
    } 

    onRemoveSection() {
        const {idx, questions} = this.props;
        questions.removeIf((q, n) => n === idx);
    } 
   
    render() {
        const {questions, indexes = [], ques, idx, sectionIdx, isLibrary, isPrivate, visibilityState, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly} = this.props;
        if(!('sectionText' in ques)) return null;
//        console.log('Section indexes', indexes)
        return <React.Fragment>
            <OpenCloseBtn questions={questions} ques={ques} top showOnOpen/>
            <OpenCloseBtn questions={questions} ques={ques}/>
            <h3 className="section-title margin-t-0">
                <span className="counter">{isNumber(sectionIdx) ? ((sectionIdx+1) + ".") : null}{idx+1}</span> 
                <TextField disabled={readonly} variant="filled" placeholder="Add section title" value={ques.sectionText} onChange={evt => ques.sectionText = evt.target.value}/>
                {!readonly && <Button className="btn btn-primary pull-right" onClick={this.onRemoveSection}>
                    <i className="fa fa-times icon-left"/>Remove Section
                </Button>}
                {!readonly && <Button className="btn btn-primary pull-right margin-r-5" onClick={this.onCopySection}>
                    <i className="fa fa-copy icon-left"/>Copy Section
                </Button>}
            </h3>
            <FormBody 
                ref="formBody" 
                isSection
                idx={idx}
                sectionIdx={sectionIdx}
                indexes={[...indexes, sectionIdx, idx]}
                formData={ques} 
                clearQuestions={clearQuestions} 
                addMoreSectionField={addMoreSectionField} 
                addMoreQuestionField={addMoreQuestionField} 
                onSelectNotified={onSelectNotified} 
                onUploadDialog={onUploadDialog}
                onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                isLibrary={isLibrary}
                isPrivate={isPrivate}
                visibilityState={visibilityState}
                readonly={readonly}/>
        </React.Fragment>;
    }
}

@observer
class ListDraggable extends React.Component {
    render() {
        const {ques, idx, innerRef, children, readonly} = this.props;
        const ref = innerRef;
        let className = (readonly ? "ListDraggable-readonly " : "");
        if('sectionText' in ques) {
            className += "ListDraggable-section";
        } else {
            className += "ListDraggable-question";
        }
        return <div className={"ListDraggable " + className} {...this.props} ref={ref}>
            {children}
        </div>;
    }
}

export default List;
