// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {observer} from 'mobx-react';
import {extendObservable, isObservableArray, observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, debounce, toDataURI} from 'utils/Utils';

import {
    Button,
    ClearableInput,
    ProfileField,
    SelectAssetInput,
    SelectEmployeeInput,
    UploadButton
} from 'components/inputs';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AnswerPreview">
@observer
class AnswerPreview extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {props} = this;
        return <React.Fragment>
            <AnswerPreviewReadonly {...props}/>
            <AnswerPreviewWritable {...props}/>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AnswerPreviewReadonly">
@observer
class AnswerPreviewReadonly extends React.Component {

    @observable answerList = [];

    componentWillMount() {
        let {ques: {answer, hasExpiry, expiry, isMultiAnswer, options, questionType}, idx, readonly} = this.props;
        if (isMultiAnswer) {
            if (!isArray(answer)) {
                answer = [answer];
            }
            this.answerList.push(...answer);
        }
    }

    render() {
        let {
            quesPath,
            mainQuestions,
            ques: {
                answer,
                responseAttachment,
                hasResponseAttachment,
                responseAttachmentRequired,
                hasExpiry,
                expiry,
                isMultiAnswer,
                options,
                questionType
            },
            idx,
            readonly
        } = this.props;
        if (!readonly) {
            return null;
        }

        const index = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');

        const createAnswerInputs = (idx, answer, responseAttachment, hasResponseAttachment, responseAttachmentRequired, n) => {
            let node, className = "";
            switch (questionType) {
                case "NoAnswer":
                    node = 'No Answer';
                    break;
                case "Short Answer":
                case "Paragraph":
                case "Time":
                case "Safe,At Risk,N/A":
                case "Good,Fair,Poor,N/A":
                case "Pass,Fail,N/A":
                case "Yes,No,N/A":
                case "Compliant,Non-Compliant,N/A":
                    node = answer || 'No Answer';
                    break;
                case "Multiple Choice":
                case "Dropdown":
                    if (answer) {
                        console.log('----answer', answer, answer.answer)
                        if (answer.answer) {
                            node = answer.answer;
                        } else {
                            // node = answer
                        }
                    } else {
                        node = 'No Answer';
                    }
                    break;
                case "Date":
                    node = answer ? Dates.formatDate(answer) : 'No Answer';
                    break;
                case "Person":
                    node = answer ? (isString(answer) ? answer : (answer.lname + ' ' + answer.fname)) : 'No Answer';
                    break;
                case "Asset":
                    node = answer ? (isString(answer) ? answer : (answer.name)) : 'No Answer';
                    break;
                case "Signature":
                    node = answer ? <ProfileField type="signature" value={answer} className="col-lg-12"/> : 'No Answer';
                    break;
                case "Photo": {
                    let singleAnswer;
                    if (isArray(answer) || isObservableArray(answer)) {
                        if (answer.length === 1) {
                            singleAnswer = answer[0];
                        } else {

                        }
                    } else {
                        singleAnswer = answer;
                    }
                    if (answer) {
                        if (singleAnswer) {
                            node = <UploadButton
                                name={"answer_" + idx}
                                buttonTitle="Photo"
                                defaultValue={singleAnswer}
                                type={['Photo']}
                                showOnlyIcon
                                readonly
                                className="w-340 pull-left margin-t-0"
                            />;
                        }
                        className = "margin-b-5";
                    } else {
                        node = 'No Answer';
                        className = "";
                    }
                    break;
                }
                case "Document": {
                    let singleAnswer;
                    if (isArray(answer) || isObservableArray(answer)) {
                        if (answer.length === 1) {
                            singleAnswer = answer[0];
                        } else {

                        }
                    } else {
                        singleAnswer = answer;
                    }
                    if (answer) {
                        if (singleAnswer) {
                            node = <UploadButton
                                name={"answer_" + idx}
                                defaultValue={singleAnswer}
                                type={['PDF', 'Word', 'Excel']}
                                showOnlyIcon
                                readonly
                                className="w-340 pull-left margin-t-0"
                            />;
                        }
                    } else {
                        node = 'No Answer';
                    }
                    if (answer) {
                        className = "margin-b-5";
                    } else {
                        className = "";
                    }
                    break;
                }
                case "Checkboxes":
                    // node = answer ? answer.map(v => v).join(', ') : 'No Answer';
                    if (answer) {
                        // node = answer.map(v => v.answer || v).join(', ');
                    } else {
                        node = 'No Answer';
                    }
                    break;
                default:
                    node = 'No Answer';
                    break;
            }

            const renderFrag = (idx, responseAttachment, hasResponseAttachment, responseAttachmentRequired, isMultiAnswer) => (
                <React.Fragment>
                    <span
                        className={"block w-full margin-b-5 margin-l-10 pull-left font-size-15 font-weight-bold " + className}>{node}</span>
                    {hasResponseAttachment && <span className={"block w-full margin-b-5 pull-left " + className}>
                        <UploadButton
                            name={"response_attachment_" + idx}
                            buttonTitle="Response Attachment"
                            defaultValue={responseAttachment}
                            type={['Photo', 'PDF', 'Word', 'Excel']}
                            showOnlyIcon
                            readonly
                            className="w-340 pull-left margin-t-0"
                        />
                        {responseAttachmentRequired && <span
                            className="response-attachment-required block-inline margin-l-10 margin-b-5 font-size-15 font-weight-bold">
                            Response Attachment Required
                        </span>}
                    </span>}
                    {hasExpiry &&
                        <span className="expiry-date block-inline margin-l-10 margin-b-5 font-size-15 font-weight-bold">
                    Expiry Date: {(expiry && Dates.formatDate(expiry)) || "N/A"}
                </span>}
                </React.Fragment>);

            if (isMultiAnswer) {
                return <div
                    className={"multi-answer-each pull-left margin-b-" + ((n === this.answerList.length - 1) ? 5 : 10)}>
                    <span className="counter">{index}.{n + 1}</span>
                    {renderFrag(idx, responseAttachment, hasResponseAttachment, responseAttachmentRequired, true)}
                </div>;
            }
            return renderFrag(idx, responseAttachment, hasResponseAttachment, responseAttachmentRequired,);
        };

        console.log('answer', answer)

        if (isMultiAnswer) {
            return <React.Fragment>
                {this.answerList.isEmpty() && <span
                    className={"block w-full margin-b-5 font-size-15 font-weight-bold margin-l-10"}>No Answers</span>}
                {!this.answerList.isEmpty() && <div
                    className="multi-answer row w-full margin-0 padding-0 pos-relative">{this.answerList.map((v, n) => createAnswerInputs(
                    idx, v, responseAttachment, hasResponseAttachment, responseAttachmentRequired, n
                ))}</div>}
            </React.Fragment>;
        } else {
            return createAnswerInputs(idx, answer, responseAttachment, hasResponseAttachment, responseAttachmentRequired,);
        }
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AnswerPreviewWritable">
@observer
class AnswerPreviewWritable extends React.Component {

    @observable answerList = [];
    wasChangedAnswer = false;
    wasChangedResponseAttachment = false;
    wasChangedAnswerExpiry = false;

    constructor(props) {
        super(props);

        this.onAddAnswer = this.onAddAnswer.bind(this);
        this.onRemoveAnswer = this.onRemoveAnswer.bind(this);

        this.form = new Form();

        const {idx} = this.props;
        this.form.addChangeOne("answer_" + idx, debounce(this.onChangeAnswer.bind(this)).bind(this));
        this.form.addChangeOne("response_attachment_" + idx, debounce(this.onChangeResponseAttachment.bind(this)).bind(this));
        this.form.addChangeOne("answer_expiry_" + idx, this.onChangeAnswerExpiry.bind(this));
    }

    componentWillMount() {
        let {ques: {answer, hasExpiry, expiry, isMultiAnswer, options, questionType}, idx, readonly} = this.props;
        if (isMultiAnswer) {
            if (!isArray(answer)) {
                answer = [answer];
            }
            this.answerList.push(...answer);
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.wasChangedAnswer = true;
            this.wasChangedResponseAttachment = true;
            this.wasChangedAnswerExpiry = true;
        }, 2000);
    }

//task
    async onChangeAnswer(el, val) {
        if (!this.wasChangedAnswer) {
            this.wasChangedAnswer = true;
            return;
        }

        const {type} = el.props;
//        console.log(el)

        const {
            mainQuestions,
            quesPath,
            parentId,
            idx,
            ques,
            ques: {isMultiAnswer},
            notifyChange,
            onChange
        } = this.props;
        if (val) {
            if (isMultiAnswer) {
                if (!!ques.answer && !isArray(ques.answer)) {
                    ques.answer = [ques.answer];
                } else {
                    ques.answer = [];
                }
                if (val.path) {
                    ques.answer.push({path: await toDataURI(val.path)});
                } else {
                    ques.answer.push(val);
                }
            } else {
                if (val.path) {
                    ques.answer = {path: await toDataURI(val.path)};
                } else {
                    ques.answer = val;
                }
            }
        } else {
            if (isMultiAnswer) {
                if (isArray(ques.answer) || isObservableArray(ques.answer)) {
                    ques.answer.clear();
                }
            } else {
                ques.answer = null;
            }
        }
//        console.log('ques', ques)
        onChange && onChange({parentId, ques, quesPath}).then(res => {
            if (res) {
                ques.open = true;
                extendObservable(ques, res);
                notifyChange && notifyChange({parentId, ques, quesPath})
            }
        });
    }

    async onChangeResponseAttachment(el, val) {
        if (!this.wasChangedResponseAttachment) {
            this.wasChangedResponseAttachment = true;
            return;
        }

        const {mainQuestions, quesPath, parentId, idx, ques, notifyChange, onChange} = this.props;
        if (isNullable(ques.answer)) {
            infoDialog.open('Please provide the answer before selecting Response Attachment');
            el.reset();
            return;
        }
        if (val) {
            if (val.path) {
                ques.responseAttachment = {path: await toDataURI(val.path)};
            }
        } else {
            ques.responseAttachment = null;
        }

        console.log('ques', ques)
        onChange && onChange({parentId, ques, quesPath}).then(res => {
            if (res) {
                ques.open = true;
                extendObservable(ques, res);
                notifyChange && notifyChange({parentId, ques, quesPath})
            }
        });
    }

    onChangeAnswerExpiry(el, val) {
        if (!this.wasChangedAnswerExpiry) {
            this.wasChangedAnswerExpiry = true;
            return;
        }

        const {mainQuestions, quesPath, parentId, idx, ques, notifyChange, onChange} = this.props;
        if (isNullable(ques.answer)) {
            infoDialog.open('Please provide the answer before selecting Expiry Date');
            el.reset();
            return;
        }
        ques.expiry = val;
        console.log('ques', ques)
        onChange && onChange({parentId, ques, quesPath}).then(res => {
            if (res) {
                ques.open = true;
                extendObservable(ques, res);
                notifyChange && notifyChange({parentId, ques, quesPath})
            }
        });
    }

    onAddAnswer(evt, btn) {
        this.answerList.push(null);
    }

    onRemoveAnswer(evt, btn) {
        const {idx} = btn.props;
        this.answerList.removeIf((v, n) => n === idx);
    }

    get values() {
        const {ques: {answer, options, questionType}, idx} = this.props;
        const opts = options && options.isNotEmpty() ? options : questionType.split(",");
        return opts.map(v => {
            if (questionType === 'Checkboxes') {
                return {
                    text: v.optionText || v,
                    value: v,
                    checked: (isArray(answer) || isObservableArray(answer)) && answer.contains(v.answer || v)
                };
            } else {
                return {text: v.optionText || v, value: v, checked: answer === v.answer || answer === v};
            }
        });
    }

    render() {
        let {
            quesPath,
            mainQuestions,
            ques: {
                answer,
                responseAttachment,
                hasResponseAttachment,
                responseAttachmentRequired,
                hasExpiry,
                expiry,
                isMultiAnswer,
                options,
                questionType
            },
            idx,
            readonly
        } = this.props;
        if (readonly) {
            return null;
        }

        const {onChange} = this.form;

        const index = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');

        const createAnswerInputs = (idx, questionType, answer, responseAttachment, hasResponseAttachment, responseAttachmentRequired, n) => {
//            alert(questionType)
            let node, className = "";
            switch (questionType) {
                case "NoAnswer":
                    node = 'No Answer';
                    break;
                case "Short Answer":
                    node =
                        <ClearableInput name={"answer_" + idx} type="text" placeholder="Type here" defaultValue={answer}
                                        required className="form-control" onChange={onChange}/>;
                    break;
                case "Paragraph":
                    node = <ClearableInput name={"answer_" + idx} type="textarea" placeholder="Type here"
                                           defaultValue={answer} required className="form-control"
                                           onChange={onChange}/>;
                    break;
                case "Date":
                    node =
                        <ClearableInput name={"answer_" + idx} type="date" placeholder="Date..." defaultValue={answer}
                                        required className="form-control" onChange={onChange}/>;
                    break;
                case "Time":
                    node =
                        <ClearableInput name={"answer_" + idx} type="time" placeholder="Time..." defaultValue={answer}
                                        required className="form-control" onChange={onChange}/>;
                    break;
                case "Dropdown":
                    node = <ClearableInput name={"answer_" + idx} type="select" placeholder="Select..."
                                           defaultValue={answer} required className="form-control" onChange={onChange}
                                           values={options} returnValue/>;
                    break;
                case "Person":
                    node = <SelectEmployeeInput name={"answer_" + idx} type="select" placeholder="Select Person..."
                                                defaultValue={answer} showOtherPerson required className="form-control"
                                                onChange={onChange}/>;
                    break;
                case "Asset":
                    node = <SelectAssetInput
                        name={"answer_" + idx}
                        placeholder="Select Asset..."
                        defaultValue={answer}
                        className="form-control"
                        onChange={onChange}
                    />;
                    break;
                case "Signature":
                    node = <ClearableInput name={"answer_" + idx} type="signature" placeholder="Draw Signature..."
                                           defaultValue={answer} required className="form-control" onChange={onChange}
                                           returnValue/>;
                    break;
                case "Photo": {
                    let singleAnswer;
                    if (isArray(answer) || isObservableArray(answer)) {
                        if (answer.length === 1) {
                            singleAnswer = answer[0];
                        } else {

                        }
                    } else {
                        singleAnswer = answer;
                    }
                    //if (singleAnswer) {
                    node = <UploadButton
                        name={"answer_" + idx}
                        buttonTitle="Upload Photo"
                        defaultValue={singleAnswer}
                        type={['Photo']}
                        showOnlyIcon
                        onChange={onChange}
                        className="w-340 pull-left margin-t-0"
                    />;
                    //}
                    if (answer) {
                        className = "margin-b-5";
                    } else {
                        className = "";
                    }
                    break;
                }
                case "Document": {
                    let singleAnswer;
                    if (isArray(answer) || isObservableArray(answer)) {
                        if (answer.length === 1) {
                            singleAnswer = answer[0];
                        } else {

                        }
                    } else {
                        singleAnswer = answer;
                    }
//                    console.log(questionType, answer)
                    //if (singleAnswer) {
                    node = <UploadButton
                        name={"answer_" + idx}
                        buttonTitle="Upload PDF/Word/Excel"
                        defaultValue={singleAnswer}
                        type={['PDF', 'Word', 'Excel']}
                        showOnlyIcon
                        onChange={onChange}
                        className="w-340 pull-left margin-t-0"
                    />;
                    //}
                    if (answer) {
                        className = "margin-b-5";
                    } else {
                        className = "";
                    }
                    break;
                }
                case "Checkboxes":
                    node = <ClearableInput name={"answer_" + idx} type="checkbox" placeholder="Select"
                                           defaultValue={answer} required className="form-control" onChange={onChange}
                                           values={this.values} returnValue/>;
                    break;
                case "Multiple Choice":
                case "Safe,At Risk,N/A":
                case "Good,Fair,Poor,N/A":
                case "Pass,Fail,N/A":
                case "Yes,No,N/A":
                case "Compliant,Non-Compliant,N/A":
                    node =
                        <ClearableInput name={"answer_" + idx} type="radio" placeholder="Select" defaultValue={answer}
                                        required className="form-control" onChange={onChange} values={this.values}
                                        returnValue/>;
                    break;
                default:
                    node = null;
                    break;
            }

            const renderFrag = (idx, node, responseAttachment, hasResponseAttachment, responseAttachmentRequired, isMultiAnswer) => {
                return <React.Fragment>
                    <span className={"block w-full margin-b-5 pull-left " + className}>{node}</span>
                    {hasResponseAttachment && <span className={"block w-full margin-b-5 pull-left " + className}>
                        <UploadButton
                            name={"response_attachment_" + idx}
                            buttonTitle="Response Attachment"
                            defaultValue={responseAttachment}
                            type={['Photo', 'PDF', 'Word', 'Excel']}
                            showOnlyIcon
                            onChange={onChange}
                            className="w-340 pull-left margin-t-0"
                        />
                        {responseAttachmentRequired && <span
                            className="response-attachment-required block-inline margin-l-10 margin-b-5 font-size-15 font-weight-bold">
                            Response Attachment Required
                        </span>}
                    </span>}
                    {isMultiAnswer && <Button idx={n} className="btn btn-primary fa fa-trash padding-5 w-25 h-25"
                                              onClick={this.onRemoveAnswer}/>}
                    {hasExpiry && <ClearableInput
                        name={"answer_expiry_" + idx}
                        type="date"
                        placeholder="Expiry Date"
                        defaultValue={expiry}
                        required
                        className={"pull-left margin-b-5 w-345 form-control" + (!isMultiAnswer ? " margin-t-5" : "")}
                        onChange={onChange}
                    />}
                </React.Fragment>;
            };
            if (isMultiAnswer) {
                return <div className="multi-answer-each pull-left margin-b-10">
                    <span className="counter">{index}.{n + 1}</span>
                    {renderFrag(idx, node, responseAttachment, hasResponseAttachment, responseAttachmentRequired, true)}
                </div>;
            }
            return renderFrag(idx, node, responseAttachment, hasResponseAttachment, responseAttachmentRequired,);
        };

        if (isMultiAnswer) {
            return <React.Fragment>
                <div
                    className="multi-answer row w-full margin-0 pos-relative">{this.answerList.map((v, n) => createAnswerInputs(
                    idx, questionType, v, responseAttachment, hasResponseAttachment, responseAttachmentRequired, n
                ))}</div>
                <Button className="btn btn-primary margin-b-5" onClick={this.onAddAnswer}>
                    <i className="fa fa-plus"/> Add another answer
                </Button>
            </React.Fragment>;
        } else {
            return createAnswerInputs(idx, questionType, answer, responseAttachment, hasResponseAttachment, responseAttachmentRequired,);
        }
    }
}

// </editor-fold>

export default AnswerPreview;
