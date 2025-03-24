// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, isObservable, isObservableArray, toJS} from 'mobx';

import Form from 'utils/Form';
import {updateQuestion} from "mutations/update";
import {insertQuestionMessage} from "mutations/create";

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

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        const {data: {responsible_person}} = this.item;
        return responsible_person && responsible_person.linked_user_id === user.id;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="get progress">
    @computed get progress() {
        if (!this.item) return null;
        let {data: {total_questions, progress}} = this.item;
        return progress;
    }

    @computed get item() {//form
        return this.props.state.item;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {group} = this;
        const {isContractor} = storage.is;
        this.props.execWhen(() => this.item).then(item => {
            const {data: {status = "New"}} = item;
            if (group === "Contractors") {
                if (isContractor) {
                    if (status === "New") {
                        this.onUpdateImpl({status: "Seen"}, false);
                    }
                }
            } else if (group === "Inspections") {
                if (this.isLoggedUser) {
                    if (status === "New") {
                        this.onUpdateImpl({status: "Seen"}, false);
                    }
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
            let {progress} = this;
            infoB.text('Loading...');//

            infoB.text((progress || 0).toFixed(1) + '% Complete');
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onUpdateAnswer">
    onUpdateAnswer({parentId, ques, quesPath, newMsg = null}) {
        if (isObservable(quesPath)) {
            quesPath = toJS(quesPath);
        }
        return new Promise((resolve, reject) => {
            if (!ques) {
                console.log('onUpdateAnswer no answer', parentId, ques, quesPath, newMsg)
                return;
            }
//            console.log('onUpdateAnswer', parentId, ques, quesPath, newMsg)
//             const {
//                 title_page_list: title_page_list_loaded,
//                 questions: questions_loaded
//             } = this.state.loaded;

            if (ques.answer) {
                const {dlUrls, gcsUri} = ques.answer;
                if (dlUrls && gcsUri) {
                    resolve();
                    return;
                }
            }

            if (this.toOnChangeAnswer) {
                resolve();
                return;
            }

            const {pageKey, execWhen, refs} = this.props.dialog;
            execWhen(() => {
                if (pageKey === "EditResponseDialog") {
                    return refs.saveB;
                } else {
                    return true;
                }
            }).then(saveB => {
                if (!isBoolean(saveB)) {
                    saveB && saveB.disabled().text("Saving...");
                }
//                this.toOnChangeAnswer = setTimeout(() => {
//                    clearTimeout(this.toOnChangeAnswer);
//                    this.toOnChangeAnswer = null;
//                     ques = toJS(ques);
                //                ques =

                // if(!questionHasChat(ques)) {
                //     ques.message_list = [];
                // }

                console.log('question send', parentId, ques, quesPath, newMsg, ques.message_list)

                if (newMsg) {
                    insertQuestionMessage(newMsg).then(res => {
                        resolve(res);
                    }).catch(reject);
                    return;
                }

                updateQuestion(ques).then(res => {
                    this.calculateProgress();
                    resolve(res);
                    if (!isBoolean(saveB)) {
                        saveB && saveB.enabled().text("Save");
                    }
                }).catch(reject)
//                }, 1000);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onMarkAsComplete">
    onMarkAsComplete(evt, el) {
        this.onUpdateImpl({status: "CompleteRequested"});
    }

}

function questionHasChat(ques) {
    return !(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list)));
}

// <editor-fold defaultstate="collapsed" desc="Compliance">
@observer
class Compliance extends React.Component {

    render() {
        let {props: {title, status = "New", value}} = this;
        if (status !== "CompleteAccepted") {
            return <Stats value="N/A" title={title}/>;
        }

        const isCompliance = title === "Compliance";

        const getPerc = async (isCompliance, perc) => {
            if (perc === 'N/A') {
                return {perc};
            }
            let color = "";
            if (perc >= 80) {
                color = isCompliance ? "green" : "red";
            } else if (perc >= 50) {
                color = "orange";
            } else {
                color = isCompliance ? "red" : "green";
            }
            if (isNumber(perc)) {
                perc = perc.toFixed(1) + "%";
            }
            return {perc, color};
        };
        return <Stats value={getPerc(isCompliance, value)} title={title}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {

    render() {
        let {props: {title, className = "", value}} = this;
        return <div className={"margin-r-10 padding-10 Statistics ComplianceStats margin-t-5 " + className}>
            <label className="text-center w-full margin-b-10">{title}</label>
            <div className="content">
                {isString(value) || isNumber(value) ? value : value && value.perc ? value.perc : "N/A"}
            </div>
        </div>;
    }
}

// </editor-fold>

const isSection = (ques) => {
    if (!('question_list' in ques)) return false;
    const {question_list} = ques;
    if (question_list.isEmpty()) return false;
    return true;
}

const all_question_list = (question_list) => {
    return question_list.map(v => isSection(v) ? v.question_list : [v]).reduce((a1, a2) => [...a1, ...a2], []).filter(v => v.questionType !== 'NoAnswer');
};

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
                    quesPath = quesPath.map(v => v.isNumeric() ? parseInt(v) : v);
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

export {AControls, Compliance, Stats, isSection, all_question_list, questionnairesOnUpdate};
