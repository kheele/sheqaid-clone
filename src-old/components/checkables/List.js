import React from 'react';
import {observer} from 'mobx-react';
import {computed, isObservableArray} from 'mobx';

import {Draggable} from "react-beautiful-dnd";
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';

import OpenCloseBtn from './OpenCloseBtn';

import AnswerSummary from './AnswerSummary';
import FormBodyQuestionOne from './FormBodyQuestionOne';

import style from './List.lazy.css';

@observer
class List extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderQuestion = this.renderQuestion.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    @computed
    get questions() {
        const {questions} = this.props;
        if(isArray(questions) || isObservableArray(questions)) {
            return questions;
        } else {
            return Object.values(questions);
        }
    }
    
    renderQuestion(ques, idx) {
        const {mainQuestions, questions, readonly, quesPath, onViewTemplateDocDialog, isSection} = this.props;
        const {type, status, parentId, notifyChange, onChange} = this.props;
        return <Draggable key={'Draggable' + ques.idx} draggableId={idx + 'id'} index={idx}>
            {(provided, snapshot) => <DraggablesWrappper 
                key={'DraggablesWrappper' + ques.idx} 
                ques={ques} 
                idx={idx}
                mainQuestions={mainQuestions} 
                questions={questions} 
                readonly={readonly}
                isSection={isSection}
                type={type} 
                status={status} 
                quesPath={quesPath}
                parentId={parentId} 
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                notifyChange={notifyChange}
                onChange={onChange}
                provided={provided}
            />}
        </Draggable>;
    }
    
    render() {
        const {questions} = this;
        return <React.Fragment>{questions.map(this.renderQuestion)}</React.Fragment>;
    }
}

@observer
class DraggablesWrappper extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.expandCloseAll = this.expandCloseAll.bind(this);
    }

    expandCloseAll() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.questions.forEach(q => q.open = false);
                resolve();
            });
        });
    }
    
    @computed
    get questions() {
        const {questions} = this.props;
        if(isArray(questions) || isObservableArray(questions)) {
            return questions;
        } else {
            return Object.values(questions);
        }
    }
    
    render() {
        const {mainQuestions, questions, ques, idx, readonly, onViewTemplateDocDialog, isSection, provided} = this.props;
        const {type, status, parentId, notifyChange, onChange} = this.props;
        
        const quesPath = ques.quesPath || Object.getPathByValue(mainQuestions, ques);
        
        return <ListDraggable 
            key={'ListDraggable' + ques.idx}
            innerRef={provided.innerRef} 
            {...provided.draggableProps} 
            {...provided.dragHandleProps} 
            ques={ques} 
            idx={idx} 
            readonly={readonly}
        >
            <AccordionWrappper 
                key={'AccordionWrappper' + ques.idx}
                parentId={parentId} 
                type={type} 
                mainQuestions={mainQuestions}
                questions={questions} 
                status={status} 
                isSection={isSection}
                ques={ques} 
                quesPath={quesPath} 
                idx={idx} 
                expandCloseAll={this.expandCloseAll}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                notifyChange={notifyChange}
                onChange={onChange} 
                readonly={readonly}
            />
        </ListDraggable>;
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
    
    render() {
        const {mainQuestions, questions, ques, quesPath, idx, isSection, onViewTemplateDocDialog, expandCloseAll, readonly} = this.props;
        const {type, status, parentId, notifyChange, onChange} = this.props;
//        console.log('ques', ques)
        return <Accordion key={'Accordion' + ques.idx} onChange={this.handleExpand} expanded={ques.open}>
            <AnswerSummary 
                key={'AnswerSummary' + ques.idx}
                parentId={parentId} 
                type={type} 
                status={status} 
                mainQuestions={mainQuestions} 
                ques={ques} 
                quesPath={quesPath} 
                idx={idx} 
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                readonly={readonly} 
                notifyChange={notifyChange}
                onChange={onChange} 
            />
            <Section 
                key={'Section' + ques.idx}
                mainQuestions={mainQuestions}
                questions={questions} 
                ques={ques}
                quesPath={quesPath}
                idx={idx} 
                parentId={parentId}
                expandCloseAll={expandCloseAll}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                notifyChange={notifyChange}
                onChange={onChange}
                readonly={readonly}/>
        </Accordion>;
    }
}

@observer
class Section extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    @computed
    get isSection() {
        const {ques} = this.props;
        return ('sectionText' in ques);
    }
    
    render() {
        if(!this.isSection) {
            return null;
        }
        
        const {mainQuestions, questions, ques, quesPath, idx, parentId, onViewTemplateDocDialog, readonly, notifyChange, onChange} = this.props;
        
        const index = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');
//        console.log('Section quesPath', index, quesPath.slice())
        return <React.Fragment>
            <OpenCloseBtn key={'OpenCloseBtn' + ques.idx} questions={questions} ques={ques} isSection/>
            <h3 className={`section-title margin-t-0 ${ques.open ? 'margin-l-35' : 'margin-l-0'}` }>
                <span className="counter">{index}</span> 
                <TextField key={'TextField' + ques.idx} disabled={true} variant="filled" value={ques.sectionText}/>
            </h3>
            <FormBodyQuestionOne 
                key={'FormBodyQuestionOne' + ques.idx}
                ref="formBody" 
                isSection
                parentId={parentId}
                mainQuestions={mainQuestions}
                ques={ques}
                quesPath={quesPath}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                notifyChange={notifyChange}
                onChange={onChange}
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
        return <div key={'ListDraggable' + ques.idx} className={"ListDraggable " + className} {...this.props} ref={ref}>
            {children}
        </div>;
    }
}
  
export default List;
