import React from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import PageLoadingProgress from '../PageLoadingProgress';

@observer
class Stats extends React.Component {

    @observable state = {
        loaded: false,
        update: false,
        question_list: null
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
        this.state.question_list = await this.question_list;
        this.state.loaded = true;
//        alert(`Stats.update ${quesPath}`)
    }

    isSection(ques) {
        if(!('question_list' in ques)) return false;
        const {question_list} = ques;
        if(question_list.isEmpty()) return false;
        return true;
    }

    @computed get question_list() {
        let {ques, question_list} = this.props;
        console.log('question_list', ques, question_list);
        return new Promise(async (resolve, reject) => {
            question_list = question_list || ques.question_list;
            resolve(question_list.
                    map(v => this.isSection(v) ? v.question_list : [v]).
                    reduce((a1, a2) => [...a1, ...a2], []).
                    filter(v => v.questionType !== 'NoAnswer'));
        });
    }
    
    render() {
        if(!this.state.loaded && !this.state.update) {
            return <PageLoadingProgress />;
        }
        let {question_list} = this.state;
        return <div className="row Stats margin-0 margin-b-10 flex">
            <div className="row margin-0 margin-r-5 flex">
                <Stat value={question_list.filter(v => !v.isMandatory).length} title='Optional'/>
                <Stat value={question_list.filter(v => !!v.isMandatory).length} title='Required'/>
            </div>
            <div className="row margin-0 margin-r-5 flex">
                <Stat value={question_list.filter(v => !v.answer).length} title='Unanswered'/>
                <Stat value={question_list.filter(v => !!v.answer).length} title='Answered'/>
            </div>
            <Stat value={question_list.length} title='Total'/>
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
