import React from 'react';
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import IconButton from '@material-ui/core/IconButton';
import AccordionActions from '@material-ui/core/AccordionActions';
import Divider from '@material-ui/core/Divider';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {Clickable} from '../inputs';
import NavItem from '../navs/NavItem';

import style from './Actions.lazy.css';

@observer
class Actions extends React.Component {

    constructor(props) {
        super(props);

        this.showAsQuestion = this.showAsQuestion.bind(this);
        this.showAsEdit = this.showAsEdit.bind(this);
        this.copyQuestion = this.copyQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.onViewLinkedDoc = this.onViewLinkedDoc.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    showAsQuestion = () => {
        const {ques} = this.props;
        ques.open = false;
    }

    showAsEdit = () => {
        const {ques} = this.props;
        ques.open = true;
    }

    copyQuestion = () => {
        const {ques, questions, expandCloseAll} = this.props;
        expandCloseAll().then(() => {
            const newQ = toJS(ques);
            newQ.open = true;

            const keys = questions.keys();
            const lastKey = keys.getLastElement();
            let lastIdx = lastKey.split('.').map(v => parseInt(v)).pop();
            newQ.idx = String(lastIdx++);
            questions.set(newQ.idx, newQ);
//            questions.push(newQ);
        });
    }

    deleteQuestion = () => {
        const {idx, ques, questions} = this.props;
        questions.delete(ques.idx);
//        questions.removeIf((q, n) => n === idx);
    }

    onViewLinkedDoc(evt, el) {
        const {idx, ques, onViewTemplateDocDialog} = this.props;
        onViewTemplateDocDialog && onViewTemplateDocDialog(ques);
    }

    getColor(v) {
        switch (v) {
            case "Safe":
            case "Good":
            case "Pass":
            case "Yes":
            case "Compliant":
                return "green";
            case "At Risk":
            case "Poor":
            case "Fail":
            case "No":
            case "Non-Compliant":
                return "red";
            case "Fair":
                return "orange";
            default:
                return "grey";
        }
    }

    @computed
    get showNotify() {
        const {ques} = this.props;
        switch (ques.questionType) {
            case "Low,Medium,High,N/A":
            case "Empty,Medium,Full,N/A":
            case "Safe,At Risk,N/A":
            case "Good,Fair,Poor,N/A":
            case "Pass,Fail,N/A":
            case "Yes,No,N/A":
            case "Compliant,Non-Compliant,N/A":
                return true;
            default:
                return false;
        }
    }

    @computed
    get showResponseAttachment() {
        return this.showNotify;
    }

    @computed
    get showResponseAttachmentRequired() {
        const {ques} = this.props;
        return !!ques.hasResponseAttachment;
    }

    @computed
    get showMultiple() {
        const {ques} = this.props;
        switch (ques.questionType) {
            case "Person":
            case "Asset":
            case "Photo":
            case "Document":
            case "Short Answer":
            case "Paragraph":
                return true;
            default:
                return false;
        }
    }

    @computed get notifyLabel() {
        const {ques} = this.props;
        return <React.Fragment>
            Notify{ques.notifyAction && <i> [If answer is </i>}
            {ques.notifyAction && <label className={'margin-t-5 ' + this.getColor()}>{ques.notifyAction}</label>}
            {ques.notifyAction && ']'}
        </React.Fragment>;
    }

    @computed get linkDocLabel() {
        const {ques} = this.props;
        return <React.Fragment>
            Link Document{ques.linkDoc && <React.Fragment>
                [<i>
                <Clickable onClick={this.onViewLinkedDoc}>
                    <a href="#"><b>View Document</b></a>
                </Clickable>
            </i>]
            </React.Fragment>}
        </React.Fragment>;
    }

    render() {
        const {
            questions,
            ques,
            idx,
            isLibrary,
            isPrivate,
            visibilityState,
            sectionIdx,
            readonly,
            onSelectNotified,
            onSelectTemplateDocDialog,
            onViewTemplateDocDialog
        } = this.props;
        return <AccordionActions className="Actions">
            <div className="left-actions grid-4 grid-gap-5">
                <Option
                    name='isMandatory'
                    className='mandatory'
                    label='Mandatory'
                    idx={idx}
                    ques={ques}
                    readonly={readonly}
                    onChange="handleMandatoryValue"
                />
                <Option
                    name='hasExpiry'
                    className='has-expiry'
                    label='Has Expiry Date'
                    idx={idx}
                    ques={ques}
                    readonly={readonly}
                    onChange="handleHasExpiryValue"
                />
                <Option
                    name='isEditableDoc'
                    className='has-editable-doc'
                    label='Is Editable Document'
                    idx={idx}
                    ques={ques}
                    readonly={readonly}
                    onChange="handleIsEditableDocValue"
                />
                <Option
                    name='isMultiAnswer'
                    className='is-multi-answer'
                    label="Multiple Answers"
                    idx={idx}
                    ques={ques}
                    readonly={readonly}
                    onChange="handleMultiAnswerValue"
                    showMultiple={this.showMultiple}
                />
                <Option
                    name='notify'
                    className='notify'
                    label={this.notifyLabel}
                    idx={idx}
                    ques={ques}
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly}
                    onChange="handleNotifyValue"
                    showNotify={this.showNotify}
                    onSelectNotified={onSelectNotified}
                    isConditional
                />
                <Option
                    name='linkDoc'
                    className='link-doc'
                    label={this.linkDocLabel}
                    idx={idx}
                    ques={ques}
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly}
                    onChange="handleLinkDoc"
                    onSelectTemplateDocDialog={onSelectTemplateDocDialog}
                    onViewTemplateDocDialog={onViewTemplateDocDialog}
                />
                <Option
                    name='attachResponseAttachment'
                    className='attach-response-attachment'
                    label="Response Attachment"
                    idx={idx}
                    ques={ques}
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly}
                    onChange="handleResponseAttachment"
                    showResponseAttachment={this.showResponseAttachment}
                    isConditional
                />
                <Option
                    name='responseAttachmentRequired'
                    className='response-attachment-required'
                    label="Response Attachment Required"
                    idx={idx}
                    ques={ques}
                    isLibrary={isLibrary}
                    isPrivate={isPrivate}
                    visibilityState={visibilityState}
                    readonly={readonly}
                    onChange="handleResponseAttachmentRequired"
                    showResponseAttachmentRequired={this.showResponseAttachmentRequired}
                    isConditional
                />
            </div>
            {!readonly && <IconButton aria-label="Copy" onClick={this.copyQuestion}>
                <FilterNoneIcon/>
            </IconButton>}
            {!readonly && <Divider orientation="vertical" flexItem/>}
            {!readonly && <IconButton aria-label="delete" onClick={this.deleteQuestion}>
                <DeleteOutlineIcon/>
            </IconButton>}
        </AccordionActions>;
    }
}

@observer
class Option extends React.Component {

    @observable state = {
        checked: false
    };

    constructor(props) {
        super(props);

        this.handleMandatoryValue = this.handleMandatoryValue.bind(this);
        this.handleHasExpiryValue = this.handleHasExpiryValue.bind(this);
        this.handleIsEditableDocValue = this.handleIsEditableDocValue.bind(this);
        this.handleMultiAnswerValue = this.handleMultiAnswerValue.bind(this);
        this.handleNotifyValue = this.handleNotifyValue.bind(this);
        this.handleLinkDoc = this.handleLinkDoc.bind(this);
        this.onSelectNotifyValueOption = this.onSelectNotifyValueOption.bind(this);
        this.onSelectLinkDocOption = this.onSelectLinkDocOption.bind(this);
        this.handleResponseAttachment = this.handleResponseAttachment.bind(this);
        this.handleResponseAttachmentRequired = this.handleResponseAttachmentRequired.bind(this);
    }

    componentWillMount() {
        const {ques, name} = this.props;
        if (name === 'isMandatory') {
            this.checked = !!ques.isMandatory;
        } else if (name === 'hasExpiry') {
            this.checked = !!ques.hasExpiry;
        } else if (name === 'isEditableDoc') {
            this.checked = !!ques.isEditableDoc;
        } else if (name === 'isMultiAnswer') {
            this.checked = !!ques.isMultiAnswer;
        } else if (name === 'notify') {
            this.checked = !!ques.notify;
        } else if (name === 'linkDoc') {
            this.checked = !!ques.linkDoc;
        } else if (name === 'attachResponseAttachment') {
            this.checked = !!ques.hasResponseAttachment;
        } else if (name === 'responseAttachmentRequired') {
            this.checked = !!ques.responseAttachmentRequired;
        } else {
            this.checked = false;
        }
    }

    handleMandatoryValue(evt, i) {
        const {idx, ques} = this.props;
        this.checked = ques.isMandatory = !ques.isMandatory;
    }

    handleHasExpiryValue(evt, i) {
        const {idx, ques} = this.props;
        this.checked = ques.hasExpiry = !ques.hasExpiry;
    }

    handleIsEditableDocValue(evt, i) {
        const {idx, ques} = this.props;
        this.checked = ques.isEditableDoc = !ques.isEditableDoc;
    }

    handleMultiAnswerValue(evt, i) {
        const {idx, ques} = this.props;
        this.checked = ques.isMultiAnswer = !ques.isMultiAnswer;
    }

    handleNotifyValue(evt, i) {
        const {idx, ques, onSelectNotified} = this.props;
//        console.log(ques.notify)
        if (ques.notify) {
            popover.settings({
                style: {minWidth: 180, width: 180},
                fixedCenter: true,
                isDialog: true,
                contentNode: <div>
                    <h4>---Select Option---</h4>
                    <NavItem action="View" onClick={this.onSelectNotifyValueOption} title='View Notify Value'/>
                    <NavItem action="Change" onClick={this.onSelectNotifyValueOption} title='Change Notify Value'/>
                    <NavItem action="Remove" onClick={this.onSelectNotifyValueOption} title='Remove Notify Value'/>
                </div>
            }).open();
        } else {
            onSelectNotified && onSelectNotified(evt, ques).then(({notifyAction, list}) => {
                ques.notifyAction = notifyAction;
                ques.notified_list = list;
                this.checked = ques.notify = true;
            });
        }
    }

    handleLinkDoc(evt, i) {
        const {idx, ques, onSelectTemplateDocDialog} = this.props;
        if (ques.linkDoc) {
            popover.settings({
                style: {minWidth: 180, width: 180},
                fixedCenter: true,
                isDialog: true,
                contentNode: <div>
                    <h4>---Select Option---</h4>
                    <NavItem action="View" onClick={this.onSelectLinkDocOption} title='View Document'/>
                    <NavItem action="Change" onClick={this.onSelectLinkDocOption} title='Change Document'/>
                    <NavItem action="Remove" onClick={this.onSelectLinkDocOption} title='Remove Document'/>
                </div>
            }).open();
        } else {
            onSelectTemplateDocDialog && onSelectTemplateDocDialog().then(item => {
                if (item) {
                    this.checked = !!(ques.linkDoc = item);
                }
            });
        }
    }

    onSelectNotifyValueOption(evt, el) {
        const {idx, ques, onSelectNotified, onViewNotifiedList} = this.props;
        const {action} = el.props;
        if (action === 'View') {
            onViewNotifiedList && onViewNotifiedList(ques);
        } else if (action === 'Change') {
            onSelectNotified && onSelectNotified(evt, ques).then(({notifyAction, list}) => {
                ques.notifyAction = notifyAction;
                ques.notified_list = list;
                this.checked = ques.notify = true;
            });
        } else if (action === 'Remove') {
            confirmDialog.open("Are you sure you want to remove the Notify Value?").then(res => {
                if (res === 1) {
                    ques.notified_list.clear();
                    this.checked = ques.notify = false;
                    ques.notifyAction = null;
                }
            });
        }
    }

    onSelectLinkDocOption(evt, el) {
        const {idx, ques, onSelectTemplateDocDialog, onViewTemplateDocDialog} = this.props;
        const {action} = el.props;
        if (action === 'View') {
            onViewTemplateDocDialog && onViewTemplateDocDialog(ques);
        } else if (action === 'Change') {
            onSelectTemplateDocDialog && onSelectTemplateDocDialog().then(item => {
                if (item) {
                    this.checked = !!(ques.linkDoc = item);
                }
            });
        } else if (action === 'Remove') {
            confirmDialog.open("Are you sure you want to remove the Document?").then(res => {
                if (res === 1) {
                    this.checked = !!(ques.linkDoc = null);
                }
            });
        }
    }

    handleResponseAttachment(evt, i) {
        const {idx, ques,} = this.props;
        this.checked = ques.hasResponseAttachment = !ques.hasResponseAttachment;
    }

    handleResponseAttachmentRequired(evt, i) {
        const {idx, ques,} = this.props;
        this.checked = ques.responseAttachmentRequired = !ques.responseAttachmentRequired;
    }

    set checked(val) {
        this.state.checked = val;
    }

    @computed get checked() {
        return this.state.checked;
    }

    render() {
        let {
            idx,
            ques,
            name,
            isConditional,
            showNotify,
            showResponseAttachment,
            showResponseAttachmentRequired,
            showMultiple,
            isLibrary,
            isPrivate,
            visibilityState,
            label,
            readonly,
            onChange,
            className,
            addRightLine
        } = this.props;
        if (isConditional && (!showNotify && !showResponseAttachment && !showResponseAttachmentRequired && !showMultiple)) {
            return null;
        }

        if(ques.questionType !== "Document" && name === "isEditableDoc") {
            return null;
        }

        const fun = this[onChange];

        if (name === 'notify' || name === 'linkDoc') {
            readonly = readonly || (isLibrary && (isPrivate || (visibilityState && visibilityState.value === 'EveryCompany')));
        }

        return <FormControlLabel
            key={new Date().getTime()}
            className={className + " label-response"}
            control={<Checkbox checked={this.checked}/>}
            disabled={readonly}
            label={label}
            onChange={evt => fun(evt, idx)}
        />;
    }
}

export default Actions;
