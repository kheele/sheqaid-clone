import React from 'react';
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {Grid} from '@material-ui/core';
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import {execWhen} from "../../utils/Utils";

import PageLoadingProgress from '../PageLoadingProgress';
import {Clickable} from '../inputs';

import OpenCloseBtn from './OpenCloseBtn';

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
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentDidMount(){
        const {ques, readonly} = this.props;
        if(readonly) {
            setTimeout(() => {
                Object.values(ques.questions).forEach(q => q.open = false);
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
        let {isTitlePage, isSection, type, status, quesPath, parentId, mainQuestions, ques, idx, sectionIdx, readonly, onViewTemplateDocDialog, notifyChange, onChange, onFormOpen} = this.props;
        if(isSection && ques && !ques.open) return null;
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
                    {!type && <OpenCloseBtn ques={ques} top/>}
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
                                    ques={ques}
                                    readonly={readonly}
                                    isSection={isSection}
                                    sectionIdx={sectionIdx} 
                                    parentId={parentId}
                                    quesPath={quesPath}
                                    type={type} 
                                    status={status} 
                                    onViewTemplateDocDialog={onViewTemplateDocDialog}
                                    notifyChange={notifyChange}
                                    onChange={onChange}
                                    />
                                {provided.placeholder}
                            </ListDroppable>
                        )}
                    </Droppable>
                </DragDropContext>
                <Stats ref="stats" ques={ques}/>
            </div>}
        </Grid>;
    }
}

@observer
class ListWrapper extends React.Component {
    
    @computed
    get hasQuestions() {
        const {idx, sectionIdx, parentId, type, status, quesPath, isSection, mainQuestions, ques, onViewTemplateDocDialog, readonly, onChange} = this.props;
        if(isArray(ques.questions) || isObservableArray(ques.questions)) {
            return !ques.questions.isEmpty();
        } else {
            return !Object.values(ques.questions).isEmpty();
        }
    }
    
    render() {
        const {idx, sectionIdx, parentId, type, quesPath, status, isSection, mainQuestions, ques, onViewTemplateDocDialog, readonly, notifyChange, onChange} = this.props;
//        console.log('ques:', ques)
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
            questions={ques.questions}
            isSection={isSection}
            quesPath={quesPath}
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
