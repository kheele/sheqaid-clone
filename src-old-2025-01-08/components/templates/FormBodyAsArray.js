import React from 'react';
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Grid} from '@material-ui/core';
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import Form from '../../utils/Form';
import {Button, ClearableInput, Clickable} from '../inputs';

import List from './ListAsArray';

import style from './FormBody.lazy.css';

@observer
class FormBody extends React.Component {

    @observable
    state = {
        lists: {
            type: [
                {label: "Inspection", value: "Inspection"},
                {label: "Register", value: "Register"}
            ]
        }
    }
    constructor(props) {
        super(props);
        
        this.onDragEnd = this.onDragEnd.bind(this);
        this.form = new Form();
        this.form.addChangeOne("type", this.onChangeType.bind(this));
    }
    
    componentWillMount(){
        style.use();
        const {formData: {question_list}, readonly} = this.props;
        if(readonly) {
            question_list.forEach(q => q.open = false);
        }
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    onChangeType(el, val){
        const {formData} = this.props;
        formData.type = val;
    }
    
    onDragEnd(result) {
        const {readonly} = this.props;
        if (readonly || !result.destination) return;
        this.reorder(result.source.index, result.destination.index);
    }
    
    reorder(startIndex, endIndex) {
        const {formData: {question_list}, readonly} = this.props;
        if(!readonly) {
            const [removed] = question_list.splice(startIndex, 1);
            question_list.splice(endIndex, 0, removed);
        }
    }
    
    renderActions(className) {
        let {isTitlePage, isSection, formData, addMoreSectionField, addMoreQuestionField, clearQuestions, readonly} = this.props;
        !isSection && (className += " main-actions-none-section grid-3 border-radius-20 w-240 bg-white"); 
        isSection && (className += " main-actions-section"); 
        return !readonly && <div className={"main-actions " + className}>
            {!isSection && <div className="btn btn-primar no-border-radius no-border padding-5 font-size-18 w-full">
                {isTitlePage ? "Title Page" : "Questions"}
            </div>}
            <Button isSection={isSection} formData={formData} className="btn btn-primary no-border-radius no-border w-full" onClick={addMoreSectionField}>
                <i className="fa fa-plus block"/>Section
            </Button>                      
            <Button isSection={isSection} formData={formData} className="btn btn-primary no-border-radius no-border w-full" onClick={addMoreQuestionField}>
                <i className="fa fa-plus block"/>Question
            </Button>                      
            <Button isSection={isSection} formData={formData} className="btn btn-primary no-border-radius no-border w-full" onClick={clearQuestions}>
                <i className="fa fa-times block"/>Clear
            </Button>
        </div>;
    }
    
    getDOMNode() {
        return findDOMNode(this);
    }

    render() {
        const {defaultType, isTitlePage, isSection, isEditting, isLibrary, isPrivate, visibilityState, formData, indexes = [], idx, sectionIdx, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly, onFormOpen} = this.props;
        if(isSection && !formData.open) return null;
        const typeSelected = (isTitlePage || isSection) ? null : {label: formData.type || 'Inspection', value: formData.type || 'Inspection'};
        let className = (readonly ? "FormBody-readonly " : "");
        if(isTitlePage) {
            className += "FormBody-title-page";
        } else if(isSection) {
            className += "FormBody-section";
        } else {
            className += "FormBody-main";
        }
//        console.log('FormBody indexes', indexes)
        
        const Header = ({isSection, isTitlePage, title, onFormOpen, children}) => {
            if(isSection) return null;
            if(isTitlePage || readonly || defaultType) {
                if(isTitlePage) {
                    title = 'Title Page';
                }
                return <h3 className="margin-t-0 margin-b-5">
                    <label>{title}</label>
                    <Clickable onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                </h3>;
            } else {
                return <React.Fragment>
                    <h3 className="margin-t-0 margin-b-5">
                        <label>Questionnaire</label>
                        <Clickable onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </h3>
                    {children}
                </React.Fragment>;
            }
        };
        return <Grid className={"FormBody " + className}>
            <div className="h-full">
                <Header 
                    isSection={isSection} 
                    isTitlePage={isTitlePage} 
                    onFormOpen={onFormOpen} 
                    title={defaultType || formData.type}
                >
                    <ClearableInput name="type" type="select" defaultValue={typeSelected} required isClearable={false} className="select-type form-control" onChange={this.form.onChange} values={this.state.lists.type} add returnValue/>
                </Header>
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
                                    formData={formData}
                                    isEditting={isEditting}
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
        const {indexes = [], idx, sectionIdx, isEditting, isLibrary, isPrivate, visibilityState, formData: {question_list}, clearQuestions, addMoreSectionField, addMoreQuestionField, onSelectNotified, onUploadDialog, onSelectTemplateDocDialog, onViewTemplateDocDialog, readonly} = this.props;
        if(!question_list || question_list.isEmpty()) {
            return <p className="text-center padding-50">No questions added</p>;
        }
        return <List 
            ref="list" 
            readonly={readonly}
            indexes={[...indexes, sectionIdx, idx]}
            idx={idx} 
            sectionIdx={sectionIdx}
            question_list={question_list}
            isEditting={isEditting}
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
