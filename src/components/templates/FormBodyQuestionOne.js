import React from 'react';
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Grid} from '@material-ui/core';
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import Form from '../../utils/Form';
import {Button} from '../inputs';

import List from './List';

import style from './FormBody.lazy.css';

@observer
class FormBody extends React.Component {

    @observable
    state = {
    };
    
    constructor(props) {
        super(props);
        
        this.onDragEnd = this.onDragEnd.bind(this);
        this.form = new Form();
    }
    
    componentWillMount(){
        style.use();
        const {ques: {questions}, readonly} = this.props;
        if(readonly) {
            questions.forEach(q => q.open = false);
        }
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    onDragEnd(result) {
        const {readonly} = this.props;
        if (readonly || !result.destination) return;
        this.reorder(result.source.index, result.destination.index);
    }
    
    reorder(startIndex, endIndex) {
        const {ques: {questions}, readonly} = this.props;
        if(!readonly) {
            const [removed] = questions.splice(startIndex, 1);
            questions.splice(endIndex, 0, removed);
        }
    }
    
    renderActions(className) {
        let {isTitlePage, formData, ques, addMoreSectionField, addMoreQuestionField, clearQuestions, readonly} = this.props;
        className += " main-actions-section"; 
        return !readonly && <div className={"main-actions " + className}>
            <Button isSection formData={formData} ques={ques} className="btn btn-primary no-border-radius no-border w-full" onClick={addMoreSectionField}>
                <i className="fa fa-plus block"/>Section
            </Button>                      
            <Button isSection formData={formData} ques={ques} className="btn btn-primary no-border-radius no-border w-full" onClick={addMoreQuestionField}>
                <i className="fa fa-plus block"/>Question
            </Button>                      
            <Button isSection formData={formData} ques={ques} className="btn btn-primary no-border-radius no-border w-full" onClick={clearQuestions}>
                <i className="fa fa-times block"/>Clear
            </Button>
        </div>;
    }
    
    getDOMNode() {
        return findDOMNode(this);
    }

    render() {
        const {defaultType, isTitlePage, isLibrary, isPrivate, visibilityState, ques, formData, indexes = [], idx, sectionIdx, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly, onFormOpen} = this.props;
        if(!ques.open) return null;
        let className = (readonly ? "FormBody-readonly " : "");
        className += "FormBody-section";
//        console.log('FormBody indexes', indexes)
        
        return <Grid className={"FormBody " + className}>
            <div className="h-full">
                <div className="header flex">
                    <div className="">Question</div>
                    <div className="fixed-flex min-w-300">Type of response</div>
                    <div className="fixed-flex min-w-90">Max Score</div>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <ListDroppable {...provided.droppableProps} innerRef={provided.innerRef}>
                                <ListWrapper 
                                    ref={ref => this.listRef = ref}  
                                    idx={idx} 
                                    indexes={[...indexes, sectionIdx, idx]}
                                    sectionIdx={sectionIdx}
                                    ques={ques}
                                    formData={formData} 
                                    isLibrary={isLibrary}
                                    isPrivate={isPrivate}
                                    visibilityState={visibilityState}
                                    clearQuestions={clearQuestions}  
                                    addMoreSectionField={addMoreSectionField} 
                                    addMoreQuestionField={addMoreQuestionField}
                                    onSelectNotified={onSelectNotified}
                                    onUploadDialog={onUploadDialog}
                                    onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                                    onViewTemplateDocDialog={onViewTemplateDocDialog}
                                    readonly={readonly}/>
                                {provided.placeholder}
                            </ListDroppable>
                        )}
                    </Droppable>
                </DragDropContext>
                {this.renderActions("bottom")}
            </div>
        </Grid>;
    }
}

@observer
class ListWrapper extends React.Component {
    async expandCloseAll() {
        const {list} = this.refs;
        if(!list) {
            return Promise.resolve();
        }
        return await list.expandCloseAll();
    }
    
    render() {
        const {indexes = [], idx, sectionIdx, isLibrary, isPrivate, visibilityState, formData, ques, ques: {questions}, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly} = this.props;
        if(!questions || questions.size === 0) {
            return <p className="text-center padding-50">No questions added</p>;
        }
        return <List 
            ref="list" 
            readonly={readonly}
            indexes={[...indexes, sectionIdx, idx]}
            idx={idx} 
            isSection
            sectionIdx={sectionIdx}
            formData={formData}
            ques={ques}
            questions={questions} 
            isLibrary={isLibrary}
            isPrivate={isPrivate}
            visibilityState={visibilityState}
            
            clearQuestions={clearQuestions}  
            addMoreSectionField={addMoreSectionField} 
            addMoreQuestionField={addMoreQuestionField}
            onSelectNotified={onSelectNotified} 
            onUploadDialog={onUploadDialog}
            onSelectTemplateDocDialog={onSelectTemplateDocDialog} 
            onViewTemplateDocDialog={onViewTemplateDocDialog}
        />;
    }
}

@observer
class ListDroppable extends React.Component {
    render() {
        const {innerRef, children} = this.props;
        const ref = innerRef;
        return <div {...this.props} ref={ref}>
            {children}
        </div>;
    }
}

export default FormBody;
