import React from 'react';
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {Grid} from '@material-ui/core';
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import {convertQuestionnaireObjectToArray} from "../../utils/ArrayMapperUtils";

import PageLoadingProgress from '../PageLoadingProgress';
import {Clickable} from '../inputs';

import OpenCloseBtn from './OpenCloseBtn';

import UploadDialog from './UploadDialog';
import List from './List';

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
        const {questions, ques, readonly} = this.props;
        if(readonly) {
            setTimeout(() => {
                Object.values(questions || ques.questions).forEach(q => q.open = false);
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
        let {isTitlePage, isSection, type, status, parentId, questions, ques, idx, sectionIdx, readonly, onChange, onFormOpen} = this.props;
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
                    {!type && <OpenCloseBtn questions={questions} ques={ques} top/>}
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
                                    questions={questions} 
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
                <StatsWrapper questions={questions} ques={ques}/>
            </div>}
        </Grid>;
    }
}

@observer
class StatsWrapper extends React.Component {

    @observable state = {
        loaded: false,
        questions: null
    };
    
    constructor(props) {
        super(props);
    }
    
    async componentDidMount(){
        const {questions, ques, readonly} = this.props;
        setTimeout(async () => {
            this.state.questions = await this.questions;
            this.state.loaded = true;
        });
    }
    
    @computed get questions() {
        let {questions, ques} = this.props;
        return new Promise(async (resolve, reject) => {
            questions = await convertQuestionnaireObjectToArray(questions || ques.questions);
            resolve(questions.
                    map(v => v.questions || [v]).
                    reduce((a1, a2) => [...a1, ...a2], []).
                    filter(v => v.questionType !== 'NoAnswer'));
        });
    }
    
    render() {
        if(!this.state.loaded) {
            return <PageLoadingProgress />;
        }
        let {questions} = this.state;
        return <div className="row Stats margin-0 margin-b-10 flex">
            <div className="row margin-0 margin-r-5 flex">
                <Stats value={questions.filter(v => !v.isMandatory).length} title='Optional'/>
                <Stats value={questions.filter(v => !!v.isMandatory).length} title='Required'/>
            </div>
            <div className="row margin-0 margin-r-5 flex">
                <Stats value={questions.filter(v => !v.answer).length} title='Unanswered'/>
                <Stats value={questions.filter(v => !!v.answer).length} title='Answered'/>
            </div>
            <Stats value={questions.length} title='Total'/>
        </div>;
    }
}

@observer
class ListWrapper extends React.Component {
    
    @computed
    get hasQuestions() {
        const {idx, sectionIdx, parentId, type, status, isSection, ques, questions, readonly, onChange} = this.props;
        const list = questions || ques.questions;
        if(isArray(list) || isObservableArray(list)) {
            return !list.isEmpty();
        } else {
            return !Object.values(list).isEmpty();
        }
    }
    
    render() {
        const {idx, sectionIdx, parentId, type, status, isSection, ques, questions, readonly, onChange} = this.props;
        console.log('ques:', ques, 'questions:', questions)
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
            questions={questions || ques.questions}
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
