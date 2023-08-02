// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, isObservable, isObservableArray, isObservableObject, observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';
import {convertQuestionnaireObjectToArray} from "../../../../../utils/ArrayMapperUtils";

// </editor-fold>

@observer
class AControls extends React.Component {
    path = "plugin_sheq_assist/contractors/questionnaires/";
    
    // <editor-fold defaultstate="collapsed" desc="state">
    state = {
        loaded: {
            title_page_list: [],
            questions: []
        }
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onUpdateAnswer = this.onUpdateAnswer.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
        
    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {isContractor} = storage.is;
        this.props.execWhen(() => this.item).then(item => {
            const {data: {status = "New"}} = item;
            if(isContractor) {
                if(status === "New") {
                    this.onUpdateImpl({status: "Seen"}, false);
                }
            }
            this.calculateProgress();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="calculateProgress">
    calculateProgress() {
        const {execWhen, refs} = this.props.dialog;
        execWhen(() => refs.infoB).then(async infoB => {
            let {questions} = this;
            infoB.text('Loading...');
            if(questions instanceof Promise) {
                questions = await questions;
            }
            
            questions = questions.filter(v => v.questionType !== 'NoAnswer');
            const total = questions.length;
            const answerCount = questions.filter(v => !!v.answer).length;
            let perc = (answerCount / total) * 100;
            infoB.text(perc.toFixed(1) + '% Complete');
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onUpdateAnswer">
    onUpdateAnswer({parentId, ques, quesPath, newMsg = null}) {
        if(isObservable(quesPath)) {
            quesPath = toJS(quesPath);
        }
        return new Promise((resolve, reject) => {
            if(!ques) {
                console.log('onUpdateAnswer no answer', parentId, ques, quesPath, newMsg)
                return;
            }
//            console.log('onUpdateAnswer', parentId, ques, quesPath, newMsg)
            const {
                title_page_list: title_page_list_loaded, 
                questions: questions_loaded
            } = this.state.loaded;
            
            if(parentId === "TitlePage") {
//                if(!title_page_list_loaded.contains(quesPath)) {
//                    title_page_list_loaded.push(quesPath);
//                } else {
//                    resolve();
//                    return;
//                }
//                console.log('onUpdateAnswer', parentId, quesPath, title_page_list_loaded)
            }
            if(parentId === "Questions") {
//                if(!questions_loaded.contains(quesPath)) {
//                    questions_loaded.push(quesPath);
//                } else {
//                    resolve();
//                    return;
//                }
//                console.log('onUpdateAnswer', parentId, quesPath, questions_loaded)
            }
            if(ques.answer){
                const {dlUrls, gcsUri} = ques.answer;
                if(dlUrls && gcsUri){
                    resolve();
                    return;
                }
            }

            if(this.toOnChangeAnswer) {
                resolve();
                return;
            } 
            
            const {pageKey, execWhen, refs} = this.props.dialog;
            execWhen(() => {
                if(pageKey === "EditResponseDialog") {
                    return refs.saveB;
                } else {
                    return true;
                }
            }).then(saveB => {
                if(!isBoolean(saveB)) {
                    saveB && saveB.disabled().text("Saving...");
                }
//                this.toOnChangeAnswer = setTimeout(() => {
//                    clearTimeout(this.toOnChangeAnswer);
//                    this.toOnChangeAnswer = null;
                    ques = toJS(ques);
    //                ques = 

                    if(!questionHasChat(ques)) {
                        ques.message_list = [];
                    }
                    
                    console.log('question send', parentId, ques, quesPath, newMsg, ques.message_list)
                //        btn.text("Saving...").disabled();
                    neonBinding.events.emit(this.path + "answer/ques", this.item.id, {parentId, ques, quesPath, newMsg}).then(res => {
                        this.calculateProgress();
                        resolve(res);
                //            extendObservable(this.item.data.form, form);
                //            onSaved && onSaved(res);
                //            infoDialog.open("Record successfully saved.");
                //            infoDialog.close(2000);
                //            this.props.close(); 
                        if(!isBoolean(saveB)) {
                            saveB && saveB.enabled().text("Save");
                        }
                    }).catch(reject);
//                }, 1000);
            });
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onMarkAsComplete">
    onMarkAsComplete(evt, el) {
        this.onUpdateImpl({status: "CompleteRequested"});
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="get questions">
    @computed get questions() {
        if(!this.item) return [];
        let {data: {form: {questions}}} = this.item;
        
        return new Promise(async (resolve, reject) => {
            questions = await convertQuestionnaireObjectToArray(questions);
            resolve(questions.
                    map(v => v.questions || [v]).
                    reduce((a1, a2) => [...a1, ...a2], []));
        });
    }
    // </editor-fold>
    
    get item() {//form
        return this.props.state.item;
    }
        
}

function questionHasChat(ques) {
    return !(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list)));
}

// <editor-fold defaultstate="collapsed" desc="Compliance">
@observer
class Compliance extends React.Component {

    @computed get calculate() {
        let {props: {title, list}} = this;
        return new Promise(async (resolve, reject) => {

            if(isObservableObject(list) || isObject(list)) {
                list = await convertQuestionnaireObjectToArray(list);
//                list = list.reduce((a1, a2) => [...a1, ...a2], []);
            }

            list = list.map(v => v.questions || [v]).reduce((a1, a2) => [...a1, ...a2], []).
                    filter(v => v.questionType !== 'NoAnswer').
                    filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);

            const score = list.map(({score, maxScore}) => ((score && isNumber(score)) ? score : 0)).reduce((n1, n2) => n1 + n2, 0);
            const maxScore = list.map(({score, maxScore}) => maxScore).reduce((n1, n2) => n1 + n2, 0);
            const perc =  maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 'N/A';
            
            resolve({compliance: perc, nonCompliance: perc === 'N/A' ? perc : 100 - perc});
        });
    }
    
    render() {
        let {props: {title, status = "New"}} = this;
        if(status !== "CompleteAccepted") {
            return <Stats value="N/A" title={title}/>;
        }
        
        const isCompliance = title === "Compliance";
        
        const getPerc = async(calculate) => {
            const {compliance, nonCompliance} = await calculate;
            let perc;
            if(isCompliance) {
                perc = compliance;
            } else {
                perc = nonCompliance;
            }
            if(perc === 'N/A') {
                return {perc};
            }
            let color = ""; 
            if(perc >= 80) {
                color = isCompliance ? "green" : "red";
            } else if(perc >= 50){
                color = "orange";
            } else {
                color = isCompliance ? "red" : "green";
            }
            if(isNumber(perc)) {
                perc = perc.toFixed(1) + "%";
            }
            return {perc, color};
        };
        return <Stats value={getPerc(this.calculate)} title={title}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {

    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {value} = this;
        this.state.loading = true;
        this.state.value = await value;
        this.state.loading = false;
    }

    @computed get value() {
        let {props: {title, value, className = ""}} = this;
        if(value instanceof Promise) {
            return value;
        }
        return new Promise(async (resolve, reject) => {
            if(isObservableObject(value) || isObject(value)) {
                console.log('AResponseUtils.value 1', value)
                value = await convertQuestionnaireObjectToArray(value);
                console.log('AResponseUtils.value 2', value)
//                value = value.reduce((a1, a2) => [...a1, ...a2], []);
            }

            if(isArray(value) || isObservableArray(value)) {
                value = value.map(v => v.questions || [v]).reduce((a1, a2) => [...a1, ...a2], []).filter(v => v.questionType !== 'NoAnswer').length;
            }
            
            resolve(value);
        });
    }
    
    render() {
        let {props: {title, className = ""}} = this;
        const {value, loading} = this.state;
        if(value && value.color) {
            className += ' ' + value.color;
        }
        return <div className={"margin-r-10 padding-10 Statistics ComplianceStats margin-t-5 " + className}>
            <label className="text-center w-full margin-b-10">{title}</label>
            <div className="content">
                {loading && 'Loading...'}
                {!loading && (!!value && (value.perc || value))}
            </div>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="questionnairesOnUpdate">
const questionnairesOnUpdate = (list_or_item, {updateVal, data}) => {
    const oldVal = isArray(list_or_item) || isObservableArray(list_or_item) ? list_or_item.find(val => val.id === updateVal.id) : list_or_item;
    if (oldVal) {
        const {
            data: {
                form: {
                    name: old_formName,
                    desc: old_desc,
                    type: old_type,
                    title_page_list: old_title_page_list,
                    questions: old_questions
                }
            }
        } = oldVal;

        const {
            form, diff_forms,
            title_page_list, diff_title_page_list,
            questions, diff_questions
        } = data;

        setTimeout(() => {
            const mergeValue = (diffObj, oldObj, pathArr) => {
                pathArr.forEach(quesPath => {
                    quesPath = quesPath.map(v => v.isNumeric() ? parseInt(v): v);
//                    console.log('quesPath', quesPath)
                    const val = Object.getValueByPath(diffObj, quesPath);
                    quesPath.pop();
//                    console.log('quesPath val', val, quesPath)
                    Object.setValueByPath(oldObj, quesPath, val);
//                    let vv = Object.getValueByPath(oldObj, quesPath);
//                    console.log('quesPath', vv)
                });
            };
            
            if (form) {
                extendObservable(oldVal.data, {form});
            }
            if (diff_title_page_list && diff_questions) {
                const paths__title_page_list = Object.getPathsByKey(diff_title_page_list, 'left');
                const paths__questions = Object.getPathsByKey(diff_questions, 'left');
                
                mergeValue(diff_title_page_list, old_title_page_list, paths__title_page_list);
                mergeValue(diff_questions, old_questions, paths__questions);
            }
            if (diff_title_page_list && !diff_questions) {
                const paths__title_page_list = Object.getPathsByKey(diff_title_page_list, 'left');
                
                mergeValue(diff_title_page_list, old_title_page_list, paths__title_page_list);
            }
            if (!diff_title_page_list && diff_questions) {
                const paths__questions = Object.getPathsByKey(diff_questions, 'left');
                console.log('paths__questions', paths__questions)
                
                mergeValue(diff_questions, old_questions, paths__questions);
            }
        });
    }
};
// </editor-fold>

export {AControls, Compliance, Stats, questionnairesOnUpdate};
