// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../../../../utils/Utils';
import {convertQuestionnaireObjectToArray} from "../../../../../utils/ArrayMapperUtils";

import {ActionsButton} from '../../../../../components/inputs';
import {TRow} from '../../../../../components/tables';

import {AsyncTD} from '../../../components';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="TemplatesTabTableRow">
@observer
class TemplatesTabTableRow extends React.Component {
    
    render() {
        const {item, idx, onClick, onRenderActionCell, noDescription} = this.props;
        let {id, data: {
                created_at, 
                name, desc, category, review_date, doc_num
            }
        } = item;
        
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-120">{doc_num}</div>
            <div className="td">{name}</div>
            <div className="td">{category || 'N/A'}</div>
            {!noDescription && <div className="td padding-r-10">{desc ? (desc.substring(0, 160) + '...') : 'N/A'}</div>}
            <div className="td fixed-flex min-w-120">{Dates.formatDate(review_date) || 'N/A'}</div>
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="LibraryTabTableRow">
@observer
class LibraryTabTableRow extends React.Component {
    
    render() {
        const {item, idx, onClick} = this.props;
        let {id, data: {
                created_at, 
                visibility,
                form: {name: formName, desc, title_page_list, questions, answered_by = 'Receipient'}
            }
        } = item;
//        console.log('form', item)
        
        const getLength = async(questions) => {
            questions = await convertQuestionnaireObjectToArray(questions);
            questions = questions.
                        map(v => v.questions || [v]).
                        reduce((a1, a2) => [...a1, ...a2], []);
            return questions.length;
        };
        
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{formName}</div>
            <div className="td padding-r-10">{desc ? (desc.substring(0, 160) + '...') : 'N/A'}</div>
            <AsyncTD title="Questions" defaultValue={getLength(questions)} renderer={v => v} className="td fixed-flex min-w-100"/>
            <div className="td fixed-flex min-w-100">{visibility === "OnlyMyCompany" ? "Private" : "Public"}</div>
            <div className="td fixed-flex min-w-160">{answered_by}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ActiveTabTableRow">
@observer
class ActiveTabTableRow extends React.Component {
    
    render() {
        const {item, idx, onClick} = this.props;
        let {id, data: {
                created_at, 
                status = "New",
                status_answered_by_sender,
                contractor: {name: contractorName, username}, 
                form: {name: formName, desc, type, answered_by = 'Receipient', title_page_list, questions}
            }
        } = item;
//        console.log(item)

        const isAnsweredBySender = answered_by === "Sender";
        
        let statusView;        
        
        if(isAnsweredBySender) {
            if(!status_answered_by_sender) {
                statusView = 'Awaiting Approval Request'; 
            } else {
                if(status === 'CompleteRequested' || status === 'CompleteAccepted' || status === 'CompleteDeclined') {
                    switch (status) {
                        case "New":
                        case "Seen":
                            statusView = status;
                            break;
                        case "CompleteRequested":
                            statusView = "Completion Requested";
                            break;
                        case "CompleteAccepted":
                            //not allowed in this page
                            break;
                        case "CompleteDeclined":
                            statusView = "Completion Declined";
                            break;
                    }
                } else {
                    if(status_answered_by_sender === 'ApprovalRequested') {
                        statusView = 'Awaiting Request Approval'; 
                    } else if(status_answered_by_sender === 'ApprovalDeclined') {
                        statusView = 'Request Declined'; 
                    } else if(status_answered_by_sender === 'ApprovalAccepted') {
                        statusView = 'Approval Accepted'; 
                    }
                }                
            }
        } else {
            switch (status) {
                case "New":
                case "Seen":
                    statusView = status;
                    break;
                case "CompleteRequested":
                    statusView = "Completion Requested";
                    break;
                case "CompleteAccepted":
                    //not allowed in this page
                    break;
                case "CompleteDeclined":
                    statusView = "Completion Declined";
                    break;
            }
        }
        
        let questionsMemo;
        const getQuestions = async(questions) => {
            if(questionsMemo) {
                return questionsMemo;
            }
            
            questions = await convertQuestionnaireObjectToArray(questions);
            questions = questions.
                        map(v => v.questions || [v]).
                        reduce((a1, a2) => [...a1, ...a2], []);
            return questionsMemo = questions.filter(v => v.questionType !== 'NoAnswer');
        };
        
        const renderProgress = (v) => {
            const answerCount = v.filter(v => !!v.answer).length;
            const perc = (answerCount / v.length) * 100;
            const progress = perc.toFixed(1) + '% Complete';
            return progress;
        };
        
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{formName}</div>
            <AsyncTD 
                title="Questions" 
                defaultValue={getQuestions(questions)} 
                renderer={v => v.length} 
                className="td fixed-flex min-w-100"
            />
            <AsyncTD 
                title="Responses" 
                defaultValue={getQuestions(questions)} 
                renderer={v => v.filter(v => !!v.answer).length} 
                className="td fixed-flex min-w-100"
            />
            <div className="td fixed-flex min-w-200">{statusView}</div>
            <AsyncTD 
                title="Progress" 
                defaultValue={getQuestions(questions)} 
                renderer={renderProgress} 
                className="td fixed-flex min-w-270 flex-center progress-bar"
            />
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CompleteTabTableRow">
@observer
class CompleteTabTableRow extends React.Component {
    
    render() {
        const {item, idx, onClick} = this.props;
        let {id, data: {
                created_at, 
                status,
                contractor: {name: contractorName, username}, 
                form: {name: formName, desc, type, title_page_list, questions}
            }
        } = item;
        console.log(item)
        
        const calculate = (list) => {
//            console.log('calculate', toJS(list))
            list = list.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);
            const score = list.map(({score, maxScore}) => ((score && isNumber(score)) ? parseInt(score) : 0)).reduce((n1, n2) => n1 + n2, 0);
            const maxScore = list.map(({score, maxScore}) => ((maxScore && isNumber(maxScore)) ? parseInt(maxScore) : 0)).reduce((n1, n2) => n1 + n2, 0);
            const perc =  maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 'N/A';
            console.log('calculate 2 - ', {score, maxScore, perc})
            return {compliance: perc, nonCompliance: perc === 'N/A' ? perc : 100 - perc};
        };
        
        let questionsMemo;
        const getQuestions = async(questions) => {
            if(questionsMemo) {
                return questionsMemo;
            }
            
            questions = await convertQuestionnaireObjectToArray(questions);
            questions = questions.
                        map(v => v.questions || [v]).
                        reduce((a1, a2) => [...a1, ...a2], []);
            return questionsMemo = questions.filter(v => v.questionType !== 'NoAnswer');
        };
        
        const color = (perc, isCompliance) => {
            if(perc === 'N/A') {
                return 'default';
            }
            if(perc >= 80) {
                return isCompliance ? "green" : "red";
            } else if(perc >= 50){
                return "orange";
            } else {
                return isCompliance ? "red" : "green";
            }
        };
        
        const renderCompliance = (v) => {
            const {compliance} = calculate(v);
            return <span className={color(compliance, true)}>{compliance === 'N/A' ? compliance : `${compliance}%`}</span>;
        };
        const renderNonCompliance = (v) => {
            const {nonCompliance} = calculate(v);
            return <span className={color(nonCompliance)}>{nonCompliance === 'N/A' ? nonCompliance : `${nonCompliance}%`}</span>;
        };
        const renderProgress = (v) => {
            const answerCount = v.filter(v => !!v.answer).length;
            const perc = (answerCount / v.length) * 100;
            const progress = perc.toFixed(1) + '% Complete';
            return progress;
        };
        
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{formName}</div>
            <AsyncTD 
                title="Questions" 
                defaultValue={getQuestions(questions)} 
                renderer={v => v.length} 
                className="td fixed-flex min-w-100"
            />
            <AsyncTD 
                title="Responses" 
                defaultValue={getQuestions(questions)} 
                renderer={v => v.filter(v => !!v.answer).length} 
                className="td fixed-flex min-w-100"
            />
            <AsyncTD 
                title="Non-Compliance" 
                defaultValue={getQuestions(questions)} 
                renderer={renderNonCompliance} 
                className="td fixed-flex min-w-140 coloured"
            />
            <AsyncTD 
                title="Compliance" 
                defaultValue={getQuestions(questions)} 
                renderer={renderCompliance} 
                className="td fixed-flex min-w-120 coloured"
            />
            <div className="td fixed-flex min-w-100">Complete</div>
            <AsyncTD 
                title="Progress" 
                defaultValue={getQuestions(questions)} 
                renderer={renderProgress} 
                className="td fixed-flex min-w-270 flex-center progress-bar"
            />
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
}
// </editor-fold>

export {
    TemplatesTabTableRow, LibraryTabTableRow, ActiveTabTableRow, CompleteTabTableRow
};
