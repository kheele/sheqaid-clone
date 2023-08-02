import React from 'react';
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {Grid} from '@material-ui/core';
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import {execWhen} from "../../utils/Utils";

import PageLoadingProgress from '../PageLoadingProgress';
import {Clickable} from '../inputs';

import UploadDialog from './UploadDialog';
import List from './List';
import Stats from './Stats';

import style from './FormBody.lazy.css';

@observer
class FormBody extends React.Component {

    @observable state = {
        loaded: false
    };
    
    constructor(props) {
        super(props);
        
        this.notifyChange = this.notifyChange.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentDidMount(){
        const {questions, readonly} = this.props;
        if(readonly) {
            setTimeout(() => {
                Object.values(questions).forEach(q => q.open = false);
                this.state.loaded = true;
            });
        } else {
            setTimeout(() => {
                this.state.loaded = true;
            });
        }
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    notifyChange({parentId, ques, quesPath}) {
        execWhen(() => this.refs.stats).then(stats => {
            stats.update({parentId, ques, quesPath});
        });
    }
    
    render() {
        let {isTitlePage, isSection, type, status, parentId, mainQuestions, questions, idx, sectionIdx, readonly, onViewTemplateDocDialog, onChange, onFormOpen} = this.props;
//        if(isSection && ques && !ques.open) return null;
        let className = (readonly ? "FormBody-readonly " : "");
        if(isTitlePage) {
            className += "FormBody-title-page";
        } else if(isSection) {
            className += "FormBody-section";
        } else {
            className += "FormBody-main";
        }
        return <Grid className={"FormBody " + className}>
            {!this.state.loaded && <PageLoadingProgress />}
            {this.state.loaded && <div className="h-full">
                <h3 className="margin-t-0">
                    {type && <label>{type}</label>}
                    {type && <small className="required-notice">questions marked (*) are required</small>}
                    {type && <Clickable onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>}
                </h3>
                <UploadDialog ref="uploadDialog"/>
                <DragDropContext>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <ListDroppable {...provided.droppableProps} innerRef={provided.innerRef}>
                                <ListWrapper 
                                    ref={ref => this.listRef = ref}  
                                    idx={idx} 
                                    mainQuestions={mainQuestions}
                                    questions={questions} 
                                    readonly={readonly}
                                    isSection={isSection}
                                    sectionIdx={sectionIdx} 
                                    parentId={parentId}
                                    type={type} 
                                    status={status} 
                                    onViewTemplateDocDialog={onViewTemplateDocDialog}
                                    notifyChange={this.notifyChange}
                                    onChange={onChange}
                                    />
                                {provided.placeholder}
                            </ListDroppable>
                        )}
                    </Droppable>
                </DragDropContext>
                <Stats ref="stats" questions={questions}/>
            </div>}
        </Grid>;
    }
}

@observer
class ListWrapper extends React.Component {
    
    @computed
    get hasQuestions() {
        const {idx, sectionIdx, parentId, type, status, isSection, mainQuestions, questions, readonly, onViewTemplateDocDialog, onChange} = this.props;
        if(isArray(questions) || isObservableArray(questions)) {
            return !questions.isEmpty();
        } else {
            return !Object.values(questions).isEmpty();
        }
    }
    
    render() {
        const {idx, sectionIdx, parentId, type, status, isSection, mainQuestions, questions, readonly, onViewTemplateDocDialog, notifyChange, onChange} = this.props;
//        console.log('questions:', questions)
        if(!this.hasQuestions) {
            return <p className="text-center padding-50">No questions added</p>;
        }
        return <List 
            ref="list" 
            readonly={readonly}
            parentId={parentId}
            idx={idx} 
            sectionIdx={sectionIdx}
            mainQuestions={mainQuestions}
            questions={questions}
            isSection={isSection}
            type={type} 
            status={status} 
            onViewTemplateDocDialog={onViewTemplateDocDialog}
            notifyChange={notifyChange}
            onChange={onChange} />;
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
