// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';
import {Button} from 'components/inputs';
import NavItem from 'components/navs/NavItem';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {AnswerQuestions} from 'components/checkables';

import {AControls, Compliance, questionnairesOnUpdate, Stats} from 'components/questionnaires/AResponseUtils';

import style from "./EditResponseDialog.lazy.css";
import updateQuestionnaire from "mutations/all/Questionnaires/Questionnaires/updateQuestionnaire";
import subscribeByIdContractorQuestionnaire
    from "../AQuestionnaireTab/Subscription/subscribeByIdContractorQuestionnaire";
import findByIdContractorsQuestionnaire
    from "mutations/all/Questionnaires/ContractorsQuestionnaires/findByIdContractorsQuestionnaire";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends ANewDialog {
    pageKey = "EditResponseDialog";
    findById = findByIdContractorsQuestionnaire;

    constructor(props) {
        super(props, style);
        
        this.onCompletionOptions = this.onCompletionOptions.bind(this);
        this.onRequestsOptions = this.onRequestsOptions.bind(this);
    }
    
    open(item) {
        this.execWhen(() => this.refs.dialog).then(dialog => {
            dialog.setTopButtons(this.topButtons);
            this.execWhen(() => this.refs.controls).then(controls => {
                controls.onUpdate();
            });
        });
        return super.open(item);
    }
    
    onCompletionOptions(e, btn) {
        this.refs.controls.onCompletionOptions(e, btn);
    }
    
    onRequestsOptions(e, btn) {
        this.refs.controls.onRequestsOptions(e, btn);
    }    
    
    get title() {
        return "Questionnaire Responses";
    }
    
    @computed get topButtons() {
        const {item} = this.state;
        if(!item) return null;
        const {
            id, data: {
                status = "New", status_answered_by_sender, answered_by = 'Recipient',
            }
        } = item;
        
        const {isContractor} = storage.is;
        
        const isAnsweredBySender = answered_by === "Sender";
        
        let shoudMarkAsComplete;
        let shoudAcceptAsComplete;
        let shoudDeclineAsComplete;
        
        let shouldRequestApproval;
        let shouldAcceptQuestionnaire;
        let shouldDeclineQuestionnaire;
        
        if(isAnsweredBySender) {
            if(isContractor) {
                shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
                shoudDeclineAsComplete = status === "CompleteRequested";
                
                shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
                shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";                
            } else {
                shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
                shoudMarkAsComplete = !shouldRequestApproval && (status !== "CompleteRequested" && status !== "CompleteAccepted");                                
            }
        } else {
            if(isContractor) {
                shoudMarkAsComplete = status !== "CompleteRequested" && status !== "CompleteAccepted";
                
                shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
                shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";                
            } else {
                shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
                shoudDeclineAsComplete = status === "CompleteRequested";
                
//                shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
            }
        }
        
        return <React.Fragment>
            <Button ref={ref => this.refs.infoB = ref} className="btn btn-primary progress-bar"/>
            {(shoudMarkAsComplete || shoudAcceptAsComplete || shoudDeclineAsComplete) && <Button className="btn btn-primary" onClick={this.onCompletionOptions}>
                Completion Options <i className="fa fa-angle-down icon-right font-size-16"/>
            </Button>}
            {(shouldRequestApproval || shouldAcceptQuestionnaire || shouldDeclineQuestionnaire) && <Button className="btn btn-primary" onClick={this.onRequestsOptions}>
                Requests Options <i className="fa fa-angle-down icon-right font-size-16"/>
            </Button>}
            <hr />
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>
                <i className="fa fa-times icon-left"/>Cancel
            </Button>
            <Button ref={ref => this.refs.saveB = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Save
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/contractors/questionnaires/";
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onUpdate = this.onUpdate.bind(this);
        
        this.onActionAsComplete = this.onActionAsComplete.bind(this);
        this.onActionQuestionnaire = this.onActionQuestionnaire.bind(this);
        
        this.onCompletionOptions = this.onCompletionOptions.bind(this);
        this.onRequestsOptions = this.onRequestsOptions.bind(this);
    }
    // </editor-fold>
    
    componentWillUnmount() {
        if (this.unsubscribe && isFunction(this.unsubscribe)) {
            this.unsubscribe();
        }
        this.unsubscribe = null;
    }
    
    onUpdate() {
        if (this.unsubscribe) {
            return;
        }

//         const {item} = this;
//         this.unsubscribe = subscribeByIdContractorQuestionnaire({
//             id: item.id,
//             onEvent: res => {
//                 console.log(`subscription`, res)
// //            alert('ProfileResponseDialog')
// // 				questionnairesOnUpdate(item, {updateVal, data});
//             },
//         });
    }
    
    // <editor-fold defaultstate="collapsed" desc="onActionAsComplete">
    onActionAsComplete(evt, el) {
        const {status} = el.props;
        this.onUpdateImpl({status});
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onActionQuestionnaire">
    onActionQuestionnaire(evt, el) {
        const {status_answered_by_sender} = el.props;
        this.onUpdateImpl({status_answered_by_sender});
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCompletionOptions">
    onCompletionOptions(e, btn) {
        const {
            id, data: {
                status = "New", status_answered_by_sender, answered_by = 'Recipient',
            }
        } = this.item;
        
        const {isContractor} = storage.is;
        
        const isAnsweredBySender = answered_by === "Sender";
        
        let shoudMarkAsComplete;
        let shoudAcceptAsComplete;
        let shoudDeclineAsComplete;
        
        if(isAnsweredBySender) {
            if(isContractor) {
                shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
                shoudDeclineAsComplete = status === "CompleteRequested";              
            } else {
                const shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
                shoudMarkAsComplete = !shouldRequestApproval && (status !== "CompleteRequested" && status !== "CompleteAccepted");               
            }
        } else {
            if(isContractor) {
                shoudMarkAsComplete = status !== "CompleteRequested" && status !== "CompleteAccepted";  
            } else {
                shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
                shoudDeclineAsComplete = status === "CompleteRequested";
            }
        }
        
        const jqElem = $(btn.getDOMNode());
        const {left, top} = jqElem.offset();
        const style = {
            left, 
            top: top + jqElem.height() + 25, 
            width: "auto", 
            minWidth: 200
        };
        popover.settings({
            style,
            isDialog: true,
            contentNode: <div>
                {shoudMarkAsComplete && <NavItem status="CompleteRequested" onClick={this.onActionAsComplete} title="Mark As Complete"/>}
                {shoudAcceptAsComplete && <NavItem status="CompleteAccepted" onClick={this.onActionAsComplete} title="Accept As Complete"/>}
                {shoudDeclineAsComplete && <NavItem status="CompleteDeclined" onClick={this.onActionAsComplete} title="Decline As Complete"/>}
            </div>
        }).open();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onRequestsOptions">
    onRequestsOptions(e, btn) {
        const {
            id, data: {
                status = "New", status_answered_by_sender, answered_by = 'Recipient',
            }
        } = this.item;
        
        const {isContractor} = storage.is;
        
        const isAnsweredBySender = answered_by === "Sender";
        
        let shouldRequestApproval;
        let shouldAcceptQuestionnaire;
        let shouldDeclineQuestionnaire;
        
        if(isAnsweredBySender) {
            if(isContractor) {
                shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
                shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";                
            } else {
                shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";                
            }
        } else {
            if(isContractor) {
                shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
                shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";                
            } else {
//                shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
            }
        }
        
        const jqElem = $(btn.getDOMNode());
        const {left, top} = jqElem.offset();
        const style = {
            left, 
            top: top + jqElem.height() + 25, 
            width: "auto", 
            minWidth: 200
        };
        popover.settings({
            style,
            isDialog: true,
            contentNode: <div>
                {shouldRequestApproval && <NavItem status_answered_by_sender="ApprovalRequested" onClick={this.onActionQuestionnaire} title="Request Approval"/>}
                {shouldAcceptQuestionnaire && <NavItem status_answered_by_sender="ApprovalAccepted" onClick={this.onActionQuestionnaire} title="Accept Questionnaire"/>}
                {shouldDeclineQuestionnaire && <NavItem status_answered_by_sender="ApprovalDeclined" onClick={this.onActionQuestionnaire} title="Decline Questionnaire"/>}
            </div>
        }).open();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        btn.text("Saving...").disabled();
        setTimeout(() => {
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            btn.text("Save").enabled();
        }, 1000);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onUpdateImpl">
    onUpdateImpl(attrs, showConfirm = true) {
        let promise;
        if(showConfirm) {
            promise = confirmDialog.open("Are you sure you want to confirm this action?");
        } else {
            promise = Promise.resolve(1);
        }
        promise.then(res => {
            if(res === 1) {
                showConfirm && progressDialog.open("Please wait...");
                updateQuestionnaire({id: this.item.id, ...attrs}).then(res => {
        //            console.log("res", res)
                    extendObservable(this.item.data, attrs);
        //            onSaved && onSaved(res);
                    if(showConfirm) {
                        infoDialog.open("Record successfully updated.");
                        infoDialog.close(2000);
                    }
                }).finally(() => {
                    showConfirm && progressDialog.close();
                });
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            },
            item, item: {
                id, data: {
                    created_at,
                    name,
                    desc,
                    status = "New",
                    status_answered_by_sender,
                    answered_by = 'Recipient',
                    is_template,
                    visibility,
                    page_title_list,
                    question_list,
                    //
                    total_questions,
                    total_compliance,
                    // total_questions,
                    //
                    contractor: {name: contractorName, username},
                }
            }
        } = this;
       console.log('item', item)
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Compliance Summary" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <div className="row margin-0 flex">
                    <Stats value={total_questions} title='Total Questions'/>
                    <Compliance value={100 - total_compliance} title='Non-Compliance' status={status}/>
                    <Compliance value={total_compliance} title='Compliance' status={status}/>
                </div>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Contractor Questionnaire" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <AnswerQuestions 
                    ref="questions"
                    defaultType="Questions"
                    mainTitle="Contractor Questionnaire"
                    item={this.item} 
                    onChange={this.onUpdateAnswer}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
