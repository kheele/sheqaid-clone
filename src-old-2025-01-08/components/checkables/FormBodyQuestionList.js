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
        const {readonly} = this.props;
        if(readonly) {
            setTimeout(() => {
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
        let {isTitlePage, isSection, defaultType, status, question_list, idx, sectionIdx, readonly, onViewTemplateDocDialog, onChange, onFormOpen} = this.props;
//        if(isSection && ques && !ques.open) return null;
        let className = (readonly ? "FormBody-readonly " : "");
        if(isTitlePage) {
            className += "FormBody-title-page";
        } else if(isSection) {
            className += "FormBody-section";
        } else {
            className += "FormBody-main";
        }
        console.log('defaultType', defaultType)
        return <Grid className={"FormBody " + className}>
            {!this.state.loaded && <PageLoadingProgress />}
            {this.state.loaded && <div className="h-full">
                <h3 className="margin-t-0">
                    {defaultType && <label>{defaultType}</label>}
                    {defaultType && <small className="required-notice">questions marked (*) are required</small>}
                    {defaultType && <Clickable onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>}
                </h3>
                <UploadDialog ref="uploadDialog"/>
                <DragDropContext>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <ListDroppable {...provided.droppableProps} innerRef={provided.innerRef}>
                                <ListWrapper 
                                    ref={ref => this.listRef = ref}  
                                    idx={idx}
                                    question_list={question_list}
                                    readonly={readonly}
                                    isSection={isSection}
                                    sectionIdx={sectionIdx}
                                    defaultType={defaultType}
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
                <Stats ref="stats" question_list={question_list}/>
            </div>}
        </Grid>;
    }
}

@observer
class ListWrapper extends React.Component {
    
    @computed
    get hasQuestions() {
        const {question_list,} = this.props;
        return (isArray(question_list) || isObservableArray(question_list)) && !question_list.isEmpty();
    }
    
    render() {
        const {idx, sectionIdx, parentId, defaultType, status, isSection, mainQuestions, question_list, readonly, onViewTemplateDocDialog, notifyChange, onChange} = this.props;
//        console.log('question_list:', question_list)
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
            question_list={question_list}
            isSection={isSection}
            defaultType={defaultType}
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
