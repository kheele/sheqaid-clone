import React from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {convertQuestionnaireObjectToArray} from "../../utils/ArrayMapperUtils";

import PageLoadingProgress from '../PageLoadingProgress';

@observer
class Stats extends React.Component {

    @observable state = {
        loaded: false,
        update: false,
        questions: null
    };
    
    constructor(props) {
        super(props);
        
        this.update = this.update.bind(this);
    }
    
    async componentDidMount(){
        setTimeout(() => {
            this.update();
        });
    }
    
    async update(attrs = {}) {
        const {parentId, ques, quesPath} = attrs;
        
        if(ques) {
            this.state.update = true;
        } else {
            this.state.update = false;
        }
        
        this.state.loaded = false;
        this.state.questions = await this.questions;
        this.state.loaded = true;
//        alert(`Stats.update ${quesPath}`)
    }
    
    @computed get questions() {
        let {ques, questions} = this.props;
        return new Promise(async (resolve, reject) => {
            questions = questions || ques.questions;
            questions = await convertQuestionnaireObjectToArray(questions);
            resolve(questions.
                    map(v => v.questions || [v]).
                    reduce((a1, a2) => [...a1, ...a2], []).
                    filter(v => v.questionType !== 'NoAnswer'));
        });
    }
    
    render() {
        if(!this.state.loaded && !this.state.update) {
            return <PageLoadingProgress />;
        }
        let {questions} = this.state;
        return <div className="row Stats margin-0 margin-b-10 flex">
            <div className="row margin-0 margin-r-5 flex">
                <Stat value={questions.filter(v => !v.isMandatory).length} title='Optional'/>
                <Stat value={questions.filter(v => !!v.isMandatory).length} title='Required'/>
            </div>
            <div className="row margin-0 margin-r-5 flex">
                <Stat value={questions.filter(v => !v.answer).length} title='Unanswered'/>
                <Stat value={questions.filter(v => !!v.answer).length} title='Answered'/>
            </div>
            <Stat value={questions.length} title='Total'/>
        </div>;
    }
}

// <editor-fold defaultstate="collapsed" desc="Stat">
@observer
class Stat extends React.Component {

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

export default Stats;
