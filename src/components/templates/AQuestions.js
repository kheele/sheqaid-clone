// <editor-fold defaultstate="collapsed" desc="imports">
import React, {lazy, Suspense} from 'react';
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';

import {CircularProgress, Grid} from '@material-ui/core';

import {scrollTo} from '../../utils/Utils';

import NavItem from '../navs/NavItem';
import Popover from '../popovers/Popover';
import SelectEmployeesDialog from './SelectEmployeesDialog';
import PageLoadingProgress from '../PageLoadingProgress';

import ProfileDocTemplateDialog
    from '../../views/plugins/plugin_extra/__B_Contractors/dialogs/ProfileDocTemplateDialog';

import UploadDialog from './UploadDialog';
import SelectTemplateDocDialog from './SelectTemplateDocDialog';

import FormHeader from './FormHeader';
import FormBodyQuestionList from './FormBodyQuestionList';

const TitlePage = lazy(() => import('./TitlePage'/* webpackChunkName:"Templates.TitlePage" */));
// </editor-fold>

@observer
class AQuestions extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    style;
    @observable visibilityState = {
        value: null
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props, style) {
        super(props);
        
        this.style = style;
        
        this.scrollTo = scrollTo.bind(this);
        this.onFormOpen = this.onFormOpen.bind(this);
        
        this.clearQuestions = this.clearQuestions.bind(this);
        this.setQuestions = this.setQuestions.bind(this);
        this.addMoreSectionField = this.addMoreSectionField.bind(this);
        this.addMoreQuestionField = this.addMoreQuestionField.bind(this);

        this.onSelectNotified = this.onSelectNotified.bind(this);
        this.onSelectItemSelectNotified = this.onSelectItemSelectNotified.bind(this);
        this.renderItemSelectNotified = this.renderItemSelectNotified.bind(this);
        
        this.onUploadDialog = this.onUploadDialog.bind(this);
        this.onSelectTemplateDocDialog = this.onSelectTemplateDocDialog.bind(this);
        this.onViewTemplateDocDialog = this.onViewTemplateDocDialog.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentDidMount, componentWillUnmount">
    componentWillMount(){
        this.style.use();
    }
    
    async componentDidMount() {
        await this.defaultQuestionList();
        this.state.loadingFormData = false;
    }

    componentWillUnmount(){
        this.style.unuse();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onVisibilityChange">
    onVisibilityChange(visibility) {
        this.visibilityState.value = visibility;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="defaultQuestionList">
    async defaultQuestionList() {
        const {formData, defaultDocTitle, defaultType} = this.props;
        if (!this.isTitlePage) {
            if (formData && formData.questions) {
                let {type, name, desc, questions} = formData;
                
//                questions = await convertQuestionnaireObjectToArray(questions);
        
                console.log('questions', name, questions.length);
                questions.isEmpty() && (questions = [this.defaultQuestion]);
                this.state.formData = {type, name, desc, questions};
                
//                formData: {
//                    name: 'Untitled Template', 
//                    desc: '', 
//                    type: 'Inspection',// 
//                    questions: observable(new Map())
//                }
            } else {
                const {formData} = this.state;
                formData.type = defaultType || null;
                formData.name = defaultDocTitle || 'Untitled Template';
                formData.desc = '';
                this.setQuestions(formData.questions, this.defaultQuestion);
            }
        } else if (this.isTitlePage) {
            if (formData && formData.title_page_list) {
                let {type, title_page_list} = formData;
                
//                title_page_list = await convertQuestionnaireObjectToArray(title_page_list);
                
                console.log('title_page_list', title_page_list.length);
                title_page_list.isEmpty() && (title_page_list = this.defaultQuestions);
                this.state.formData = {type, questions: title_page_list};
                
//                formData: {
//                    name: 'Untitled Template', 
//                    desc: '', 
//                    type: 'Inspection',// 
//                    questions: observable(new Map())
//                }
            } else {
                const {formData} = this.state;
                formData.type = 'Title Page';
                this.setQuestions(formData.questions, this.defaultQuestions);
            }
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="defaultQuestion">
    get defaultQuestion() {
        return {
            questionText: "", 
            questionImage: null, 
            linkDoc: null, 
            score: null,
            maxScore: null, 
            isMandatory: false, 
            isMultiAnswer: false,
            hasExpiry: false,
            expiry: null,
            notify: false, 
            notifyAction: null, 
            notifiedList: [], 
            questionType: "Yes,No,N/A", 
            open: true
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="defaultSection">
    get defaultSection() {
        const sec = {
            sectionText: '', 
            linkDoc: null, 
            open: true,
            questions: observable(new Map())
        };
        this.setQuestions(sec.questions, this.defaultQuestion);
        return sec;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="clearQuestions">
    clearQuestions(evt, btn) {
        const {isSection, formData} = btn.props;
        if (isSection) {
            formData.questions = [this.defaultQuestion];
        } else {
            this.defaultQuestionList();
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setQuestions">
    setQuestions(questions, value) {
        const {questions: mainQuestions} = this.state.formData;
        
        if(isArray(value) || isObservableArray(value)) {
            if(questions.size === 0) {
                value.forEach((q, n) => {
                    const {idx, quesPath} = createNewQuesPath(mainQuestions, questions);
                    q.quesPath = quesPath;
                    q.idx = idx;
                    questions.set(q.idx, q);
                });
            } else {
                value.forEach((q, n) => {
                    const {idx, quesPath} = createNewQuesPath(mainQuestions, questions);
                    q.quesPath = quesPath;
                    q.idx = idx;
                    questions.set(q.idx, q);
                });
            }
        } else {
            const {idx, quesPath} = createNewQuesPath(mainQuestions, questions);
            value.quesPath = quesPath;
            value.idx = idx;
            questions.set(value.idx, value);
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="addMoreImpl">
    addMoreImpl(evt, btn, val) {
        const {getDialogDOM} = this.props;
        const {isSection, ques} = btn.props;
        
        const {formBody} = this.refs;
        const scroll = () => {
            setTimeout(() => {
//                const jq = $(btn.getDOMNode()).closest('.h-full').children('[data-rbd-droppable-id="droppable"]').children(':last-of-type');
//                console.log('addMoreImpl', jq[0])
//                const scrollTop = jq.height() + jq.offset().top;
//                $(getDialogDOM().querySelector('.dialog-content')).animate({scrollTop}, 1500, () => {
//                    jq.css('border', '2px solid red')
//                });
            }, 500);
        };
        if (isSection) {
            setTimeout(() => {
                ques.questions.forEach((q, key, map) => q.open = false);
                this.setQuestions(ques.questions, val);
                scroll();
            }, 0);
        } else {
            formBody.listRef.expandCloseAll().then(() => {
                this.setQuestions(this.state.formData.questions, val);
                scroll();
            });
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="addMoreSectionField">
    addMoreSectionField(evt, btn) {
        this.addMoreImpl(evt, btn, this.defaultSection);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="addMoreQuestionField">
    addMoreQuestionField(evt, btn) {
        this.addMoreImpl(evt, btn, this.defaultQuestion);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSelectNotified">
    onSelectNotified(evt, ques) {
        return new Promise((resolve, reject) => {
            const list = ques.questionType.split(',');
            this.refs.popover.ques = ques;
            this.refs.popover.onDone = resolve;
            this.refs.popover.settings({
                style: {minWidth: 200},
                fixedCenter: true,
                isDialog: true,
                contentNode: <div>
                    <h4>Notify If Answer Is:</h4>
                    {list.map(this.renderItemSelectNotified)}
                </div>
            }).open();
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSelectItemSelectNotified">
    onSelectItemSelectNotified(e, elem) {
        const {item} = elem.props;
        const {ques, onDone} = this.refs.popover;
        this.refs.selectEmployeesDialog.open(ques.notifiedList).then(list => {
            onDone({notifyAction: item, list});
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemSelectNotified">
    renderItemSelectNotified(item, n) {
        return <NavItem key={item} item={item} onClick={this.onSelectItemSelectNotified} title={item}/>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onUploadDialog">
    onUploadDialog(type) {
        const {readonly} = this.props;
        if(readonly) return Promise.resolve();
        return this.refs.uploadDialog.open(type);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSelectTemplateDocDialog">
    onSelectTemplateDocDialog() {
        const {readonly} = this.props;
        if(readonly) return Promise.resolve();
        return this.refs.selectTemplateDocDialog.open();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onViewTemplateDocDialog">
    onViewTemplateDocDialog(ques) {
        this.refs.viewTemplateDocDialog.open(ques.linkDoc);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onFormOpen">
    onFormOpen(evt, el) {
        const jq = $(evt.target);
        let currRow = jq.closest('.TitlePage');
        if(currRow.length === 0) {
            currRow = jq.closest('.FormBody');
        } 
        
        if (currRow.hasClass('active')) {
            currRow.removeClass('active');
        } else {
            const curr = currRow.addClass('active');
            currRow.prevAll("div").removeClass('active');
            currRow.nextAll("div").removeClass('active');
            this.scrollTo(curr);
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="isTitlePage">
    get isTitlePage() {
        return this.key === 'TitlePage';
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {readonly, item, defaultTitlePageQuestions, mainTitle, defaultType, isLibrary, isPrivate} = this.props;
        const {loadingFormData, formData} = this.state;
        const isTitlePage = this.isTitlePage;
        const className = isTitlePage ? "margin-t-15 margin-b-15 TitlePage" : "Questions";
        return <div className={"hor-center " + className}>
            <Grid container direction="column" justify="center" alignItems="center">
                {loadingFormData && <CircularProgress />}
                {!loadingFormData && <Grid item>
                    {!isTitlePage && <FormHeader formData={formData} readonly={readonly} mainTitle={mainTitle}/>}
                    {!isTitlePage && <Suspense fallback={<PageLoadingProgress />}>
                        <TitlePage 
                            ref="titlePage" 
                            getDialogDOM={this.props.getDialogDOM} 
                            defaultQuestions={defaultTitlePageQuestions} 
                            item={item} 
                            formData={item ? item.data.form : null} 
                            readonly={readonly}
                            onFormOpen={this.onFormOpen}/>
                    </Suspense>}
                    <FormBodyQuestionList 
                        ref="formBody"
                        defaultType={defaultType}
                        isTitlePage={isTitlePage} 
                        formData={formData} 
                        clearQuestions={this.clearQuestions} 
                        addMoreSectionField={this.addMoreSectionField} 
                        addMoreQuestionField={this.addMoreQuestionField} 
                        onSelectNotified={this.onSelectNotified} 
                        onUploadDialog={this.onUploadDialog}
                        onSelectTemplateDocDialog={this.onSelectTemplateDocDialog}
                        onViewTemplateDocDialog={this.onViewTemplateDocDialog}
                        onFormOpen={this.onFormOpen}
                        visibilityState={this.visibilityState}
                        isLibrary={isLibrary}
                        isPrivate={isPrivate}
                        readonly={readonly}/>        
                </Grid>}
            </Grid>
            <Popover key="popover" ref="popover"/>
            <ProfileDocTemplateDialog ref="viewTemplateDocDialog" />
            <SelectEmployeesDialog ref="selectEmployeesDialog" />
            {!readonly && <SelectTemplateDocDialog ref="selectTemplateDocDialog" />}
            {!readonly && <UploadDialog ref="uploadDialog"/>}
        </div>;
    }
    // </editor-fold>
}

function createNewQuesPath(mainQuestions, questions) {
//    if(questions.size === 0) {
//        
//    }
    
    const keys = questions.keys();
    const lastKey = keys.getLastElement(); 
    const lastQues = questions.get(lastKey);
    const quesPath = Object.getPathByValue(toJS(mainQuestions), lastQues);
    if(quesPath.isEmpty()) {
        quesPath.push('0');
    } else {
        const lastN = quesPath.pop();
        quesPath.push(`${lastN + 1}`);
    }
    
    const idx = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');
    
    console.log('{idx, quesPath}', {idx, quesPath})
    return {idx, quesPath};
}

export default AQuestions;//221