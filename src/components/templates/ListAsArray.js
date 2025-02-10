import React from 'react';
import {observer} from 'mobx-react';
import {computed, extendObservable, toJS} from 'mobx';

import {Draggable} from "react-beautiful-dnd";
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';

import {Button} from '../inputs';

import OpenCloseBtn from './OpenCloseBtn';

import Details from './Details';
import Actions from './ActionsAsArray';
import FormBody from './FormBodyAsArray';

import {updateQuestion} from "mutations/update";
import {insertQuestion} from "mutations/create";

import style from './List.lazy.css';

@observer
class List extends React.Component {

    constructor(props) {
        super(props);

        this.expandCloseAll = this.expandCloseAll.bind(this);

        this.renderDraggables = this.renderDraggables.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    expandCloseAll() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.props.question_list.forEach(q => q.open = false);
                resolve();
            });
        });
    }

    renderDraggables(ques, idx) {
        const {
            question_list,
            indexes = [],
            idx: sectionIdx,
            isEditting,
            isLibrary,
            isPrivate,
            visibilityState,
            clearQuestions,
            addMoreSectionField,
            addMoreQuestionField,
            onSelectNotified,
            onUploadDialog,
            onSelectTemplateDocDialog,
            onViewTemplateDocDialog,
            readonly
        } = this.props;
        return (provided, snapshot) => <ListDraggable
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ques={ques}
            idx={idx}
            readonly={readonly}
        >
            <AccordionWrappper
                question_list={question_list}
                ques={ques}
                sectionIdx={sectionIdx}
                idx={idx}
                indexes={[...indexes, sectionIdx, idx]}
                expandCloseAll={this.expandCloseAll}
                clearQuestions={clearQuestions}
                addMoreSectionField={addMoreSectionField}
                addMoreQuestionField={addMoreQuestionField}
                onSelectNotified={onSelectNotified}
                onUploadDialog={onUploadDialog}
                onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                isEditting={isEditting}
                isLibrary={isLibrary}
                isPrivate={isPrivate}
                visibilityState={visibilityState}
                readonly={readonly}/>
        </ListDraggable>;
    }

    renderQuestion(ques, idx) {
        return <Draggable key={idx} draggableId={idx + 'id'} index={idx}>{this.renderDraggables(ques, idx)}</Draggable>;
    }

    render() {
        const {question_list} = this.props;
        return <>{question_list.map(this.renderQuestion)}</>;
    }
}

@observer
class AccordionWrappper extends React.Component {

    constructor(props) {
        super(props);
        this.handleExpand = this.handleExpand.bind(this);
    }

    @computed
    get isQuestion() {
        const {ques} = this.props;
        if (!('question_list' in ques)) return true;
        const {question_list} = ques;
        if (question_list.isEmpty()) return true;
        return false;
    }

    handleExpand() {
        const {ques, idx, expandCloseAll, readonly} = this.props;
        if (readonly) return;
        return expandCloseAll().then(() => {
            ques.open = true;
        });
    }

    //<editor-fold desc="render">
    render() {
        const {
            question_list,
            ques,
            indexes = [],
            idx,
            isEditting,
            isLibrary,
            isPrivate,
            visibilityState,
            sectionIdx,
            expandCloseAll,
            clearQuestions,
            addMoreSectionField,
            addMoreQuestionField,
            onSelectNotified,
            onUploadDialog,
            onSelectTemplateDocDialog,
            onViewTemplateDocDialog,
            readonly
        } = this.props;
        console.log('ques', ques)
//        console.log('AccordionWrappper indexes', indexes)
        return <Accordion onChange={this.handleExpand} expanded={ques.open}>
            {this.isQuestion && <React.Fragment>
                <Details
                    ques={ques}
                    idx={idx}
                    sectionIdx={sectionIdx}
                    indexes={[...indexes, sectionIdx, idx]}
                    onUploadDialog={onUploadDialog}
                    isEditting={isEditting}
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly}
                />
                <Actions
                    ques={ques}
                    idx={idx}
                    sectionIdx={sectionIdx}
                    indexes={[...indexes, sectionIdx, idx]}
                    isEditting={isEditting}
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly}
                    question_list={question_list}
                    onSelectNotified={onSelectNotified}
                    onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                    onViewTemplateDocDialog={onViewTemplateDocDialog}
                    expandCloseAll={expandCloseAll}
                />
            </React.Fragment>}
            <Section
                question_list={question_list}
                ques={ques}
                idx={idx}
                sectionIdx={sectionIdx}
                indexes={[...indexes, sectionIdx, idx]}
                clearQuestions={clearQuestions}
                addMoreSectionField={addMoreSectionField}
                addMoreQuestionField={addMoreQuestionField}
                onSelectNotified={onSelectNotified}
                onUploadDialog={onUploadDialog}
                onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                expandCloseAll={expandCloseAll}
                isEditting={isEditting}
                isLibrary={isLibrary}
                isPrivate={isPrivate}
                visibilityState={visibilityState}
                readonly={readonly}/>
        </Accordion>;
    }

    //</editor-fold>
}

@observer
class Section extends React.Component {

    constructor(props) {
        super(props);

        this.handleSectionValue = this.handleSectionValue.bind(this);
        this.onRemoveSection = this.onRemoveSection.bind(this);
        this.onCopySection = this.onCopySection.bind(this);
    }

    @computed get isSection() {
        const {ques} = this.props;
        if (!('question_list' in ques)) return false;
        const {question_list} = ques;
        if (question_list.isEmpty()) return false;
        return true;
    }

    //</editor-fold>

    //<editor-fold desc="handleSectionValue">
    handleSectionValue(evt) {
        const {readonly} = this.props;
        if (readonly) return;

        const {value: questionText} = evt.target;
        const {isEditting, idx, ques} = this.props;

        if (isEditting && ques.id) {
            updateQuestion({id: ques.id, questionText}).then(() => {
                extendObservable(ques, {questionText});
            });
        } else {
            extendObservable(ques, {questionText});
        }
    }

    onCopySection() {
        const {isEditting, ques, question_list, expandCloseAll} = this.props;
        expandCloseAll().then(() => {
            const newQ = toJS(ques);
            if (isEditting && newQ.id) {
                delete newQ.id;

                insertQuestion(newQ).then(() => {
                    newQ.open = true;
                    question_list.push(newQ);
                });
            } else {
                newQ.open = true;
                question_list.push(newQ);
            }
        });
    }

    onRemoveSection() {
        const {isEditting, idx, question_list} = this.props;

        if (isEditting) {
            const section = question_list.find((q, n) => n === idx);

            if (section && section.id) {
                updateQuestion({id: section.id, removed: true}).then(() => {
                    question_list.removeIf((q, n) => n === idx);
                });
            }
        } else {
            question_list.removeIf((q, n) => n === idx);
        }
    }

    //<editor-fold desc="render">
    render() {
        if (!this.isSection) {
            return null;
        }

        const {
            question_list,
            indexes = [],
            ques,
            idx,
            sectionIdx,
            isEditting,
            isLibrary,
            isPrivate,
            visibilityState,
            clearQuestions,
            addMoreSectionField,
            addMoreQuestionField,
            onSelectNotified,
            onUploadDialog,
            onSelectTemplateDocDialog,
            onViewTemplateDocDialog,
            readonly
        } = this.props;

        console.log('Section ques', ques)
        return <>
            <OpenCloseBtn question_list={question_list} ques={ques} top showOnOpen/>
            <OpenCloseBtn question_list={question_list} ques={ques}/>
            <h3 className="section-title margin-t-0">
                <span className="counter">
                    {isNumber(sectionIdx) ? ((sectionIdx + 1) + ".") : null}{idx + 1}
                </span>
                <TextField
                    disabled={readonly}
                    variant="filled"
                    placeholder="Add section title"
                    value={ques.questionText}
                    onChange={this.handleSectionValue}
                />
                {!readonly && <Button className="btn btn-primary pull-right" onClick={this.onRemoveSection}>
                    <i className="fa fa-times icon-left"/>Remove Section
                </Button>}
                {!readonly && <Button className="btn btn-primary pull-right margin-r-5" onClick={this.onCopySection}>
                    <i className="fa fa-copy icon-left"/>Copy Section
                </Button>}
            </h3>
            <FormBody
                ref="formBody"
                isSection
                idx={idx}
                sectionIdx={sectionIdx}
                indexes={[...indexes, sectionIdx, idx]}
                formData={ques}
                clearQuestions={clearQuestions}
                addMoreSectionField={addMoreSectionField}
                addMoreQuestionField={addMoreQuestionField}
                onSelectNotified={onSelectNotified}
                onUploadDialog={onUploadDialog}
                onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                onViewTemplateDocDialog={onViewTemplateDocDialog}
                isEditting={isEditting}
                isLibrary={isLibrary}
                isPrivate={isPrivate}
                visibilityState={visibilityState}
                readonly={readonly}/>
        </>;
    }

    //</editor-fold>
}

@observer
class ListDraggable extends React.Component {
    render() {
        const {ques, idx, innerRef, children, readonly} = this.props;
        const ref = innerRef;
        let className = (readonly ? "ListDraggable-readonly " : "");
        if ('question_list' in ques) {
            className += "ListDraggable-section";
        } else {
            className += "ListDraggable-question";
        }
        return <div className={"ListDraggable " + className} {...this.props} ref={ref}>
            {children}
        </div>;
    }
}

export default List;
