import React from 'react';
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {Grid} from '@material-ui/core';
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import PageLoadingProgress from '../PageLoadingProgress';
import {Clickable} from '../inputs';

import OpenCloseBtn from './OpenCloseBtn';

import UploadDialog from './UploadDialog';
import List from './List';

import style from './FormBody.lazy.css';
import {all_question_list} from "../questionnaires/AResponseUtils";

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
        const {question_list, ques, readonly} = this.props;
        if(readonly) {
            setTimeout(() => {
                (question_list || ques.question_list).forEach(q => q.open = false);
                this.state.loaded = true;
            });
        } else {
            this.state.loaded = true;
        }
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    render() {
        let {isTitlePage, isSection, type, status, parentId, question_list, ques, idx, sectionIdx, readonly, onChange, onFormOpen} = this.props;
        if(isSection && ques && !ques.open) return null;
        let className = (readonly ? "FormBody-readonly " : "");
        if(isTitlePage) {
            className += "FormBody-title-page";
        } else if(isSection) {
            className += "FormBody-section";
        } else {
            className += "FormBody-main";
        }
        return <Grid key={'Grid' + ques.idx} className={"FormBody " + className}>
            {!this.state.loaded && <PageLoadingProgress />}
            {this.state.loaded && <div className="h-full">
                <h3 className="margin-t-0">
                    {type && <label>{type}</label>}
                    {type && <small className="required-notice">questions marked (*) are required</small>}
                    {!type && <OpenCloseBtn question_list={question_list} ques={ques} top/>}
                    {type && <Clickable onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>}
                </h3>
                <UploadDialog ref="uploadDialog"/>
                <DragDropContext>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <ListDroppable key={'ListDroppable' + ques.idx} {...provided.droppableProps} innerRef={provided.innerRef}>
                                <ListWrapper 
                                    ref={ref => this.listRef = ref}
                                    key={'ListWrapper' + ques.idx}
                                    idx={idx} 
                                    ques={ques}
                                    question_list={question_list}
                                    readonly={readonly}
                                    isSection={isSection}
                                    sectionIdx={sectionIdx} 
                                    parentId={parentId}
                                    type={type} 
                                    status={status} 
                                    onChange={onChange}
                                    />
                                {provided.placeholder}
                            </ListDroppable>
                        )}
                    </Droppable>
                </DragDropContext>
                <StatsWrapper question_list={question_list} ques={ques}/>
            </div>}
        </Grid>;
    }
}

@observer
class StatsWrapper extends React.Component {

    @observable state = {
        loaded: false,
        question_list: null
    };
    
    constructor(props) {
        super(props);
    }
    
    async componentDidMount(){
        const {question_list, ques, readonly} = this.props;
        setTimeout(async () => {
            this.state.question_list = await this.question_list;
            this.state.loaded = true;
        });
    }
    
    @computed get question_list() {
        let {question_list, ques} = this.props;
        return new Promise(async (resolve, reject) => {
            question_list = all_question_list(question_list || ques.question_list);
            resolve(question_list);
        });
    }
    
    render() {
        if(!this.state.loaded) {
            return <PageLoadingProgress />;
        }
        let {question_list} = this.state;
        return <div className="row Stats margin-0 margin-b-10 flex">
            <div className="row margin-0 margin-r-5 flex">
                <Stats value={question_list.filter(v => !v.isMandatory).length} title='Optional'/>
                <Stats value={question_list.filter(v => !!v.isMandatory).length} title='Required'/>
            </div>
            <div className="row margin-0 margin-r-5 flex">
                <Stats value={question_list.filter(v => !v.answer).length} title='Unanswered'/>
                <Stats value={question_list.filter(v => !!v.answer).length} title='Answered'/>
            </div>
            <Stats value={question_list.length} title='Total'/>
        </div>;
    }
}

@observer
class ListWrapper extends React.Component {
    
    @computed
    get hasQuestions() {
        const {idx, sectionIdx, parentId, type, status, isSection, ques, question_list, readonly, onChange} = this.props;
        const list = question_list || ques.question_list;
        return !list.isEmpty();
    }
    
    render() {
        const {idx, sectionIdx, parentId, type, status, isSection, ques, question_list, readonly, onChange} = this.props;
        console.log('ques:', ques, 'question_list:', question_list)
        if(!this.hasQuestions) {
            return <p className="text-center padding-50">No questions added</p>;
        }
        return <List 
            ref="list" 
            key={'List' + ques.idx}
            readonly={readonly}
            parentId={parentId}
            idx={idx} 
            sectionIdx={sectionIdx}
            question_list={question_list || ques.question_list}
            isSection={isSection}
            type={type} 
            status={status} 
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

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {

    render() {
        const {props: {title, value}} = this;
        return <div className="margin-r-10 padding-10 Statistics QuestionsStats margin-t-5">
            <label className="text-center w-full margin-b-10">{title}</label>
            <div className="content">
                {value}
            </div>
        </div>;
    }
}
// </editor-fold>

export default FormBody;
